# 🧠 짤기억 (Mem-Pop) - 뇌리에 콱 박히는 AI 암기 튜터

> 외우기 힘든 단어·개념·연도를 단 한 줄 입력하는 것만으로, AI가 **재치 있는 3줄 연상 스토리**와 **3지선다 1초 퀴즈**를 즉시 생성하는 초경량 단일 화면 웹 애플리케이션입니다.

---

## ✨ 주요 기능 및 특징

- ⚡ **단일 화면 집중 몰입 (Single Page):** 로그인/결제/별도 DB 없이 브라우저에서 즉시 실행
- 💡 **3줄 연상 암기 스토리:** [상황 연결] ➔ [말장난/발음 연상] ➔ [펀치라인] 구조의 재치 있는 암기 팁
- 🎯 **3지선다 1초 확인 퀴즈:** 즉각적인 시각 피드백(초록/빨강) 및 1회 클릭 잠금, 명쾌한 해설
- 🔊 **TTS 음성 낭독 (소리내어 외우기):** Web Speech API 기반 3줄 연상 스토리 한국어 음성 낭독으로 청각 암기 결합
- 📑 **나만의 암기장 (Local Storage):** 브라우저 로컬 저장소 기반 암기 카드 북마크 및 슬라이드 서랍(Drawer) 복습
- 🖼️ **SNS 짤 카드 이미지 저장 (PNG):** 인스타그램/카카오톡 공유용 1080x1350 고화질 짤 카드 이미지 실시간 다운로드
- 🛡️ **완벽한 예외 처리 & 회복 탄력성:**
  - 30자 입력 제한 및 다중 키워드 구분자 실시간 감지
  - 무의미한 외계어/오타 방지 **AI 가드레일(`INVALID_INPUT`)** 안내
  - **25초 타임아웃** 강제 중단(`AbortController`) 및 다이내믹 4단계 AI 로딩 인터랙션
  - 네트워크/서버 에러 발생 시 **1초 후 백그라운드 1회 자동 재시도(Auto-Retry)**

---

## 🛠️ 기술 스택

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & Styling:** React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide React
- **LLM Integration:** Google Gemini 3.7 / 3.6 Flash API + Mock Fallback

---

## 🚀 시작하기

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정 (선택 사항)
`.env` 파일 생성 후 LLM API 키 설정:
```env
GEMINI_API_KEY=your_gemini_api_key
```
*(API 키가 설정되지 않은 경우, 테스트를 위한 내장 지능형 생성기가 자동으로 동작합니다.)*

### 3. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

### 4. 프로덕션 빌드
```bash
npm run build
npm run start
```

---

## 📚 관련 문서

- 📋 [제품 요구사항 정의서 (PRD)](./PRD.md)
- 🚀 [스프린트 개발 결과 및 계획서 (DEVELOPMENT_PLAN.md)](./docs/DEVELOPMENT_PLAN.md)
- 🧠 [AI 서비스 고도화 및 품질 개선 계획서 (AI_ENHANCEMENT_PLAN.md)](./docs/AI_ENHANCEMENT_PLAN.md)
- 🏗️ [시스템 아키텍처 명세서 (ARCHITECTURE.md)](./docs/ARCHITECTURE.md)

