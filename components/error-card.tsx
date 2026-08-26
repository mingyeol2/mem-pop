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
    <article className="rounded-3xl border border-destructive/30 bg-destructive/10 p-6 shadow-sm animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="flex items-center gap-2.5 text-destructive">
        {isTimeout ? <Clock className="size-5" /> : <AlertTriangle className="size-5" />}
        <h3 className="text-sm font-bold sm:text-base">
          {isTimeout ? '요청 시간 초과' : '생성 오류 안내'}
        </h3>
      </div>

      <p className="mt-3 text-sm font-medium leading-relaxed text-foreground/90 sm:text-base">
        {message}
      </p>

      <div className="mt-4 flex">
        <button
          type="button"
          disabled={loading}
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-destructive px-4 py-2.5 text-xs font-bold text-destructive-foreground transition hover:bg-destructive/90 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>다시 시도하기</span>
        </button>
      </div>
    </article>
  );
};
