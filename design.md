# [Design System] 짤기억(Mem-Pop)

## 1. 브랜드 컨셉 & 톤앤매너
'짤기억(Mem-Pop)'은 수험생과 학습자들이 지루한 암기 과정에서 벗어나, '뇌리에 콱 박히는' 강렬하고 재미있는 암기 경험을 제공하는 것을 목표로 합니다.

- **비주얼 스타일**: 네오브루탈리즘 (Neo-Brutalism)
- **핵심 키워드**: 팝(Pop), 직관적인(Intuitive), 위트 있는(Witty), 강렬한(Impactful)
- **보이스앤톤**: 친근한 구어체와 에너제틱한 한국어 표현 ("뇌리에 콱", "망각은 이제 그만", "도파민 팝")

---

## 2. 컬러 팔레트 (Color Palette)
강한 대비와 고채도 컬러를 사용하여 시각적 몰입감을 극대화합니다.

- **Primary**: `#FFD600` (Vivid Yellow) - 브랜드 정체성과 에너지를 상징 (버튼, 핵심 강조)
- **Background**: `#FFF8EF` (Cream Ivory) - 눈의 피로를 덜어주며 따뜻하고 팝한 베이스
- **Accent/Secondary**: `#1A1C1E` (Hard Black) - 굵은 테두리와 단단한 하드 섀도우
- **Card Background**: `#FFFFFF` (Pure White) - 굵은 테두리와 대비되는 깔끔한 면
- **Functional Colors**:
  - **Success / Correct**: `#00C853` (Vivid Green) - 퀴즈 정답
  - **Error / Warning**: `#FF5252` (Vivid Red) - 퀴즈 오답 및 에러 경고
  - **Highlight Badges**: `#FF6B6B`, `#4D96FF`, `#6BCB77`, `#9B51E0` (도파민 팝 뱃지)

---

## 3. 타이포그래피 (Typography)
- **Primary Font**: `Pretendard`, `Bricolage Grotesque`, sans-serif
- **Heading**: Black/ExtraBold (900/800)의 강렬한 폰트 두께와 큰 사이즈로 위계 전달
- **Body**: Medium/SemiBold (500/600)의 또렷한 굵기와 쾌적한 행간

---

## 4. 컴포넌트 스타일 (Component Rules)
네오브루탈리즘 스타일을 관통하는 핵심 조형 규칙입니다.

1. **Border (테두리)**: 모든 카드, 버튼, 인풋에 **3px 이상의 솔리드 블랙 테두리 (`border-[3px] border-[#1A1C1E]`)** 적용
2. **Hard Shadow (하드 섀도우)**: 블러(blur) 없이 우하단으로 딱 떨어지는 **오프셋 그림자 (`shadow-[4px_4px_0px_#1A1C1E]` ~ `shadow-[8px_8px_0px_#1A1C1E]`)**
3. **Roundness (곡률)**: 10px ~ 16px (`rounded-xl`, `rounded-2xl`)의 부드러운 박스 모서리
4. **Active State (물리적 누름 효과)**:
   - 버튼 클릭(Active) 시 `translate-x-[4px] translate-y-[4px]` 이동하며 그림자가 `0px`로 납작해지는 쫀득한 버튼 클릭 피드백

---

## 5. 인터랙션 가이드 (Interaction)
- **Buttons**: Hover 시 테투리 대비 강조 및 살짝 팝업, Active 시 하드 섀도우 깊이만큼 이동
- **Cards**: 부드럽고 통통 튀는 바운스 팝업(Spring 애니메이션)
- **Quiz Feedback**: 정답/오답 클릭 시 즉각적인 네온 컬러 반전, 볼드 뱃지, 도파민 파티클 피드백

---

## 6. 레이아웃 (Layout)
- **Desktop**: 중앙 집중형 640px 컨테이너, 여유로운 네오브루탈리즘 여백과 강조 카드
- **Mobile**: 모바일 터치 친화적 대형 버튼 및 수직 스택 카드 구조
