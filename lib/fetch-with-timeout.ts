/**
 * 타임아웃 및 재시도 기능이 내장된 fetch 유틸리티
 * PRD 5.3 (네트워크 오류 시 1초 대기 후 1회 자동 재시도)
 * PRD 5.4 (25초 타임아웃 강제 Abort - LLM 심층 연상 생성 시간 지원)
 */

export interface FetchOptions extends RequestInit {
  timeoutMs?: number;
  maxRetries?: number;
  retryDelayMs?: number;
}

export class TimeoutError extends Error {
  constructor(message = '요청 시간이 초과되었습니다.') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    timeoutMs = 25000, // 25초 타임아웃 설정 (LLM 생성 시간 보장)
    maxRetries = 1,    // PRD 5.3: 자동 1회 재요청
    retryDelayMs = 1000, // PRD 5.3: 1초 대기
    ...fetchOptions
  } = options;

  let attempt = 0;

  while (attempt <= maxRetries) {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timer);

      // 5xx 서버 에러 발생 시 재시도 조건 충족
      if (!response.ok && response.status >= 500 && attempt < maxRetries) {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        continue;
      }

      return response;
    } catch (err: unknown) {
      clearTimeout(timer);

      const isAbort = (err as Error)?.name === 'AbortError';
      if (isAbort) {
        // 타임아웃 발생 시 TimeoutError로 래핑하여 명확한 식별 지원
        throw new TimeoutError('요청 시간이 초과되었습니다. 다시 시도해 주세요.');
      }

      // 네트워크 단절 등의 오류인 경우 1회 재시도
      if (attempt < maxRetries) {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        continue;
      }

      throw err;
    }
  }

  throw new Error('최대 재시도 횟수를 초과했습니다.');
}
