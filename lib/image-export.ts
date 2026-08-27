import { MemPopContent } from '@/types/mem-pop';

/**
 * 짤기억 암기 카드를 SNS 공유용 고화질 네오브루탈리즘 PNG 이미지로 렌더링 및 다운로드
 */
export async function exportStoryCardAsImage(content: MemPopContent): Promise<void> {
  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = 1350; // 인스타그램/모바일 카드 최적화 비율 (4:5)
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. 크림 아이보리 배경 (#FFF8EF)
  ctx.fillStyle = '#FFF8EF';
  ctx.fillRect(0, 0, width, height);

  // 2. 내부 메인 네오브루탈리즘 카드 박스 (화이트 + 10px 오프셋 섀도우 + 6px 블랙 테두리)
  const cardX = 70;
  const cardY = 90;
  const cardW = width - 140;
  const cardH = height - 180;
  const radius = 36;

  // 하드 섀도우 (블랙 오프셋)
  ctx.fillStyle = '#1A1C1E';
  drawRoundedRect(ctx, cardX + 12, cardY + 12, cardW, cardH, radius);
  ctx.fill();

  // 메인 화이트 카드 본체
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#1A1C1E';
  ctx.lineWidth = 6;
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, radius);
  ctx.fill();
  ctx.stroke();

  // 3. 상단 브랜드 뱃지 태그
  ctx.fillStyle = '#FFD600';
  drawRoundedRect(ctx, cardX + 45, cardY + 45, 300, 56, 16);
  ctx.fill();
  ctx.strokeStyle = '#1A1C1E';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#1A1C1E';
  ctx.font = '900 26px sans-serif';
  ctx.fillText('⚡ 짤기억 · AI 암기 튜터', cardX + 70, cardY + 83);

  // 4. 키워드 타이틀
  ctx.fillStyle = '#1A1C1E';
  ctx.font = '900 68px sans-serif';
  const keywordText = `"${content.keyword}"`;
  ctx.fillText(keywordText, cardX + 45, cardY + 175);

  // 구분선
  ctx.strokeStyle = '#1A1C1E';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cardX + 45, cardY + 215);
  ctx.lineTo(cardX + cardW - 45, cardY + 215);
  ctx.stroke();

  // 5. 3줄 연상 스토리 렌더링
  const startY = cardY + 270;
  const badges = ['1. 상황 연결', '2. 말장난/연상', '3. 뇌리 펀치라인'];
  const badgeColors = ['#70F6FF', '#FF7675', '#FFD600'];

  content.story.forEach((line, idx) => {
    const itemY = startY + idx * 225;

    // 단계 박스 (크림 배경 + 하드 섀도우)
    ctx.fillStyle = '#1A1C1E';
    drawRoundedRect(ctx, cardX + 50, itemY + 6, cardW - 90, 185, 24);
    ctx.fill();

    ctx.fillStyle = '#FFF8EF';
    ctx.strokeStyle = '#1A1C1E';
    ctx.lineWidth = 4;
    drawRoundedRect(ctx, cardX + 45, itemY, cardW - 90, 185, 24);
    ctx.fill();
    ctx.stroke();

    // 단계 뱃지
    ctx.fillStyle = badgeColors[idx];
    drawRoundedRect(ctx, cardX + 70, itemY + 20, 190, 44, 12);
    ctx.fill();
    ctx.strokeStyle = '#1A1C1E';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#1A1C1E';
    ctx.font = '900 22px sans-serif';
    ctx.fillText(badges[idx], cardX + 85, itemY + 50);

    // 본문 텍스트 (줄바꿈 처리)
    ctx.fillStyle = '#1A1C1E';
    ctx.font = 'bold 30px sans-serif';
    wrapText(ctx, line, cardX + 70, itemY + 105, cardW - 140, 40);
  });

  // 6. 하단 1초 퀴즈 맛보기 박스
  const quizBoxY = cardY + cardH - 180;
  ctx.fillStyle = '#1A1C1E';
  drawRoundedRect(ctx, cardX + 50, quizBoxY + 6, cardW - 90, 135, 20);
  ctx.fill();

  ctx.fillStyle = '#FFD600';
  ctx.strokeStyle = '#1A1C1E';
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, cardX + 45, quizBoxY, cardW - 90, 135, 20);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#1A1C1E';
  ctx.font = '900 28px sans-serif';
  ctx.fillText('🎯 1초 퀴즈: ' + content.quiz.question, cardX + 75, quizBoxY + 52);

  ctx.fillStyle = '#1A1C1E';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('💡 정답: ' + content.quiz.options[content.quiz.answer_index], cardX + 75, quizBoxY + 100);

  // 7. 워터마크 푸터
  ctx.fillStyle = '#1A1C1E';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('단어를 짤처럼, 기억은 팝하게 · mem-pop.vercel.app', width / 2, height - 40);

  // 다운로드 트리거
  const link = document.createElement('a');
  link.download = `짤기억_${content.keyword.replace(/\s+/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let curY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, curY);
}

