'use client';

import React from 'react';
import { ShieldAlert, Sparkles, ArrowUpRight } from 'lucide-react';

interface GuardrailCardProps {
  message?: string;
  onSuggestionClick: (suggestion: string) => void;
}

const EXAMPLE_KEYWORDS = ['임진왜란 1592', '미토콘드리아', 'mitigate', '베르누이 방정식'];

export const GuardrailCard: React.FC<GuardrailCardProps> = ({
  message = '올바른 단어 또는 개념을 입력해 주세요. (예: 역사적 사건, 영단어, 전문 용어)',
  onSuggestionClick,
}) => {
  return (
    <article className="rounded-3xl border-[3px] border-[#1A1C1E] bg-[#FFD600]/25 p-6 card-shadow-lg animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-lg border-2 border-[#1A1C1E] bg-[#FFD600] text-[#1A1C1E] shadow-[2px_2px_0px_#1A1C1E]">
          <ShieldAlert className="size-4 stroke-[2.5]" />
        </span>
        <h3 className="font-heading text-base font-black text-[#1A1C1E]">AI 암기 가드레일 안내</h3>
      </div>

      <p className="mt-3 text-sm font-bold leading-relaxed text-[#1A1C1E] sm:text-base">
        {message}
      </p>

      <div className="mt-5 rounded-2xl border-2 border-[#1A1C1E] bg-white p-4 shadow-[3px_3px_0px_#1A1C1E]">
        <div className="flex items-center gap-1.5 text-xs font-black text-[#1A1C1E]">
          <Sparkles className="size-3.5 text-[#FF7675]" /> 추천 예시로 다시 시도해 보세요:
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {EXAMPLE_KEYWORDS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onSuggestionClick(item)}
              className="neo-btn inline-flex items-center gap-1 rounded-xl bg-[#FFF8EF] px-3 py-1.5 text-xs font-black text-[#1A1C1E] transition hover:bg-[#FFD600]"
            >
              <span>{item}</span>
              <ArrowUpRight className="size-3 stroke-[3]" />
            </button>
          ))}
        </div>
      </div>
    </article>
  );
};

