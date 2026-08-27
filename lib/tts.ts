/**
 * Web Speech API 기반 한국어 TTS (Text-to-Speech) 유틸리티
 */

export interface TTSState {
  isPlaying: boolean;
  isSupported: boolean;
}

export function isTTSSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakStory(
  lines: [string, string, string],
  options?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): { stop: () => void } {
  if (!isTTSSupported()) {
    options?.onError?.(new Error('TTS_NOT_SUPPORTED'));
    return { stop: () => {} };
  }

  // 기존 음성 재생 중단
  window.speechSynthesis.cancel();

  // 3줄 스토리를 자연스러운 호흡으로 읽기 위한 텍스트 정제
  const fullText = lines
    .map((line, idx) => {
      // 태그 제거 ([상황 연결], [말장난/연상], [펀치라인], 1줄: 등)
      const cleanLine = line.replace(/\[.*?\]|\d+줄:\s*/g, '').trim();
      return `${idx + 1}단계. ${cleanLine}`;
    })
    .join('. ');

  const utterance = new SpeechSynthesisUtterance(fullText);
  utterance.lang = 'ko-KR';
  utterance.rate = 0.95; // 명확한 암기를 위해 살짝 여유로운 배속
  utterance.pitch = 1.05; // 쾌활하고 또렷한 톤

  // 브라우저에서 한국어 음성 보이스 탐색
  const voices = window.speechSynthesis.getVoices();
  const koVoice = voices.find((v) => v.lang.startsWith('ko') || v.name.includes('Korean'));
  if (koVoice) {
    utterance.voice = koVoice;
  }

  utterance.onstart = () => {
    options?.onStart?.();
  };

  utterance.onend = () => {
    options?.onEnd?.();
  };

  utterance.onerror = (e) => {
    if (e.error !== 'canceled') {
      options?.onError?.(e);
    }
    options?.onEnd?.();
  };

  window.speechSynthesis.speak(utterance);

  return {
    stop: () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      options?.onEnd?.();
    },
  };
}

export function stopSpeaking() {
  if (isTTSSupported()) {
    window.speechSynthesis.cancel();
  }
}
