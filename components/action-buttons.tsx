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
        className="neo-btn flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-black text-[#1A1C1E] transition-all hover:bg-[#FFD600]/30"
      >
        {loading ? (
          <LoaderCircle className="size-4 animate-spin stroke-[3]" />
        ) : (
          <RotateCcw className="size-4 stroke-[2.5]" />
        )}
        <span>다른 팁 다시 생성하기</span>
      </button>

      <button
        type="button"
        onClick={onReset}
        className="neo-btn flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#FFD600] px-4 py-3.5 text-sm font-black text-[#1A1C1E] transition-all hover:bg-[#ffe144]"
      >
        <PlusCircle className="size-4 stroke-[2.5]" />
        <span>새로운 단어 입력하기</span>
      </button>
    </div>
  );
};

