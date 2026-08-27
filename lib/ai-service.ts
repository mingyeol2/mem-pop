import { z } from 'zod';
import { MemPopContent, ErrorType } from '@/types/mem-pop';

// 다중 키워드 구분자 정규식 (PRD 5.2)
const MULTI_DELIMITER_REGEX = /[,/&]/g;

// 스팸/무의미한 텍스트 패턴 검사 (PRD 5.5: ㅋㅋㅋㅋ, ㅎㅎㅎ, asdfgh, qwer 등)
const SPAM_REGEX = /^(ㅋ+|ㅎ+|asdf[a-z]*|qwer[a-z]*|zxcv[a-z]*|hjkl[a-z]*|test+|[!@#$%^&*~`+=]+|[ㄱ-ㅎ]+|[ㅏ-ㅣ]+)$/i;

/**
 * 키워드 유효성 사전 검증 (PRD 5.1, 5.2, 5.5)
 */
export function validateKeyword(keyword: string): { isValid: boolean; errorType?: ErrorType; message?: string } {
  const trimmed = keyword.trim();

  if (!trimmed) {
    return {
      isValid: false,
      errorType: 'EMPTY_INPUT',
      message: '외우고 싶은 단어나 개념을 입력해 주세요.',
    };
  }

  if (trimmed.length > 30) {
    return {
      isValid: false,
      errorType: 'MULTIPLE_INPUT',
      message: '30자 이내로 입력해 주세요.',
    };
  }

  const delimiterMatches = trimmed.match(MULTI_DELIMITER_REGEX);
  if (delimiterMatches && delimiterMatches.length >= 2) {
    return {
      isValid: false,
      errorType: 'MULTIPLE_INPUT',
      message: '한 번에 한 가지 개념만 입력할 때 암기 효과가 가장 높습니다. 단어 하나만 입력해 주세요.',
    };
  }

  const stripped = trimmed.replace(/\s/g, '');
  if (SPAM_REGEX.test(stripped) || (stripped.length <= 1 && /[ㄱ-ㅎㅏ-ㅣ]/.test(stripped))) {
    return {
      isValid: false,
      errorType: 'INVALID_INPUT',
      message: '올바른 단어 또는 개념을 입력해 주세요. (예: 역사적 사건, 영단어, 전문 용어)',
    };
  }

  return { isValid: true };
}

// Zod 검증 스키마 정의 (PRD 4.2, 5.6)
export const MemPopContentSchema = z.object({
  keyword: z.string().optional(),
  summary: z.string().optional(),
  background: z.string().optional(),
  story: z.array(z.string().min(1)).length(3),
  quiz: z.object({
    question: z.string().min(1),
    options: z.array(z.string().min(1)).length(3),
    answer_index: z.union([z.literal(0), z.literal(1), z.literal(2)]),
    explanation: z.string().min(1),
  }),
  error: z.string().optional(),
});

/**
 * AI 응답 JSON 스키마 검증기 (Zod 기반 및 마크다운 안전 파싱)
 */
export function parseAndValidateAIResponse(jsonString: string): MemPopContent {
  let parsedRaw: unknown;
  try {
    // 마크다운 코드 블록(```json ... ```) 안전 제거 및 JSON 파싱
    const cleanJson = jsonString.replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, '$1').trim();
    parsedRaw = JSON.parse(cleanJson);
  } catch (parseError) {
    console.error('JSON parse error from Gemini raw text:', parseError, jsonString);
    throw new Error('PARSE_ERROR');
  }

  // 가드레일 에러 확인 (PRD 5.5)
  if (typeof parsedRaw === 'object' && parsedRaw !== null && (parsedRaw as any).error === 'INVALID_INPUT') {
    throw new Error('INVALID_INPUT');
  }

  const parseResult = MemPopContentSchema.safeParse(parsedRaw);
  if (!parseResult.success) {
    console.error('Zod schema validation failed on AI response:', parseResult.error);
    throw new Error('PARSE_ERROR');
  }

  const data = parseResult.data;
  const summaryText = (data.summary || data.background || '').trim();
  if (!summaryText) {
    throw new Error('PARSE_ERROR');
  }

  return {
    keyword: data.keyword || '',
    summary: summaryText,
    background: summaryText,
    story: [data.story[0], data.story[1], data.story[2]],
    quiz: {
      question: data.quiz.question,
      options: [data.quiz.options[0], data.quiz.options[1], data.quiz.options[2]],
      answer_index: data.quiz.answer_index,
      explanation: data.quiz.explanation,
    },
  };
}
