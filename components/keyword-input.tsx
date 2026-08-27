'use client';

import React, { useRef, useEffect } from 'react';
import { Search, X, AlertCircle, LoaderCircle, Lightbulb, Sparkles } from 'lucide-react';

interface KeywordInputProps {
  keyword: string;
  onChange: (value: string) => void;
  onSubmit: (keyword?: string) => void;
  loading: boolean;
  emptyTouched: boolean;
  onBlur: () => void;
  onClear: () => void;
  errorMessage?: string;
  isInvalidGuardrail?: boolean;
}

const SUGGESTIONS = ['임진왜란 1592', '미토콘드리아', 'mitigate'];

export const KeywordInput: React.FC<KeywordInputProps> = ({
  keyword,
  onChange,
  onSubmit,
  loading,
  emptyTouched,
  onBlur,
  onClear,
  errorMessage,
  isInvalidGuardrail,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // 다중 구분자 (쉼표, 슬래시, 앤드) 2개 이상 감지 (PRD 5.2)
  const delimiterMatches = keyword.match(/[,/&]/g);
  const isMultiple = Boolean(delimiterMatches && delimiterMatches.length >= 2);

  // 빈 값 유효성 상태 (PRD 5.1)
  const isBlank = !keyword.trim();
  const showEmptyError = emptyTouched && isBlank;

  // 가드레일 발생 시 포커스 유지 (PRD 5.5)
  useEffect(() => {
    if (isInvalidGuardrail) {
      inputRef.current?.focus();
    }
  }, [isInvalidGuardrail]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && (e as any).keyCode !== 229) {
      if (!isBlank && !isMultiple && !loading) {
        onSubmit();
      }
    }
  };

  const LOADING_MESSAGES = [
    '🧠 키워드의 결정적 연상 고리를 분석하는 중...',
    '⚡ 뇌리에 박히는 기발한 3줄 스토리를 짜내는 중...',
    '🎯 직관적인 1초 확인 퀴즈와 해설을 출제하는 중...',
    '✨ 거의 다 되었어요! 짤기억 카드를 다듬는 중...',
  ];
  const [loadingMsgIndex, setLoadingMsgIndex] = React.useState(0);

  useEffect(() => {
    if (!loading) {
      setLoadingMsgIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [loading]);

  const isButtonDisabled = isBlank || isMultiple || loading;

  return (
    <section
      className="w-full rounded-3xl border border-border/80 bg-card/90 p-5 shadow-xl shadow-primary/5 backdrop-blur-sm sm:p-7"
      aria-label="암기 키워드 입력"
    >
      <div className="flex flex-col gap-2">
        <div
          className={`relative flex items-center rounded-2xl border bg-background px-4 py-1 transition-all duration-200 ${
            showEmptyError
              ? 'border-destructive ring-4 ring-destructive/10'
              : isMultiple
              ? 'border-amber-500 ring-4 ring-amber-500/10'
              : 'border-input focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10'
          }`}
        >
          <Search className="mr-2.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            maxLength={30}
            value={keyword}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
            placeholder="외우고 싶은 단어, 개념, 연도를 1개만 입력하세요. 예: 임진왜란 1592, mitigate"
            className="min-w-0 flex-1 bg-transparent py-3.5 text-sm font-medium outline-none placeholder:text-muted-foreground/60 sm:text-base"
            aria-label="외우고 싶은 단어, 개념, 연도 입력"
          />

          {/* 30자 카운터 (PRD 4.1, 5.2) */}
          <span className="ml-2 shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
            {keyword.length}/30
          </span>

          {/* 지우기 버튼 */}
          {keyword && (
            <button
              type="button"
              onClick={onClear}
              className="ml-2 rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="입력 내용 지우기"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* 빈 값 에러 문구 (PRD 5.1) */}
        {showEmptyError && (
          <p className="flex items-center gap-1.5 px-1 text-xs font-bold text-destructive animate-in fade-in">
            <AlertCircle className="size-3.5" />
            외우고 싶은 단어나 개념을 입력해 주세요.
          </p>
        )}

        {/* 다중 단어 경고 문구 (PRD 5.2) */}
        {isMultiple && (
          <p className="flex items-center gap-1.5 px-1 text-xs font-bold text-amber-600 dark:text-amber-400 animate-in fade-in">
            <AlertCircle className="size-3.5" />
            한 번에 한 가지 개념만 입력할 때 암기 효과가 가장 높습니다. 단어 하나만 입력해 주세요.
          </p>
        )}
      </div>

      {/* 추천 칩 */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
          <Sparkles className="size-3 text-primary" /> 추천 키워드:
        </span>
        {SUGGESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              onChange(item);
              onSubmit(item);
            }}
            className="rounded-full border border-border/80 bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary active:scale-95"
          >
            {item}
          </button>
        ))}
      </div>

      {/* 생성하기 버튼 (PRD 5.1 disabled, PRD 5.4 로딩 스피너 및 문구) */}
      <button
        type="button"
        disabled={isButtonDisabled}
        onClick={() => onSubmit()}
        className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-primary px-5 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            <span className="transition-all duration-300">{LOADING_MESSAGES[loadingMsgIndex]}</span>
          </>
        ) : (
          <>
            <Lightbulb className="size-4" />
            <span>암기 팁 생성하기 ✨</span>
          </>
        )}
      </button>
    </section>
  );
};
