'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Brain, BookMarked, Home, ArrowLeft } from 'lucide-react';
import { MemPopContent, ErrorType, GenerateResponse } from '@/types/mem-pop';
import { fetchWithTimeout, TimeoutError } from '@/lib/fetch-with-timeout';
import { KeywordInput } from '@/components/keyword-input';
import { StoryCard } from '@/components/story-card';
import { QuizCard } from '@/components/quiz-card';
import { ActionButtons } from '@/components/action-buttons';
import { GuardrailCard } from '@/components/guardrail-card';
import { ErrorCard } from '@/components/error-card';
import { SavedCardsDrawer } from '@/components/saved-cards-drawer';
import { LandingView } from '@/components/landing-view';
import { getSavedCards, removeCard } from '@/lib/storage';
import { SavedMemPopCard } from '@/types/storage';

export default function Page() {
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [keyword, setKeyword] = useState('');
  const [emptyTouched, setEmptyTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<MemPopContent | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [errorState, setErrorState] = useState<{ errorType: ErrorType; message: string } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [savedCards, setSavedCards] = useState<SavedMemPopCard[]>([]);

  const refreshSavedCards = useCallback(() => {
    setSavedCards(getSavedCards());
  }, []);

  useEffect(() => {
    refreshSavedCards();
  }, [refreshSavedCards]);

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
        // PRD 5.4: 25초 타임아웃 Abort (LLM 실시간 생성 시간 보장)
        const res = await fetchWithTimeout('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ keyword: activeKeyword }),
          timeoutMs: 25000,
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
          // PRD 5.4: 타임아웃 예외 처리
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

  const handleStartFromLanding = (initialKeyword?: string) => {
    setCurrentView('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (initialKeyword) {
      setKeyword(initialKeyword);
      handleGenerate(initialKeyword);
    }
  };

  const handleReset = () => {
    setKeyword('');
    setContent(null);
    setSelectedQuizOption(null);
    setErrorState(null);
    setEmptyTouched(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSavedCard = (savedCard: SavedMemPopCard) => {
    setKeyword(savedCard.keyword);
    setContent(savedCard.content);
    setSelectedQuizOption(null);
    setErrorState(null);
    setEmptyTouched(false);
    setCurrentView('app');
  };

  const handleDeleteSavedCard = (id: string) => {
    removeCard(id);
    refreshSavedCards();
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setKeyword(suggestion);
    handleGenerate(suggestion);
  };

  // 랜딩페이지 뷰
  if (currentView === 'landing') {
    return <LandingView onStartService={handleStartFromLanding} />;
  }

  // 실제 AI 암기 서비스 뷰
  return (
    <main className="min-h-screen bg-[#FFF8EF] px-4 py-6 text-[#1A1C1E] sm:py-10">
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        {/* 상단 네비게이션 헤더 */}
        <header className="relative">
          <div className="mb-4 flex items-center justify-between">
            {/* 홈(랜딩페이지) 돌아가기 버튼 */}
            <button
              type="button"
              onClick={() => setCurrentView('landing')}
              className="neo-btn inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-black text-[#1A1C1E] transition hover:bg-[#FFD600]/30"
              title="서비스 소개 랜딩페이지로 이동"
            >
              <ArrowLeft className="size-3.5 stroke-[3]" />
              <span>서비스 소개</span>
            </button>

            {/* 우측 상단 내 암기장 열기 버튼 */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="neo-btn inline-flex items-center gap-1.5 rounded-xl bg-[#FFD600] px-3.5 py-1.5 text-xs font-black text-[#1A1C1E] transition hover:bg-[#ffe144]"
              aria-label="나만의 암기장 열기"
            >
              <BookMarked className="size-3.5 stroke-[2.5]" />
              <span>내 암기장</span>
              {savedCards.length > 0 && (
                <span className="flex size-4 items-center justify-center rounded-full bg-[#1A1C1E] text-[10px] font-black text-white">
                  {savedCards.length}
                </span>
              )}
            </button>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#1A1C1E] bg-[#70F6FF] px-3.5 py-1 font-mono-tag text-xs font-black text-[#1A1C1E] shadow-[2px_2px_0px_#1A1C1E] mb-2">
              <Sparkles className="size-3.5" />
              <span>AI 암기 튜터 실시간 생성</span>
            </div>

            <h1 className="font-heading text-3xl font-black tracking-tight sm:text-4xl">
              <span className="inline-flex items-center gap-2">
                <Brain className="size-8 text-[#1A1C1E] sm:size-9" />
                짤기억
              </span>{' '}
              <span className="bg-[#FFD600] px-2 py-0.5 border-2 border-[#1A1C1E] rounded-lg shadow-[2px_2px_0_0_#1A1C1E] inline-block text-xl sm:text-2xl font-black">
                Mem-Pop
              </span>
            </h1>

            <p className="mt-2.5 text-base font-black text-[#1A1C1E]/90 sm:text-lg">
              안 외워지는 단어·개념·연도를 3초 만에 뇌리에 콱!
            </p>
            <p className="mx-auto mt-1 max-w-md text-xs font-bold leading-relaxed text-[#1A1C1E]/70 sm:text-sm">
              외우고 싶은 단어를 입력하면 3줄 연상 스토리와 1초 퀴즈를 즉시 생성합니다.
            </p>
          </div>
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
              <StoryCard content={content} onSavedChange={refreshSavedCards} />

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

        {/* 나만의 암기장 서랍 모달 */}
        <SavedCardsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          savedCards={savedCards}
          onSelectCard={handleSelectSavedCard}
          onDeleteCard={handleDeleteSavedCard}
        />

        {/* 푸터 영역 */}
        <footer className="pt-4 pb-8 text-center text-xs font-bold text-[#1A1C1E]/60">
          단어를 짤처럼, 기억은 팝하게 · Mem-Pop
        </footer>
      </div>
    </main>
  );
}

