import { NextRequest, NextResponse } from 'next/server';
import { GenerateRequest, GenerateResponse } from '@/types/mem-pop';
import {
  validateKeyword,
  parseAndValidateAIResponse,
} from '@/lib/ai-service';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompts';

export const maxDuration = 60;

async function callGeminiAPI(keyword: string, apiKey: string): Promise<string> {
  const models = [
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.7-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-lite-latest',
  ];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: buildUserPrompt(keyword) }],
              },
            ],
            systemInstruction: {
              parts: [{ text: SYSTEM_PROMPT }],
            },
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.7,
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_NONE',
              },
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_NONE',
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_NONE',
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_NONE',
              },
              {
                category: 'HARM_CATEGORY_CIVIC_INTEGRITY',
                threshold: 'BLOCK_NONE',
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.warn(`Gemini model ${model} failed (${response.status}):`, errorBody);
        lastError = new Error(`Gemini API error: ${response.status}`);
        continue;
      }

      const data = await response.json();

      // 안전 필터 또는 차단 단어로 인해 출력이 차단된 경우 명확한 INVALID_INPUT 처리
      if (
        data?.promptFeedback?.blockReason ||
        data?.candidates?.[0]?.finishReason === 'SAFETY' ||
        data?.candidates?.[0]?.finishReason === 'BLOCKLIST' ||
        data?.candidates?.[0]?.finishReason === 'PROHIBITED_CONTENT'
      ) {
        console.warn(`Gemini safety filter triggered for keyword "${keyword}"`);
        throw new Error('INVALID_INPUT');
      }

      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) {
        return generatedText;
      }
    } catch (err: any) {
      if (err?.message === 'INVALID_INPUT') {
        throw err;
      }
      console.warn(`Network error calling Gemini model ${model}:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

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

    const trimmedKeyword = keyword.trim();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured in environment variables');
      return NextResponse.json(
        {
          success: false,
          error: 'SERVER_ERROR',
          message: 'AI API 설정 오류입니다. 관리자에게 문의해 주세요.',
        },
        { status: 500 }
      );
    }

    // 2. Gemini API 실시간 호출 (하드코딩 분기 없이 100% 실시간 생성)
    try {
      const rawJson = await callGeminiAPI(trimmedKeyword, apiKey);
      const data = parseAndValidateAIResponse(rawJson);
      return NextResponse.json({
        success: true,
        data: {
          ...data,
          keyword: trimmedKeyword,
        },
      });
    } catch (aiError: any) {
      console.error('Gemini API call or parse error:', aiError);
      if (aiError?.message === 'INVALID_INPUT') {
        return NextResponse.json(
          {
            success: false,
            error: 'INVALID_INPUT',
            message: '올바른 단어 또는 개념을 입력해 주세요. (예: 역사적 사건, 영단어, 전문 용어)',
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: aiError?.message === 'PARSE_ERROR' ? 'PARSE_ERROR' : 'SERVER_ERROR',
          message: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Global API route error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      },
      { status: 500 }
    );
  }
}
