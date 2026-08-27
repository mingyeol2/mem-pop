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

/**
 * AI 응답 JSON 스키마 검증기 (PRD 4.2, 5.6)
 * 규격: summary, story (3줄), quiz (question, options 3개, answer_index 0~2, explanation)
 */
export function parseAndValidateAIResponse(jsonString: string): MemPopContent {
  let parsed: any;
  try {
    // 마크다운 코드 블록 제거 후 파싱
    const cleanJson = jsonString.replace(/```json\s*|\s*```/g, '').trim();
    parsed = JSON.parse(cleanJson);
  } catch {
    throw new Error('PARSE_ERROR');
  }

  // 가드레일 에러 확인 (PRD 5.5)
  if (parsed.error === 'INVALID_INPUT') {
    throw new Error('INVALID_INPUT');
  }

  const summary = (parsed.summary || parsed.background || '').trim();

  // 필수 필드 및 규격 검증
  if (
    !parsed ||
    typeof parsed !== 'object' ||
    !summary ||
    !Array.isArray(parsed.story) ||
    parsed.story.length !== 3 ||
    !parsed.quiz ||
    typeof parsed.quiz.question !== 'string' ||
    !Array.isArray(parsed.quiz.options) ||
    parsed.quiz.options.length !== 3 ||
    typeof parsed.quiz.answer_index !== 'number' ||
    ![0, 1, 2].includes(parsed.quiz.answer_index) ||
    typeof parsed.quiz.explanation !== 'string'
  ) {
    throw new Error('PARSE_ERROR');
  }

  return {
    keyword: parsed.keyword || '',
    summary,
    background: summary, // 하위 호환
    story: [String(parsed.story[0]), String(parsed.story[1]), String(parsed.story[2])],
    quiz: {
      question: parsed.quiz.question,
      options: [String(parsed.quiz.options[0]), String(parsed.quiz.options[1]), String(parsed.quiz.options[2])],
      answer_index: parsed.quiz.answer_index as 0 | 1 | 2,
      explanation: parsed.quiz.explanation,
    },
  };
}
