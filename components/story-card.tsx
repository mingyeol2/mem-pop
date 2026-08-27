'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Lightbulb,
  Check,
  Clipboard,
  Volume2,
  Square,
  Bookmark,
  BookmarkCheck,
  Share2,
  Download,
} from 'lucide-react';
import { MemPopContent } from '@/types/mem-pop';
import { speakStory, stopSpeaking, isTTSSupported } from '@/lib/tts';
import { saveCard, removeCard, isCardSaved, getSavedCards } from '@/lib/storage';
import { exportStoryCardAsImage } from '@/lib/image-export';

interface StoryCardProps {
  content: MemPopContent;
  onSavedChange?: () => void;
}

const STEP_BADGES = ['상황 연결', '말장난/연상', '펀치라인'];

export const StoryCard: React.FC<StoryCardProps> = ({ content, onSavedChange }) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setTtsAvailable(isTTSSupported());
    setSaved(isCardSaved(content.keyword));
    return () => {
      stopSpeaking();
    };
  }, [content.keyword]);

  // 키워드가 바뀌면 TTS 정지 및 저장 상태 갱신
  useEffect(() => {
    stopSpeaking();
    setIsPlayingTTS(false);
    setSaved(isCardSaved(content.keyword));
  }, [content.keyword]);

  const handleToggleTTS = () => {
    if (isPlayingTTS) {
      stopSpeaking();
      setIsPlayingTTS(false);
    } else {
      setIsPlayingTTS(true);
      speakStory(content.story, {
        onStart: () => setIsPlayingTTS(true),
        onEnd: () => setIsPlayingTTS(false),
        onError: () => setIsPlayingTTS(false),
      });
    }
  };

  const handleToggleSave = () => {
    if (saved) {
      const cards = getSavedCards();
      const target = cards.find(
        (c) => c.keyword.toLowerCase() === content.keyword.toLowerCase()
      );
      if (target) {
        removeCard(target.id);
      }
      setSaved(false);
    } else {
      saveCard(content);
      setSaved(true);
    }
    onSavedChange?.();
  };

  const handleExportImage = async () => {
    try {
      setIsExporting(true);
      await exportStoryCardAsImage(content);
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setIsExporting(false);
    }
  };

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
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3.5">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <span className="flex size-6 items-center justify-center rounded-lg bg-primary/20 text-xs">
              <Lightbulb className="size-3.5" />
            </span>
            3줄 연상 암기법
          </div>

          {/* 통합 툴바 버튼 그룹 */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* TTS 음성 읽기 (Sprint 5) */}
            {ttsAvailable && (
              <button
                type="button"
                onClick={handleToggleTTS}
                className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-semibold backdrop-blur-sm transition-all active:scale-95 ${
                  isPlayingTTS
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm animate-pulse'
                    : 'border-border bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-primary'
                }`}
                title={isPlayingTTS ? '음성 낭독 정지' : '음성으로 듣기'}
              >
                {isPlayingTTS ? (
                  <>
                    <Square className="size-3 fill-current" />
                    <span>정지</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="size-3.5 text-primary" />
                    <span>듣기</span>
                  </>
                )}
              </button>
            )}

            {/* 나만의 암기장 저장 (Sprint 6) */}
            <button
              type="button"
              onClick={handleToggleSave}
              className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-semibold backdrop-blur-sm transition-all active:scale-95 ${
                saved
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'border-border bg-background/80 text-muted-foreground hover:border-amber-500/40 hover:text-amber-500'
              }`}
              title={saved ? '암기장에서 제거' : '내 암기장에 저장'}
            >
              {saved ? (
                <>
                  <BookmarkCheck className="size-3.5 fill-current" />
                  <span>저장됨</span>
                </>
              ) : (
                <>
                  <Bookmark className="size-3.5" />
                  <span>저장</span>
                </>
              )}
            </button>

            {/* 짤 카드 이미지 다운로드 (Sprint 7) */}
            <button
              type="button"
              onClick={handleExportImage}
              disabled={isExporting}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-background/80 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary active:scale-95 disabled:opacity-50"
              title="SNS 공유용 짤 카드 이미지(PNG) 저장"
            >
              <Download className="size-3.5" />
              <span>짤저장</span>
            </button>

            {/* 텍스트 복사 */}
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-background/80 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary active:scale-95"
              title="텍스트 클립보드 복사"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-500" />
                  <span className="text-emerald-600 font-bold">복사됨</span>
                </>
              ) : (
                <>
                  <Clipboard className="size-3.5" />
                  <span>복사</span>
                </>
              )}
            </button>
          </div>
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
