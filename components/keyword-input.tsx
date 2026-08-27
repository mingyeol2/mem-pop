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

const SUGGESTIONS = ['인플레이션', '피타고라스', '아포토시스', '광합성'];

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
      className="w-full rounded-3xl border-[3px] border-[#1A1C1E] bg-white p-5 card-shadow-lg sm:p-7"
      aria-label="암기 키워드 입력"
    >
      <div className="flex flex-col gap-2.5">
        <div
          className={`relative flex items-center rounded-2xl border-[3px] bg-[#FFF8EF] px-4 py-1.5 transition-all duration-150 ${
            showEmptyError
              ? 'border-[#FF5252] shadow-[4px_4px_0_0_#FF5252]'
              : isMultiple
              ? 'border-amber-500 shadow-[4px_4px_0_0_#F59E0B]'
              : 'border-[#1A1C1E] shadow-[4px_4px_0_0_#1A1C1E] focus-within:shadow-[6px_6px_0_0_#1A1C1E] focus-within:translate-x-[-1px] focus-within:translate-y-[-1px]'
          }`}
        >
          <Search className="mr-2.5 size-5 shrink-0 text-[#1A1C1E]" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            maxLength={30}
            value={keyword}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
            placeholder="외우고 싶은 단어, 개념, 연도 입력 (예: 인플레이션, 피타고라스, 아포토시스)"
            className="min-w-0 flex-1 bg-transparent py-3 text-sm font-bold text-[#1A1C1E] outline-none placeholder:text-[#1A1C1E]/40 sm:text-base"
            aria-label="외우고 싶은 단어, 개념, 연도 입력"
          />

          {/* 30자 카운터 (PRD 4.1, 5.2) */}
          <span className="ml-2 shrink-0 font-mono text-xs font-black tabular-nums text-[#1A1C1E]/60 bg-white px-2 py-0.5 rounded-md border border-[#1A1C1E]">
            {keyword.length}/30
          </span>

          {/* 지우기 버튼 */}
          {keyword && (
            <button
              type="button"
              onClick={onClear}
              className="ml-2 rounded-full p-1 text-[#1A1C1E] transition hover:bg-black/10"
              aria-label="입력 내용 지우기"
            >
              <X className="size-4 stroke-[3]" />
            </button>
          )}
        </div>

        {/* 빈 값 에러 문구 (PRD 5.1) */}
        {showEmptyError && (
          <p className="flex items-center gap-1.5 px-1 text-xs font-black text-[#FF5252] animate-in fade-in">
            <AlertCircle className="size-4 stroke-[2.5]" />
            외우고 싶은 단어나 개념을 입력해 주세요.
          </p>
        )}

        {/* 다중 단어 경고 문구 (PRD 5.2) */}
        {isMultiple && (
          <p className="flex items-center gap-1.5 px-1 text-xs font-black text-amber-600 animate-in fade-in">
            <AlertCircle className="size-4 stroke-[2.5]" />
            한 번에 한 가지 개념만 입력할 때 암기 효과가 가장 높습니다. 단어 하나만 입력해 주세요.
          </p>
        )}
      </div>

      {/* 추천 칩 */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-black text-[#1A1C1E]/80">
          <Sparkles className="size-3.5 text-[#FF7675]" /> 추천 키워드:
        </span>
        {SUGGESTIONS.map((item, idx) => {
          const bgColors = ['bg-[#FFD600]/30', 'bg-[#70F6FF]/30', 'bg-[#00C853]/20'];
          return (
            <button
              key={item}
              type="button"
              onClick={() => {
                onChange(item);
                onSubmit(item);
              }}
              className={`rounded-xl border-2 border-[#1A1C1E] ${bgColors[idx % 3]} px-3 py-1.5 text-xs font-extrabold text-[#1A1C1E] shadow-[2px_2px_0px_#1A1C1E] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#1A1C1E] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* 생성하기 버튼 (PRD 5.1 disabled, PRD 5.4 로딩 스피너 및 문구) */}
      <button
        type="button"
        disabled={isButtonDisabled}
        onClick={() => onSubmit()}
        className="neo-btn mt-5 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#FFD600] px-5 py-4 text-base font-black text-[#1A1C1E] shadow-[4px_4px_0px_#1A1C1E] transition-all"
      >
        {loading ? (
          <>
            <LoaderCircle className="size-5 animate-spin stroke-[3]" />
            <span className="transition-all duration-300 font-extrabold">{LOADING_MESSAGES[loadingMsgIndex]}</span>
          </>
        ) : (
          <>
            <Lightbulb className="size-5 stroke-[2.5]" />
            <span>암기 팁 생성하기 ✨</span>
          </>
        )}
      </button>
    </section>
  );
};
