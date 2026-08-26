'use client';

import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Brain } from 'lucide-react';
import { MemPopContent, ErrorType, GenerateResponse } from '@/types/mem-pop';
import { fetchWithTimeout, TimeoutError } from '@/lib/fetch-with-timeout';
import { KeywordInput } from '@/components/keyword-input';
import { StoryCard } from '@/components/story-card';
import { QuizCard } from '@/components/quiz-card';
import { ActionButtons } from '@/components/action-buttons';
import { GuardrailCard } from '@/components/guardrail-card';
import { ErrorCard } from '@/components/error-card';

export default function Page() {
  const [keyword, setKeyword] = useState('');
  const [emptyTouched, setEmptyTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<MemPopContent | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [errorState, setErrorState] = useState<{ errorType: ErrorType; message: string } | null>(null);

  const handleGenerate = useCallback(
    async (targetKeyword?: string) => {
      const activeKeyword = (targetKeyword !== undefined ? targetKeyword : keyword).trim();

      // PRD 5.1: 빈 값 검증
      if (!activeKeyword) {
        setEmptyTouched(true);
        return;
      }

      // PRD 5.2: 다중 키워드 구분자 검증
      const delimiterMatches = activeKeyword.match(/[,/&]/g);
      if (delimiterMatches && delimiterMatches.length >= 2) {
        return;
      }

      if (activeKeyword.length > 30) {
        return;
      }

      // 상태 초기화 및 로딩 시작
      setLoading(true);
      setErrorState(null);
      setContent(null);
      setSelectedQuizOption(null);

      try {
        // PRD 5.3: 네트워크 오류 시 1회 자동 재시도
        // PRD 5.4: 10초 타임아웃 Abort
        const res = await fetchWithTimeout('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ keyword: activeKeyword }),
          timeoutMs: 10000,
          maxRetries: 1,
          retryDelayMs: 1000,
        });

        const json = (await res.json()) as GenerateResponse;

        if (!res.ok || !json.success) {
          const errorType = !json.success ? json.error : 'SERVER_ERROR';

          if (errorType === 'INVALID_INPUT') {
            // PRD 5.5: AI 가드레일 예외 처리
            setErrorState({
              errorType: 'INVALID_INPUT',
              message: '올바른 단어 또는 개념을 입력해 주세요. (예: 역사적 사건, 영단어, 전문 용어)',
            });
          } else if (errorType === 'PARSE_ERROR') {
            // PRD 5.6: JSON 파싱 예외 처리
            setErrorState({
              errorType: 'PARSE_ERROR',
              message: '결과를 생성하는 중 형식이 맞지 않아 실패했습니다. 다시 생성하기를 눌러주세요.',
            });
          } else {
            // PRD 5.3: 서버 에러
            setErrorState({
              errorType: 'SERVER_ERROR',
              message: '일시적인 오류로 인해 암기법 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.',
            });
          }
          return;
        }

        // 성공 응답 수신
        setContent(json.data);
      } catch (err: unknown) {
        if (err instanceof TimeoutError) {
          // PRD 5.4: 10초 타임아웃 예외 처리
          setErrorState({
            errorType: 'TIMEOUT',
            message: '요청 시간이 초과되었습니다. 다시 시도해 주세요.',
          });
        } else {
          // PRD 5.3: 네트워크 오류 최종 실패
          setErrorState({
            errorType: 'NETWORK_ERROR',
            message: '일시적인 오류로 인해 암기법 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.',
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [keyword]
  );

  const handleReset = () => {
    setKeyword('');
    setContent(null);
    setSelectedQuizOption(null);
    setErrorState(null);
    setEmptyTouched(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setKeyword(suggestion);
    setEmptyTouched(false);
    setErrorState(null);
    handleGenerate(suggestion);
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:py-14">
      <div className="mx-auto flex max-w-xl flex-col gap-7">
        {/* 상단 헤더 영역 */}
        <header className="text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <Sparkles className="size-3.5" />
            <span>AI 암기 튜터</span>
          </div>

          <h1 className="text-balance text-3xl font-black tracking-tight sm:text-4xl">
            <span className="inline-flex items-center gap-2">
              <Brain className="size-8 text-primary sm:size-9" />
              짤기억
            </span>{' '}
            <span className="text-primary">(Mem-Pop)</span>
          </h1>

          <p className="mt-3 text-pretty text-base font-bold text-foreground/80 sm:text-lg">
            안 외워지는 단어·개념·연도를 3초 만에 뇌리에 콱!
          </p>
          <p className="mx-auto mt-1.5 max-w-md text-pretty text-xs leading-relaxed text-muted-foreground sm:text-sm">
            외우기 힘든 하나의 사건이나 개념을 입력하면 배경 설명과 펀치라인 암기 팁, 1초 확인 퀴즈를 생성합니다.
          </p>
        </header>

        {/* 1. 키워드 입력 섹션 */}
        <KeywordInput
          keyword={keyword}
          onChange={(val) => {
            setKeyword(val);
            if (emptyTouched && val.trim()) {
              setEmptyTouched(false);
            }
            if (errorState) {
              setErrorState(null);
            }
          }}
          onSubmit={handleGenerate}
          loading={loading}
          emptyTouched={emptyTouched}
          onBlur={() => {
            if (!keyword.trim()) {
              setEmptyTouched(true);
            }
          }}
          onClear={() => {
            setKeyword('');
            setErrorState(null);
          }}
          isInvalidGuardrail={errorState?.errorType === 'INVALID_INPUT'}
        />

        {/* 2. 에러 및 가드레일 안내 영역 */}
        <AnimatePresence mode="wait">
          {errorState && !loading && (
            <motion.div
              key={errorState.errorType}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {errorState.errorType === 'INVALID_INPUT' ? (
                <GuardrailCard
                  message={errorState.message}
                  onSuggestionClick={handleSuggestionSelect}
                />
              ) : (
                <ErrorCard
                  errorType={errorState.errorType}
                  message={errorState.message}
                  onRetry={() => handleGenerate()}
                  loading={loading}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. 정상 생성 결과 영역 (3줄 스토리 + 1초 퀴즈 + 액션 버튼) */}
        <AnimatePresence mode="wait">
          {content && !loading && (
            <motion.div
              key={content.keyword}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex flex-col gap-5"
            >
              {/* 배경 & 3줄 연상 암기 스토리 카드 */}
              <StoryCard content={content} />

              {/* 3지선다 1초 확인 퀴즈 카드 */}
              <QuizCard
                quiz={content.quiz}
                selectedIndex={selectedQuizOption}
                onSelectOption={(idx) => setSelectedQuizOption(idx)}
              />

              {/* 하단 액션 버튼 (다시 생성하기 / 새로운 단어 입력) */}
              <ActionButtons
                onRegenerate={() => handleGenerate()}
                onReset={handleReset}
                loading={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 푸터 영역 */}
        <footer className="pt-4 pb-6 text-center text-xs font-medium text-muted-foreground">
          기억은 연결될 때 오래 남아요 · Mem-Pop
        </footer>
      </div>
    </main>
  );
}
