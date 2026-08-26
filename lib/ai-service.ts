import { MemPopContent, GenerateResponse, ErrorType } from '@/types/mem-pop';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts';

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
  if (SPAM_REGEX.test(stripped) || stripped.length <= 1 && /[ㄱ-ㅎㅏ-ㅣ]/.test(stripped)) {
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

  // 필수 필드 및 규격 검증
  if (
    !parsed ||
    typeof parsed !== 'object' ||
    typeof parsed.background !== 'string' ||
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
    background: parsed.background,
    story: [String(parsed.story[0]), String(parsed.story[1]), String(parsed.story[2])],
    quiz: {
      question: parsed.quiz.question,
      options: [String(parsed.quiz.options[0]), String(parsed.quiz.options[1]), String(parsed.quiz.options[2])],
      answer_index: parsed.quiz.answer_index as 0 | 1 | 2,
      explanation: parsed.quiz.explanation,
    },
  };
}

/**
 * 사전 빌트인 예시 및 지능형 폴백 생성기
 */
const CURATED_KNOWLEDGE: Record<string, Omit<MemPopContent, 'keyword'>> = {
  '1592': {
    background: '1592년 왜군이 조선을 침략하여 7년간 이어진 전쟁으로, 전국적인 의병 봉기와 이순신 장군의 활약이 빛난 대표적인 국난입니다.',
    story: [
      '왜적이 쳐들어와 온 국토가 불타고 난리가 났습니다.',
      "온 백성이 '이(1)러고(5) 구(9)경(2)만 할 거냐!' 하며 의병을 일으킴!",
      '1592년 = 이러고 구경(이)만 하냐! 임진왜란 발발!',
    ],
    quiz: {
      question: 'Q. 임진왜란이 일어난 연도로 올바른 것은?',
      options: ['① 1392년', '② 1592년', '③ 1636년'],
      answer_index: 1,
      explanation: "'이(1)러고(5) 구(9)경(2)하냐'를 떠올리면 1592년을 바로 기억할 수 있습니다!",
    },
  },
  '임진왜란': {
    background: '1592년 왜군이 조선을 침략하여 7년간 이어진 전쟁으로, 전국적인 의병 봉기와 이순신 장군의 활약이 빛난 대표적인 국난입니다.',
    story: [
      '왜적이 쳐들어와 온 국토가 불타고 난리가 났습니다.',
      "온 백성이 '이(1)러고(5) 구(9)경(2)만 할 거냐!' 하며 의병을 일으킴!",
      '1592년 = 이러고 구경(이)만 하냐! 임진왜란 발발!',
    ],
    quiz: {
      question: 'Q. 임진왜란이 일어난 연도로 올바른 것은?',
      options: ['① 1392년', '② 1592년', '③ 1636년'],
      answer_index: 1,
      explanation: "'이(1)러고(5) 구(9)경(2)하냐'를 떠올리면 1592년을 바로 기억할 수 있습니다!",
    },
  },
  '미토콘드리아': {
    background: '세포 내에서 세포 호흡을 통해 생명 활동에 필요한 에너지(ATP)를 생산하는 핵심 세포 소기관입니다.',
    story: [
      '우리 몸의 세포 안에는 쉬지 않고 돌아가는 작은 에너지 발전소가 있습니다.',
      '고기(Meat/미트)를 든든하게 먹었더니 발전소에서 에너지가 팍팍!',
      '미트(Meat) 먹고 힘 팍팍! = 미토콘드리아는 세포의 에너지 발전소!',
    ],
    quiz: {
      question: "Q. 세포 내에서 호흡을 통해 에너지를 생성하는 '세포의 발전소' 역할을 하는 소기관은?",
      options: ['① 리보솜', '② 미토콘드리아', '③ 엽록체'],
      answer_index: 1,
      explanation: '고기(Meat) 먹고 힘(에너지)을 낸다고 연상하면 미토콘드리아가 바로 떠오릅니다!',
    },
  },
  'mitigate': {
    background: "'(고통·피해·충격 등을) 완화하다, 경감시키다'라는 의미를 가진 빈출 필수 영단어입니다.",
    story: [
      '극심한 통증과 고통으로 끙끙 앓고 있는 환자가 있습니다.',
      "특효약을 아픈 부위 '밑에(Miti) 갖다(gate)' 대어 진정시키는 장면을 떠올려 보세요.",
      '밑에 갖다 대니 통증 완화! = Mitigate (완화하다)',
    ],
    quiz: {
      question: "Q. 영단어 'mitigate'의 올바른 의미로 알맞은 것은?",
      options: ['① 완화하다, 경감시키다', '② 악화시키다', '③ 모방하다'],
      answer_index: 0,
      explanation: "'밑에 갖다 대니 완화된다'를 떠올리면 mitigate의 의미를 바로 외울 수 있습니다!",
    },
  },
};

/**
 * 지능형 템플릿 생성기 (Fallback / Standalone)
 */
export function generateMemoryContent(keyword: string): MemPopContent {
  const normalized = keyword.toLowerCase().trim();

  for (const [key, value] of Object.entries(CURATED_KNOWLEDGE)) {
    if (normalized.includes(key.toLowerCase())) {
      return {
        keyword,
        ...value,
      };
    }
  }

  // 일반 키워드에 대한 스마트 규칙 기반 연상 생성
  return {
    keyword,
    background: `"${keyword}"은(는) 시험과 실무 학습에서 자주 등장하는 핵심 개념으로, 빠른 시각화와 연상 고리가 필수적입니다.`,
    story: [
      `[상황 연결] ${keyword}을(를) 마주쳤을 때 가장 먼저 떠오르는 결정적 장면을 머릿속에 그립니다.`,
      `[말장난/연상] '${keyword}'의 독특한 발음과 일상 속 친숙한 이미지를 강렬하게 결합합니다.`,
      `[펀치라인] 단어 발음 + 강력한 이미지 = ${keyword} 뇌리에 영구 각인 완료!`,
    ],
    quiz: {
      question: `Q. 방금 학습한 암기 키워드 '${keyword}'에 대한 설명으로 가장 적절한 것은?`,
      options: [
        `① 방금 학습한 핵심 개념 (${keyword})`,
        `② 아직 학습하지 않은 오답 개념 A`,
        `③ 혼동하기 쉬운 오답 개념 B`,
      ],
      answer_index: 0,
      explanation: `${keyword}의 핵심 연상 포인트와 펀치라인을 다시 한번 상기해 보세요!`,
    },
  };
}
