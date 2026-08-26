'use client';

import React, { useState } from 'react';
import { BookOpen, Lightbulb, Check, Clipboard } from 'lucide-react';
import { MemPopContent } from '@/types/mem-pop';

interface StoryCardProps {
  content: MemPopContent;
}

const STEP_BADGES = ['상황 연결', '말장난/연상', '펀치라인'];

export const StoryCard: React.FC<StoryCardProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy = `[${content.keyword} 짤기억 암기법]\n\n📖 핵심 배경:\n${content.background}\n\n💡 3줄 연상 암기팁:\n1. ${content.story[0]}\n2. ${content.story[1]}\n3. ${content.story[2]}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. 핵심 배경 & 개념 이해 카드 */}
      <article className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-2.5 flex items-center gap-2 text-sm font-bold text-primary">
          <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-xs">
            <BookOpen className="size-3.5" />
          </span>
          핵심 배경 & 개념 이해
        </div>
        <p className="text-sm font-normal leading-relaxed text-muted-foreground sm:text-base">
          {content.background}
        </p>
      </article>

      {/* 2. 3줄 연상 암기법 카드 */}
      <article className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-md shadow-primary/5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <span className="flex size-6 items-center justify-center rounded-lg bg-primary/20 text-xs">
              <Lightbulb className="size-3.5" />
            </span>
            3줄 연상 암기법
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary active:scale-95"
            aria-label="암기 팁 복사"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-500" />
                <span className="text-emerald-600 font-bold">복사됨!</span>
              </>
            ) : (
              <>
                <Clipboard className="size-3.5" />
                <span>복사</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {content.story.map((line, index) => (
            <div key={index} className="flex items-start gap-3 rounded-2xl bg-card/60 p-3 shadow-xs">
              <span className="mt-0.5 shrink-0 rounded-lg bg-primary/15 px-2 py-1 text-[11px] font-bold text-primary">
                {STEP_BADGES[index] || `${index + 1}단계`}
              </span>
              <p className="text-sm font-medium leading-relaxed text-foreground sm:text-base">
                {line}
              </p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
};
