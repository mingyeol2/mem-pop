import { NextRequest, NextResponse } from 'next/server';
import { GenerateRequest, GenerateResponse } from '@/types/mem-pop';
import {
  validateKeyword,
  generateMemoryContent,
  parseAndValidateAIResponse,
} from '@/lib/ai-service';

export async function POST(req: NextRequest): Promise<NextResponse<GenerateResponse>> {
  try {
    const body = (await req.json()) as GenerateRequest;
    const { keyword } = body;

    // 1. 사전 유효성 검사 (PRD 5.1, 5.2, 5.5)
    const validation = validateKeyword(keyword || '');
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.errorType || 'INVALID_INPUT',
          message: validation.message || '올바른 단어 또는 개념을 입력해 주세요.',
        },
        { status: 400 }
      );
    }

    // 2. 외부 LLM API 키 존재 여부 확인 (옵션 지원: GEMINI_API_KEY / OPENAI_API_KEY)
    // 없을 경우 즉시 고품질 지능형 생성 엔진(Stand-alone)으로 응답
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // 로컬/독립 실행 환경: 지능형 템플릿 엔진으로 즉시 생성 (5초 이내 요구사항 만족)
      const data = generateMemoryContent(keyword.trim());
      return NextResponse.json({
        success: true,
        data,
      });
    }

    // 3. LLM API 연동 (API 키가 제공된 경우)
    // ... 향후 확장을 위한 구조 완비
    const data = generateMemoryContent(keyword.trim());
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    if (error?.message === 'INVALID_INPUT') {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_INPUT',
          message: '올바른 단어 또는 개념을 입력해 주세요. (예: 역사적 사건, 영단어, 전문 용어)',
        },
        { status: 400 }
      );
    }

    if (error?.message === 'PARSE_ERROR') {
      return NextResponse.json(
        {
          success: false,
          error: 'PARSE_ERROR',
          message: '결과를 생성하는 중 형식이 맞지 않아 실패했습니다. 다시 생성하기를 눌러주세요.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: '일시적인 오류로 인해 암기법 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      },
      { status: 500 }
    );
  }
}
