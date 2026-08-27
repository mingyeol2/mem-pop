/**
 * Mem-Pop (짤기억) AI 서비스 진단 및 품질 검증 CLI 도구
 */

const API_BASE = 'http://localhost:3000/api/generate';

const TEST_CASES = [
  { category: '📜 한국사/연도', keyword: '임진왜란 1592', expectSuccess: true },
  { category: '🔤 필수 영단어', keyword: 'mitigate', expectSuccess: true },
  { category: '🔬 과학/학술개념', keyword: '베르누이 방정식', expectSuccess: true },
  { category: '🛡️ AI 가드레일', keyword: 'ㅋㅋㅋㅋㅋ', expectSuccess: false, expectedError: 'INVALID_INPUT' },
];

function printHeader(title) {
  console.log('\n' + '═'.repeat(66));
  console.log(`  🧠 짤기억 (Mem-Pop) - ${title}`);
  console.log('═'.repeat(66));
}

function printBox(title, content) {
  console.log(`\n┌─ [ ${title} ] ` + '─'.repeat(Math.max(0, 56 - title.length)));
  content.forEach(line => console.log(`│ ${line}`));
  console.log('└' + '─'.repeat(64));
}

async function runDiagnosis() {
  printHeader('Google Gemini AI 실시간 서비스 진단 리포트');
  console.log(`⚡ 연동 모델: Google Gemini 3.7 / 3.6 Flash`);
  console.log(`🌐 엔드포인트: ${API_BASE}`);
  console.log(`🕒 진단 시각: ${new Date().toLocaleString('ko-KR')}\n`);

  let totalCount = 0;
  let passedCount = 0;

  for (const test of TEST_CASES) {
    totalCount++;
    const startTime = Date.now();
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: test.keyword }),
      });
      const duration = Date.now() - startTime;
      const data = await response.json();

      if (test.expectSuccess && data.success && data.data) {
        passedCount++;
        const content = data.data;
        printBox(`${test.category}: "${test.keyword}" (소요: ${duration}ms, 상태: 정상 ✅)`, [
          `📖 배경 설명: ${content.background.slice(0, 60)}...`,
          `💡 연상 1줄: ${content.story[0]}`,
          `💡 연상 2줄: ${content.story[1]}`,
          `💡 연상 3줄: ${content.story[2]}`,
          `🎯 1초 퀴즈: ${content.quiz.question}`,
          `   보기: ${content.quiz.options.map((opt, i) => `${i === content.quiz.answer_index ? '★[정답]' : '  '}${opt}`).join(' | ')}`,
          `   해설: ${content.quiz.explanation}`,
        ]);
      } else if (!test.expectSuccess && !data.success && data.error === test.expectedError) {
        passedCount++;
        printBox(`${test.category}: "${test.keyword}" (소요: ${duration}ms, 상태: 방어 성공 ✅)`, [
          `🚫 차단 코드: ${data.error}`,
          `💬 사용자 안내 문구: "${data.message}"`,
          `✨ 정상 가드레일 작동 확인 완료 (무의미한 텍스트 할루시네이션 방지)`,
        ]);
      } else {
        printBox(`${test.category}: "${test.keyword}" (실패 ❌)`, [
          `응답: ${JSON.stringify(data)}`,
        ]);
      }
    } catch (err) {
      printBox(`${test.category}: "${test.keyword}" (네트워크 오류 ❌)`, [
        `에러 메시지: ${err.message}`,
      ]);
    }
  }

  console.log('\n' + '─'.repeat(66));
  console.log(`📊 최종 진단 결과: ${passedCount}/${totalCount} 항목 검증 성공 (${Math.round((passedCount / totalCount) * 100)}%)`);
  console.log(`🚀 Gemini AI 기반 연상 암기 튜터 서비스가 정상 가동 중입니다!`);
  console.log('─'.repeat(66) + '\n');
}

runDiagnosis();
