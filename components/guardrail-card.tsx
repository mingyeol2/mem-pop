'use client';

import React from 'react';
import { ShieldAlert, Sparkles, ArrowUpRight } from 'lucide-react';

interface GuardrailCardProps {
  message?: string;
  onSuggestionClick: (suggestion: string) => void;
}

const EXAMPLE_KEYWORDS = ['임진왜란 1592', '미토콘드리아', 'mitigate', '아나필락시스'];

export const GuardrailCard: React.FC<GuardrailCardProps> = ({
  message = '올바른 단어 또는 개념을 입력해 주세요. (예: 역사적 사건, 영단어, 전문 용어)',
  onSuggestionClick,
}) => {
  return (
    <article className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-card p-6 shadow-sm animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
        <ShieldAlert className="size-5 shrink-0" />
        <h3 className="text-sm font-bold sm:text-base">AI 암기 가드레일 안내</h3>
      </div>

      <p className="mt-3 text-sm font-medium leading-relaxed text-foreground/90 sm:text-base">
        {message}
      </p>

      <div className="mt-5 rounded-2xl border border-border/60 bg-background/70 p-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" /> 추천 예시로 다시 시도해 보세요:
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {EXAMPLE_KEYWORDS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onSuggestionClick(item)}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:text-primary active:scale-95"
            >
              <span>{item}</span>
              <ArrowUpRight className="size-3 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </article>
  );
};
