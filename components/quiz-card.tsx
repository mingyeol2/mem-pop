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
    <article className="rounded-3xl border-[3px] border-[#1A1C1E] bg-white p-5 card-shadow-lg sm:p-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg border-2 border-[#1A1C1E] bg-[#FF7675] text-[#1A1C1E] shadow-[2px_2px_0px_#1A1C1E]">
          <Zap className="size-4 fill-current" />
        </span>
        <span className="font-heading text-sm font-black text-[#1A1C1E]">1초 확인 퀴즈</span>
      </div>

      <h2 className="font-heading text-lg font-black leading-snug text-[#1A1C1E] sm:text-xl">
        {quiz.question}
      </h2>

      {/* 3지선다 보기 리스트 (PRD 4.3) */}
      <div className="mt-4 flex flex-col gap-3">
        {quiz.options.map((option, index) => {
          const isThisOptionCorrect = index === quiz.answer_index;
          const isThisOptionSelected = selectedIndex === index;

          let optionStyle =
            'border-[3px] border-[#1A1C1E] bg-[#FFF8EF] shadow-[3px_3px_0px_#1A1C1E] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#1A1C1E] hover:bg-[#FFD600]/30 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#1A1C1E]';

          if (isAnswered) {
            if (isThisOptionSelected && isThisOptionCorrect) {
              // 정답 선택 시 비비드 그린
              optionStyle =
                'border-[3px] border-[#1A1C1E] bg-[#00C853] text-white font-black shadow-[4px_4px_0px_#1A1C1E]';
            } else if (isThisOptionSelected && !isThisOptionCorrect) {
              // 오답 선택 시 비비드 레드
              optionStyle =
                'border-[3px] border-[#1A1C1E] bg-[#FF5252] text-white font-black shadow-[4px_4px_0px_#1A1C1E]';
            } else if (!isThisOptionSelected && isThisOptionCorrect) {
              // 오답 선택 시 정답 보기 노출 (PRD 4.3)
              optionStyle =
                'border-[3px] border-[#1A1C1E] bg-[#00C853]/30 text-[#1A1C1E] font-black shadow-[3px_3px_0px_#1A1C1E]';
            } else {
              optionStyle = 'border-2 border-[#1A1C1E]/30 bg-muted/20 text-[#1A1C1E]/40 opacity-50 shadow-none';
            }
          }

          return (
            <button
              key={index}
              type="button"
              disabled={isAnswered}
              onClick={() => onSelectOption(index)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-sm font-bold transition-all duration-150 disabled:cursor-default sm:text-base ${optionStyle}`}
            >
              <span>{option}</span>

              {isAnswered && (
                <span className="shrink-0 ml-2">
                  {isThisOptionCorrect ? (
                    <span className="flex size-6 items-center justify-center rounded-full bg-white text-[#00C853] border-2 border-[#1A1C1E]">
                      <Check className="size-4 stroke-[3]" />
                    </span>
                  ) : isThisOptionSelected ? (
                    <span className="flex size-6 items-center justify-center rounded-full bg-white text-[#FF5252] border-2 border-[#1A1C1E]">
                      <X className="size-4 stroke-[3]" />
                    </span>
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
          className={`mt-4 rounded-2xl border-[3px] border-[#1A1C1E] p-4 text-sm leading-relaxed shadow-[4px_4px_0px_#1A1C1E] animate-in fade-in slide-in-from-top-2 duration-300 ${
            isCorrect
              ? 'bg-[#00C853]/15 text-[#1A1C1E]'
              : 'bg-[#FFD600]/30 text-[#1A1C1E]'
          }`}
        >
          <div className="flex items-center gap-1.5 font-heading text-base font-black">
            {isCorrect ? '🎉 딩동댕! 정답입니다!' : '💡 앗 아쉬워요!'}
          </div>
          <p className="mt-1.5 text-xs font-bold leading-relaxed sm:text-sm">
            {quiz.explanation}
          </p>
        </div>
      )}
    </article>
  );
};

