import { MemPopContent } from '@/types/mem-pop';

/**
 * 짤기억 암기 카드를 SNS 공유용 고화질 PNG 이미지로 렌더링 및 다운로드
 */
export async function exportStoryCardAsImage(content: MemPopContent): Promise<void> {
  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = 1350; // 인스타그램/모바일 카드 최적화 비율 (4:5)
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. 모던 다크 그라데이션 배경
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0f172a'); // slate-900
  bgGrad.addColorStop(0.5, '#090d16');
  bgGrad.addColorStop(1, '#020617'); // slate-950
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. 상단 네온 블러 서클 (장식)
  const glowGrad = ctx.createRadialGradient(200, 200, 10, 200, 200, 450);
  glowGrad.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
  glowGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(200, 200, 450, 0, Math.PI * 2);
  ctx.fill();

  // 3. 내부 글래스모피즘 카드 박스
  const cardX = 80;
  const cardY = 120;
  const cardW = width - 160;
  const cardH = height - 240;
  const radius = 40;

  ctx.save();
  ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, radius);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 4. 브랜드 헤더 태그
  ctx.fillStyle = '#6366f1'; // Indigo-500
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('⚡ 짤기억 (Mem-Pop) · AI 암기 튜터', cardX + 50, cardY + 80);

  // 5. 키워드 타이틀
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px sans-serif';
  const keywordText = `"${content.keyword}"`;
  ctx.fillText(keywordText, cardX + 50, cardY + 175);

  // 구분선
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cardX + 50, cardY + 220);
  ctx.lineTo(cardX + cardW - 50, cardY + 220);
  ctx.stroke();

  // 6. 3줄 연상 스토리 렌더링
  const startY = cardY + 290;
  const badges = ['1. 상황 연결', '2. 말장난/연상', '3. 뇌리 펀치라인'];
  const badgeColors = ['#38bdf8', '#818cf8', '#f43f5e'];

  content.story.forEach((line, idx) => {
    const itemY = startY + idx * 210;

    // 단계 뱃지 박스
    ctx.fillStyle = badgeColors[idx] + '22';
    drawRoundedRect(ctx, cardX + 50, itemY, 200, 48, 14);
    ctx.fill();

    ctx.fillStyle = badgeColors[idx];
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(badges[idx], cardX + 68, itemY + 34);

    // 본문 텍스트 (줄바꿈 처리)
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '500 32px sans-serif';
    wrapText(ctx, line, cardX + 50, itemY + 95, cardW - 100, 44);
  });

  // 7. 하단 1초 퀴즈 맛보기 박스
  const quizBoxY = cardY + cardH - 180;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, cardX + 50, quizBoxY, cardW - 100, 130, 20);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#a5b4fc';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('🎯 1초 퀴즈: ' + content.quiz.question, cardX + 80, quizBoxY + 50);

  ctx.fillStyle = '#10b981';
  ctx.font = '600 26px sans-serif';
  ctx.fillText('💡 정답: ' + content.quiz.options[content.quiz.answer_index], cardX + 80, quizBoxY + 95);

  // 8. 워터마크 푸터
  ctx.fillStyle = '#64748b';
  ctx.font = '500 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('기억은 연결될 때 오래 남아요 · mem-pop.app', width / 2, height - 60);

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
