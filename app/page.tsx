'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  Check,
  Clipboard,
  Eraser,
  Lightbulb,
  LoaderCircle,
  RotateCcw,
  Search,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react'

type Lesson = {
  background: string
  lines: [string, string, string]
  quiz: { question: string; options: string[]; correct: number; explanation: string }
}

const suggestions = ['임진왜란 1592년', '미토콘드리아', 'mitigate']

function getLesson(keyword: string): Lesson {
  const normalized = keyword.toLowerCase()
  if (normalized.includes('임진왜란') || normalized.includes('1592')) {
    return {
      background: '1592년 왜군이 조선을 침략하여 7년간 이어진 전쟁으로, 전국적인 의병 봉기와 이순신 장군의 활약이 빛난 대표적인 국난입니다.',
      lines: ['왜적이 쳐들어와 온 국토가 불타고 난리가 났습니다.', "온 백성이 '이(1)러고(5) 구(9)경(2)만 할 거냐!' 하며 의병을 일으킴!", '1592년 = 이러고 구경(이)만 하냐! 임진왜란 발발!'],
      quiz: { question: 'Q. 임진왜란이 일어난 연도로 올바른 것은?', options: ['① 1392년', '② 1592년', '③ 1636년'], correct: 1, explanation: "'이(1)러고(5) 구(9)경(2)하냐'를 떠올리면 1592년을 바로 기억할 수 있습니다!" },
    }
  }
  if (normalized.includes('미토콘드리아') || normalized.includes('미트콘드리아')) {
    return {
      background: '세포 내에서 세포 호흡을 통해 생명 활동에 필요한 에너지(ATP)를 생산하는 핵심 세포 소기관입니다.',
      lines: ['우리 몸의 세포 안에는 쉬지 않고 돌아가는 작은 에너지 발전소가 있습니다.', '고기(Meat/미트)를 든든하게 먹었더니 발전소에서 에너지가 팍팍!', '미트(Meat) 먹고 힘 팍팍! = 미토콘드리아는 세포의 에너지 발전소!'],
      quiz: { question: "Q. 세포 내에서 호흡을 통해 에너지를 생성하는 '세포의 발전소' 역할을 하는 소기관은?", options: ['① 리보솜', '② 미토콘드리아', '③ 엽록체'], correct: 1, explanation: '고기(Meat) 먹고 힘(에너지)을 낸다고 연상하면 미토콘드리아가 바로 떠오릅니다!' },
    }
  }
  if (normalized.includes('mitigate') || normalized.includes('미티게이트')) {
    return {
      background: "'(고통·피해·충격 등을) 완화하다, 경감시키다'라는 의미를 가진 빈출 필수 영단어입니다.",
      lines: ['극심한 통증과 고통으로 끙끙 앓고 있는 환자가 있습니다.', "특효약을 아픈 부위 '밑에(Miti) 갖다(gate)' 대어 진정시키는 장면을 떠올려 보세요.", '밑에 갖다 대니 통증 완화! = Mitigate (완화하다)'],
      quiz: { question: "Q. 영단어 'mitigate'의 올바른 의미로 알맞은 것은?", options: ['① 완화하다, 경감시키다', '② 악화시키다', '③ 모방하다'], correct: 0, explanation: "'밑에 갖다 대니 완화된다'를 떠올리면 mitigate의 의미를 바로 외울 수 있습니다!" },
    }
  }
  return {
    background: `${keyword}은(는) 시험과 학습에서 자주 등장하는 핵심 개념입니다.`,
    lines: [`${keyword}의 핵심 특징과 어원을 머릿속으로 시각화해 봅니다.`, `${keyword}의 발음을 비슷한 일상 표현과 강력하게 결합합니다.`, `강렬한 이미지와 연결 = ${keyword} 뇌리 고정 완료!`],
    quiz: { question: 'Q. 방금 학습한 핵심 키워드로 올바른 것은?', options: [`① ${keyword}`, '② 오답 보기 1', '③ 오답 보기 2'], correct: 0, explanation: `${keyword}의 연상 포인트를 복습해 보세요!` },
  }
}

function isSpam(value: string) {
  return /^(ㅋ+|ㅎ+|asdf+|qwer+|test+|[!@#$%^&*]+)$/i.test(value.replace(/\s/g, ''))
}

export default function Page() {
  const [keyword, setKeyword] = useState('')
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const isMultiple = /[,/&]/.test(keyword)

  const generate = (value = keyword) => {
    const trimmed = value.trim()
    if (!trimmed || isMultiple || trimmed.length > 30) return
    if (isSpam(trimmed)) { setError('올바른 단어 또는 개념을 입력해 주세요.'); setLesson(null); return }
    setError(''); setLoading(true); setLesson(null); setSelected(null)
    window.setTimeout(() => { setLesson(getLesson(trimmed)); setLoading(false) }, 1200)
  }

  const copyStory = async () => {
    if (!lesson) return
    await navigator.clipboard.writeText(lesson.lines.join('\n'))
    setCopied(true); window.setTimeout(() => setCopied(false), 1800)
  }

  const buttonLabel = useMemo(() => loading ? '뇌리에 박히는 암기 스토리를 짜내는 중...' : '암기 팁 생성하기 ✨', [loading])

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:py-14">
      <div className="mx-auto flex max-w-xl flex-col gap-7">
        <header className="text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-bold text-primary"><Sparkles data-icon="inline-start" /> AI 암기 튜터</div>
          <h1 className="text-balance text-3xl font-black tracking-tight sm:text-4xl">🧠 짤기억 <span className="text-primary">(Mem-Pop)</span></h1>
          <p className="mt-3 text-pretty text-base font-semibold leading-6 text-foreground/80">안 외워지는 단어·개념·연도를 3초 만에 뇌리에 콱!</p>
          <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-6 text-muted-foreground">외우기 힘든 하나의 사건이나 개념을 입력하면 배경 설명과 펀치라인 암기 팁을 만들어 드립니다.</p>
        </header>

        <section className="rounded-3xl border border-border/70 bg-card p-4 shadow-xl shadow-primary/5 sm:p-6" aria-label="암기 팁 입력">
          <div className="relative flex items-center rounded-2xl border border-input bg-background px-4 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
            <Search className="mr-3 size-5 shrink-0 text-primary" aria-hidden="true" />
            <input type="text" maxLength={30} value={keyword} onChange={(event) => { setKeyword(event.target.value); setError('') }} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) generate() }} placeholder="외우고 싶은 사건, 개념, 연도를 1개 입력하세요 (예: 임진왜란 1592년, 미토콘드리아)" className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-muted-foreground/70" aria-label="외우고 싶은 단어 또는 개념" />
            <span className="ml-2 shrink-0 text-xs tabular-nums text-muted-foreground">{keyword.length}/30</span>
            {keyword && <button type="button" onClick={() => { setKeyword(''); setError('') }} className="ml-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="입력 지우기"><X className="size-4" /></button>}
          </div>
          {isMultiple && <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-destructive"><AlertCircle className="size-4" /> 한 번에 한 가지 개념만 입력해 주세요.</p>}
          {error && <div role="alert" className="mt-3 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm font-semibold text-destructive"><XCircle className="size-4 shrink-0" />{error}</div>}
          <div className="mt-4 flex flex-wrap items-center gap-2"><span className="mr-1 text-xs font-medium text-muted-foreground">바로 시작하기</span>{suggestions.map((item) => <button type="button" key={item} onClick={() => { setKeyword(item); generate(item) }} className="rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary">{item}</button>)}</div>
          <button type="button" disabled={!keyword.trim() || isMultiple || loading} onClick={() => generate()} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">{loading ? <LoaderCircle className="size-4 animate-spin" /> : <Lightbulb className="size-4" />} {buttonLabel}</button>
        </section>

        <AnimatePresence mode="wait">
          {lesson && !loading && <motion.div key={lesson.background} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }} className="flex flex-col gap-4">
            <article className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-6"><div className="mb-3 flex items-center gap-2 text-sm font-bold text-primary"><span className="flex size-7 items-center justify-center rounded-lg bg-primary/10">1</span> 📖 핵심 배경 & 개념 이해</div><p className="text-sm leading-7 text-muted-foreground">{lesson.background}</p></article>
            <article className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm sm:p-6"><div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-bold text-primary"><span className="flex size-7 items-center justify-center rounded-lg bg-primary/15">2</span> 💡 3줄 연상 암기법</div><button type="button" onClick={copyStory} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary" aria-label="암기 스토리 복사">{copied ? <Check className="size-3.5" /> : <Clipboard className="size-3.5" />}{copied ? '복사됨' : '복사'}</button></div><div className="flex flex-col gap-3">{lesson.lines.map((line, index) => <div key={line} className="flex items-start gap-3"><span className="mt-0.5 shrink-0 rounded-md bg-card px-2 py-1 text-[11px] font-bold text-primary shadow-sm">{['상황 연결', '말장난/연상', '펀치라인'][index]}</span><p className="text-sm font-medium leading-6 text-foreground/85">{line}</p></div>)}</div></article>
            <article className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-6"><div className="mb-4 flex items-center gap-2 text-sm font-bold text-primary"><span className="flex size-7 items-center justify-center rounded-lg bg-primary/10">3</span> ⚡ 1초 확인 퀴즈</div><h2 className="text-base font-bold leading-6">{lesson.quiz.question}</h2><div className="mt-4 flex flex-col gap-2">{lesson.quiz.options.map((option, index) => { const isCorrect = index === lesson.quiz.correct; const isSelected = selected === index; return <button key={option} type="button" disabled={selected !== null} onClick={() => setSelected(index)} className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${isSelected && isCorrect ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700' : isSelected ? 'border-destructive bg-destructive/10 text-destructive' : selected !== null && isCorrect ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700' : 'border-border hover:border-primary/50 hover:bg-primary/5'}`}>{option}{selected !== null && (isCorrect ? <Check className="size-4" /> : isSelected ? <X className="size-4" /> : null)}</button> })}</div>{selected !== null && <div className={`mt-4 rounded-xl px-3 py-3 text-sm leading-6 ${selected === lesson.quiz.correct ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/10 text-amber-700'}`}><strong>{selected === lesson.quiz.correct ? '🎉 정답입니다!' : '💡 아쉬워요!'}</strong> {lesson.quiz.explanation}</div>}</article>
            <div className="flex flex-col gap-2 sm:flex-row"><button type="button" onClick={() => generate()} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold hover:border-primary/40 hover:text-primary"><RotateCcw className="size-4" /> 다른 팁 다시 생성하기</button><button type="button" onClick={() => { setKeyword(''); setLesson(null); setSelected(null); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-muted px-4 py-3 text-sm font-bold hover:bg-muted/80"><Eraser className="size-4" /> 새로운 단어 입력하기</button></div>
          </motion.div>}
        </AnimatePresence>
        <footer className="pb-2 text-center text-xs text-muted-foreground">기억은 연결될 때 오래 남아요 · Mem-Pop</footer>
      </div>
    </main>
  )
}
