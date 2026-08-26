'use client';

import React from 'react';
import { Zap, Check, X } from 'lucide-react';
import { QuizData } from '@/types/mem-pop';

interface QuizCardProps {
  quiz: QuizData;
  selectedIndex: number | null;
  onSelectOption: (index: number) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  selectedIndex,
  onSelectOption,
}) => {
  const isAnswered = selectedIndex !== null;
  const isCorrect = selectedIndex === quiz.answer_index;

  return (
    <article className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
        <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-xs">
          <Zap className="size-3.5" />
        </span>
        1초 확인 퀴즈
      </div>

      <h2 className="text-base font-bold text-foreground sm:text-lg">
        {quiz.question}
      </h2>

      {/* 3지선다 보기 리스트 (PRD 4.3) */}
      <div className="mt-4 flex flex-col gap-2.5">
        {quiz.options.map((option, index) => {
          const isThisOptionCorrect = index === quiz.answer_index;
          const isThisOptionSelected = selectedIndex === index;

          let optionStyle =
            'border-border/80 bg-background/80 hover:border-primary/50 hover:bg-primary/5 text-foreground';

          if (isAnswered) {
            if (isThisOptionSelected && isThisOptionCorrect) {
              // 정답 선택
              optionStyle =
                'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold';
            } else if (isThisOptionSelected && !isThisOptionCorrect) {
              // 오답 선택
              optionStyle =
                'border-destructive bg-destructive/15 text-destructive font-bold';
            } else if (!isThisOptionSelected && isThisOptionCorrect) {
              // 오답 선택 시 정답 보기 노출 (PRD 4.3)
              optionStyle =
                'border-emerald-500/80 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold';
            } else {
              optionStyle = 'border-border/40 bg-muted/30 text-muted-foreground opacity-60';
            }
          }

          return (
            <button
              key={index}
              type="button"
              disabled={isAnswered}
              onClick={() => onSelectOption(index)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 active:scale-[0.99] disabled:cursor-default ${optionStyle}`}
            >
              <span>{option}</span>

              {isAnswered && (
                <span className="shrink-0 ml-2">
                  {isThisOptionCorrect ? (
                    <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                  ) : isThisOptionSelected ? (
                    <X className="size-4 text-destructive" />
                  ) : null}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 정답/오답 피드백 및 해설 박스 (PRD 4.3) */}
      {isAnswered && (
        <div
          className={`mt-4 rounded-2xl p-4 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300 ${
            isCorrect
              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
              : 'border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center gap-1.5 font-black">
            {isCorrect ? '🎉 정답입니다!' : '💡 아쉬워요!'}
          </div>
          <p className="mt-1 text-xs font-medium sm:text-sm">
            {quiz.explanation}
          </p>
        </div>
      )}
    </article>
  );
};
