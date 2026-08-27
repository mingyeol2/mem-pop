'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, BookMarked, ArrowRight, Sparkles, Volume2 } from 'lucide-react';
import { SavedMemPopCard } from '@/types/storage';
import { speakStory } from '@/lib/tts';

interface SavedCardsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedCards: SavedMemPopCard[];
  onSelectCard: (card: SavedMemPopCard) => void;
  onDeleteCard: (id: string) => void;
}

export const SavedCardsDrawer: React.FC<SavedCardsDrawerProps> = ({
  isOpen,
  onClose,
  savedCards,
  onSelectCard,
  onDeleteCard,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* 백드롭 배경 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1A1C1E]/60 backdrop-blur-xs"
          />

          {/* 슬라이드 서랍 패널 */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative z-10 flex h-full w-full max-w-md flex-col border-l-[3px] border-[#1A1C1E] bg-[#FFF8EF] shadow-2xl"
            aria-label="저장된 나만의 암기장"
          >
            {/* 서랍 헤더 */}
            <div className="flex items-center justify-between border-b-[3px] border-[#1A1C1E] bg-white p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl border-2 border-[#1A1C1E] bg-[#FFD600] text-[#1A1C1E] shadow-[2px_2px_0px_#1A1C1E]">
                  <BookMarked className="size-5 stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-black text-[#1A1C1E]">나만의 암기장</h2>
                  <p className="text-xs font-bold text-[#1A1C1E]/70">
                    총 <span className="bg-[#FFD600] px-1.5 py-0.2 border border-[#1A1C1E] rounded-md font-black">{savedCards.length}개</span>의 짤기억 보관 중
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="neo-btn rounded-xl bg-[#FFF8EF] p-2 text-[#1A1C1E]"
                aria-label="암기장 닫기"
              >
                <X className="size-5 stroke-[3]" />
              </button>
            </div>

            {/* 카드 목록 영역 */}
            <div className="flex-1 overflow-y-auto p-5">
              {savedCards.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex size-16 items-center justify-center rounded-2xl border-[3px] border-[#1A1C1E] bg-[#FFD600] text-[#1A1C1E] shadow-[3px_3px_0px_#1A1C1E] mb-4">
                    <Sparkles className="size-8" />
                  </div>
                  <p className="font-heading text-base font-black text-[#1A1C1E]">저장된 암기 카드가 없습니다</p>
                  <p className="mt-2 text-xs font-bold text-[#1A1C1E]/70 max-w-xs leading-relaxed">
                    단어를 검색한 뒤 암기 카드 상단의 <span className="bg-[#FFD600] px-1 border border-[#1A1C1E] rounded font-black">[⭐ 저장]</span>을 눌러 나만의 단어장에 쏙 담아보세요!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {savedCards.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-2xl border-[3px] border-[#1A1C1E] bg-white p-4.5 shadow-[4px_4px_0px_#1A1C1E] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#1A1C1E]"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-heading text-base font-black text-[#1A1C1E]">
                          {item.keyword}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {/* 빠른 음성 듣기 */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakStory(item.content.story);
                            }}
                            className="neo-btn rounded-lg bg-[#FFF8EF] p-1.5 text-[#1A1C1E] hover:bg-[#FFD600]"
                            title="음성으로 듣기"
                          >
                            <Volume2 className="size-4" />
                          </button>

                          {/* 삭제 버튼 */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteCard(item.id);
                            }}
                            className="neo-btn rounded-lg bg-[#FF5252]/20 p-1.5 text-[#FF5252] hover:bg-[#FF5252] hover:text-white"
                            title="삭제"
                          >
                            <Trash2 className="size-4 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>

                      {/* 3줄 스토리 미리보기 */}
                      <p className="text-xs font-bold leading-relaxed text-[#1A1C1E]/80 line-clamp-2 bg-[#FFF8EF] p-2.5 rounded-xl border border-[#1A1C1E]/20">
                        {item.content.story[2] || item.content.story[1]}
                      </p>

                      {/* 복습하기 버튼 */}
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCard(item);
                          onClose();
                        }}
                        className="neo-btn mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#FFD600] py-2.5 text-xs font-black text-[#1A1C1E] transition-all hover:bg-[#ffe144]"
                      >
                        <span>이 단어로 복습하기</span>
                        <ArrowRight className="size-3.5 stroke-[3]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

