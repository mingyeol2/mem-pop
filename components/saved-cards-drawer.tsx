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
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* 슬라이드 서랍 패널 */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl"
            aria-label="저장된 나만의 암기장"
          >
            {/* 서랍 헤더 */}
            <div className="flex items-center justify-between border-b border-border/80 p-5">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BookMarked className="size-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">나만의 암기장</h2>
                  <p className="text-xs text-muted-foreground">
                    총 <span className="font-bold text-primary">{savedCards.length}개</span>의 짤기억 보관 중
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="암기장 닫기"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* 카드 목록 영역 */}
            <div className="flex-1 overflow-y-auto p-5">
              {savedCards.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground/60 mb-3">
                    <Sparkles className="size-6" />
                  </div>
                  <p className="text-sm font-bold text-foreground">저장된 암기 카드가 없습니다</p>
                  <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                    키워드를 검색한 뒤 암기 카드 상단의 [⭐ 암기장 저장]을 눌러 보관해 보세요!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {savedCards.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-2xl border border-border/80 bg-background/80 p-4 transition-all hover:border-primary/50 hover:shadow-md"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-black text-primary">
                          {item.keyword}
                        </span>
                        <div className="flex items-center gap-1">
                          {/* 빠른 음성 듣기 */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakStory(item.content.story);
                            }}
                            className="rounded-lg p-1 text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
                            title="음성으로 듣기"
                          >
                            <Volume2 className="size-3.5" />
                          </button>

                          {/* 삭제 버튼 */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteCard(item.id);
                            }}
                            className="rounded-lg p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                            title="삭제"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* 3줄 스토리 미리보기 */}
                      <p className="text-xs font-medium leading-relaxed text-foreground/80 line-clamp-2">
                        {item.content.story[2] || item.content.story[1]}
                      </p>

                      {/* 복습하기 버튼 */}
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCard(item);
                          onClose();
                        }}
                        className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-xl bg-muted/60 py-2 text-xs font-bold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        <span>이 단어로 복습하기</span>
                        <ArrowRight className="size-3" />
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
