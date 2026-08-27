'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Brain,
  Sparkles,
  ArrowRight,
  Volume2,
  BookmarkCheck,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';

interface LandingViewProps {
  onStartService: (initialKeyword?: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onStartService }) => {
  return (
    <div className="min-h-screen bg-[#FFF8EF] text-[#1A1C1E] flex flex-col justify-between">
      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b-[3px] border-[#1A1C1E] bg-[#FFF8EF]/95 backdrop-blur-sm shadow-[0_4px_0_0_#1A1C1E]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl border-[2.5px] border-[#1A1C1E] bg-[#FFD600] font-black shadow-[2px_2px_0px_#1A1C1E]">
              <Brain className="size-5 text-[#1A1C1E]" />
            </div>
            <span className="font-heading text-xl font-extrabold tracking-tight sm:text-2xl">
              짤기억 <span className="text-[#FF7675]">Mem-Pop</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => onStartService()}
            className="neo-btn rounded-xl bg-[#FFD600] px-4 py-2 text-xs font-black text-[#1A1C1E] sm:px-5 sm:py-2.5 sm:text-sm"
          >
            지금 시작하기 ⚡
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-4 py-8 sm:px-6 sm:py-12">
        {/* 2. Hero Section */}
        <section className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border-[2.5px] border-[#1A1C1E] bg-[#FFD600] px-4 py-1 font-mono-tag text-xs font-black tracking-wider text-[#1A1C1E] shadow-[2px_2px_0px_#1A1C1E]"
          >
            <Sparkles className="size-3.5" />
            STUDY SMARTER, NOT HARDER
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-heading text-4xl font-black leading-[1.15] tracking-tight sm:text-5xl md:text-6xl"
          >
            단어를 짤처럼,<br />
            기억은 <span className="bg-[#FFD600] px-2.5 py-0.5 border-[3px] border-[#1A1C1E] shadow-[4px_4px_0_0_#1A1C1E] inline-block -rotate-1 rounded-xl">팝하게!</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-5 max-w-lg text-base font-semibold leading-relaxed text-[#1A1C1E]/80 sm:text-lg"
          >
            외우기 힘든 영단어, 역사 연도, 전문 개념! 지루한 암기는 이제 그만.
            <br />
            뇌리에 팍 꽂히는 <span className="font-black text-[#1A1C1E] underline decoration-[#FFD600] decoration-4">3줄 연상 스토리</span>와 <span className="font-black text-[#1A1C1E] underline decoration-[#70F6FF] decoration-4">1초 퀴즈</span>로 초고속 암기를 경험하세요.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-7 w-full max-w-sm"
          >
            <button
              type="button"
              onClick={() => onStartService()}
              className="neo-btn flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FFD600] py-4 text-base font-black text-[#1A1C1E] transition-all hover:bg-[#ffe144] active:scale-95 sm:text-lg"
            >
              <span>무료로 짤기억 시작하기</span>
              <ArrowRight className="size-5 stroke-[3]" />
            </button>
          </motion.div>
        </section>

        {/* 3. Why Mem-Pop (Bento Grid) */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg border-2 border-[#1A1C1E] bg-[#70F6FF] font-black text-xs shadow-[2px_2px_0px_#1A1C1E]">
              WHY
            </span>
            <h2 className="font-heading text-2xl font-black sm:text-3xl">왜 짤기억인가요?</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Card 1: 초고속 연상 */}
            <div className="flex flex-col gap-2.5 rounded-2xl border-[3px] border-[#1A1C1E] bg-white p-5 card-shadow transition hover:translate-y-[-2px]">
              <div className="flex size-11 items-center justify-center rounded-xl border-2 border-[#1A1C1E] bg-[#70F6FF] shadow-[2px_2px_0px_#1A1C1E]">
                <Zap className="size-6 text-[#1A1C1E] fill-current" />
              </div>
              <h3 className="font-heading text-lg font-black sm:text-xl">초고속 발음 & 말장난 연상</h3>
              <p className="text-sm font-medium leading-relaxed text-[#1A1C1E]/80">
                단어의 뜻과 발음을 절묘하게 엮은 3줄 스토리로 어떤 개념도 1초 만에 뇌리에 강렬하게 각인시킵니다.
              </p>
            </div>

            {/* Card 2: 도파민 팝 퀴즈 */}
            <div className="flex flex-col gap-2.5 rounded-2xl border-[3px] border-[#1A1C1E] bg-white p-5 card-shadow transition hover:translate-y-[-2px]">
              <div className="flex size-11 items-center justify-center rounded-xl border-2 border-[#1A1C1E] bg-[#FF7675] text-white shadow-[2px_2px_0px_#1A1C1E]">
                <Lightbulb className="size-6 text-[#1A1C1E] stroke-[2.5]" />
              </div>
              <h3 className="font-heading text-lg font-black sm:text-xl">1초 확인 퀴즈 & 도파민 피드백</h3>
              <p className="text-sm font-medium leading-relaxed text-[#1A1C1E]/80">
                3지선다 퀴즈로 바로바로 확인! 즉각적인 컬러 반전과 피드백으로 지루한 공부가 경쾌한 게임이 됩니다.
              </p>
            </div>

            {/* Card 3: TTS 음성 낭독 */}
            <div className="flex flex-col gap-2.5 rounded-2xl border-[3px] border-[#1A1C1E] bg-white p-5 card-shadow transition hover:translate-y-[-2px]">
              <div className="flex size-11 items-center justify-center rounded-xl border-2 border-[#1A1C1E] bg-[#FFD600] shadow-[2px_2px_0px_#1A1C1E]">
                <Volume2 className="size-6 text-[#1A1C1E] stroke-[2.5]" />
              </div>
              <h3 className="font-heading text-lg font-black sm:text-xl">소리내어 외우는 AI 음성 (TTS)</h3>
              <p className="text-sm font-medium leading-relaxed text-[#1A1C1E]/80">
                시각뿐만 아니라 생생한 억양의 한국어 음성 낭독을 함께 청취하여 기억 정착률을 200% 끌어올립니다.
              </p>
            </div>

            {/* Card 4: 나만의 암기장 & SNS 공유 */}
            <div className="flex flex-col gap-2.5 rounded-2xl border-[3px] border-[#1A1C1E] bg-white p-5 card-shadow transition hover:translate-y-[-2px]">
              <div className="flex size-11 items-center justify-center rounded-xl border-2 border-[#1A1C1E] bg-[#00C853] text-white shadow-[2px_2px_0px_#1A1C1E]">
                <BookmarkCheck className="size-6 text-[#1A1C1E] stroke-[2.5]" />
              </div>
              <h3 className="font-heading text-lg font-black sm:text-xl">나만의 암기장 & 짤 카드 저장</h3>
              <p className="text-sm font-medium leading-relaxed text-[#1A1C1E]/80">
                원클릭으로 내 암기장에 쏙! 인스타그램이나 카톡에 자랑할 수 있는 고화질 짤 카드 이미지도 자동 생성됩니다.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Interactive Preview Card */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg border-2 border-[#1A1C1E] bg-[#FFD600] font-black text-xs shadow-[2px_2px_0px_#1A1C1E]">
              LIVE
            </span>
            <h2 className="font-heading text-2xl font-black sm:text-3xl">실제 짤기억 예시 맛보기</h2>
          </div>

          <div className="rounded-3xl border-[3px] border-[#1A1C1E] bg-white p-6 card-shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between border-b-2 border-[#1A1C1E]/10 pb-3">
              <span className="font-mono-tag inline-block rounded-md border-2 border-[#1A1C1E] bg-[#1A1C1E] px-2.5 py-1 text-xs font-bold text-white shadow-[1px_1px_0_0_#1A1C1E]">
                MEM-POP SAMPLE
              </span>
              <span className="text-xs font-bold text-[#1A1C1E]/60">토익/수능 빈출 영단어</span>
            </div>

            <div className="text-center py-2">
              <h3 className="font-heading text-3xl font-black tracking-tight text-[#1A1C1E] sm:text-4xl">
                mitigate
              </h3>
              <p className="font-mono text-sm font-bold text-[#1A1C1E]/60">[ˈmɪtɪɡeɪt]</p>
            </div>

            <div className="rounded-2xl border-[2.5px] border-[#1A1C1E] bg-[#FFF8EF] p-4 text-center shadow-[3px_3px_0px_#1A1C1E]">
              <p className="text-sm font-semibold leading-relaxed sm:text-base">
                뜨거운 곳 <span className="bg-[#FFD600] px-1.5 py-0.5 border border-[#1A1C1E] font-black rounded-md">'밑에(miti)'</span> 얼음팩을 <span className="bg-[#70F6FF] px-1.5 py-0.5 border border-[#1A1C1E] font-black rounded-md">'갖다 대(gate)'</span>니 통증이 <b>완화되네!</b>
              </p>
            </div>

            <div className="flex items-center justify-between rounded-xl border-2 border-[#00C853] bg-[#00C853]/15 px-4 py-2.5 font-bold text-[#1A1C1E]">
              <span className="flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="size-4 text-[#00C853]" />
                뜻: (고통·피해를) 완화하다, 경감시키다
              </span>
              <span className="font-mono text-xs font-black text-[#00C853]">정답률 99%</span>
            </div>

            <button
              type="button"
              onClick={() => onStartService('mitigate')}
              className="neo-btn mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFD600] py-3 text-sm font-black text-[#1A1C1E]"
            >
              <span>이 단어로 지금 바로 외워보기</span>
              <ArrowRight className="size-4 stroke-[3]" />
            </button>
          </div>
        </section>
      </main>

      {/* 5. Bottom Sticky CTA (Mobile Friendly) */}
      <div className="sticky bottom-0 z-40 w-full border-t-[3px] border-[#1A1C1E] bg-[#FFF8EF]/95 p-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl justify-center">
          <button
            type="button"
            onClick={() => onStartService()}
            className="neo-btn flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FFD600] py-3.5 text-base font-black text-[#1A1C1E] sm:w-auto sm:px-12"
          >
            <span>지금 바로 외워보기 🚀</span>
            <ArrowRight className="size-5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* 6. Footer */}
      <footer className="w-full border-t-2 border-[#1A1C1E]/20 bg-[#f6edda] py-8 text-center text-xs font-bold text-[#1A1C1E]/70">
        <div className="font-heading text-lg font-black text-[#1A1C1E] mb-2">
          짤기억 Mem-Pop
        </div>
        <p className="mb-2">외우기 힘든 모든 것을 뇌리에 콱 박아주는 AI 암기 튜터</p>
        <p className="font-mono text-[11px] text-[#1A1C1E]/50">
          © 2026 짤기억 Mem-Pop. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
