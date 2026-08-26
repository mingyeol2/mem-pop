'use client';

import React from 'react';
import { RotateCcw, PlusCircle, LoaderCircle } from 'lucide-react';

interface ActionButtonsProps {
  onRegenerate: () => void;
  onReset: () => void;
  loading: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onRegenerate,
  onReset,
  loading,
}) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        disabled={loading}
        onClick={onRegenerate}
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3.5 text-sm font-bold text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <RotateCcw className="size-4" />
        )}
        <span>다른 팁 다시 생성하기</span>
      </button>

      <button
        type="button"
        onClick={onReset}
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-muted/80 px-4 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-muted active:scale-[0.99]"
      >
        <PlusCircle className="size-4 text-muted-foreground" />
        <span>새로운 단어 입력하기</span>
      </button>
    </div>
  );
};
