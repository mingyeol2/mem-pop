'use client';

import React from 'react';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';

interface ErrorCardProps {
  errorType: string;
  message: string;
  onRetry: () => void;
  loading: boolean;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
  errorType,
  message,
  onRetry,
  loading,
}) => {
  const isTimeout = errorType === 'TIMEOUT';

  return (
    <article className="rounded-3xl border-[3px] border-[#1A1C1E] bg-[#FF5252]/15 p-6 card-shadow-lg animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-lg border-2 border-[#1A1C1E] bg-[#FF5252] text-white shadow-[2px_2px_0px_#1A1C1E]">
          {isTimeout ? <Clock className="size-4 stroke-[3]" /> : <AlertTriangle className="size-4 stroke-[3]" />}
        </span>
        <h3 className="font-heading text-base font-black text-[#1A1C1E]">
          {isTimeout ? '요청 시간 초과' : '생성 오류 안내'}
        </h3>
      </div>

      <p className="mt-3 text-sm font-bold leading-relaxed text-[#1A1C1E] sm:text-base">
        {message}
      </p>

      <div className="mt-4 flex">
        <button
          type="button"
          disabled={loading}
          onClick={onRetry}
          className="neo-btn inline-flex items-center gap-2 rounded-xl bg-[#FFD600] px-4 py-2.5 text-xs font-black text-[#1A1C1E] transition hover:bg-[#ffe144]"
        >
          <RefreshCw className={`size-3.5 stroke-[2.5] ${loading ? 'animate-spin' : ''}`} />
          <span>다시 시도하기</span>
        </button>
      </div>
    </article>
  );
};

