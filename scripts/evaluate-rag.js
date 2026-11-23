require('dotenv').config();

const db = require('../db');
const { answerQuestion } = require('../services/aiAssistant');
const cases = require('./rag-evaluation.json');

const percentage = (correct, total) => (
  total === 0 ? 'n/a' : `${((correct / total) * 100).toFixed(1)}% (${correct}/${total})`
);

const percentile = (values, fraction) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil(sorted.length * fraction) - 1)];
};

async function evaluate() {
  const results = [];
  for (const testCase of cases) {
    const startedAt = performance.now();
    const result = await answerQuestion(testCase.query);
    const latencyMs = performance.now() - startedAt;
    const correctMode = result.mode === testCase.expectedMode;
    const correctSource = testCase.expectedMode !== 'retrieval'
      || result.sources[0]?.postId === testCase.expectedPostId;
    const answerText = result.answer.toLowerCase();
    const answerFactMatched = !testCase.mustIncludeAny
      || testCase.mustIncludeAny.some((term) => answerText.includes(term.toLowerCase()));

    results.push({
      query: testCase.query,
      expectedMode: testCase.expectedMode,
      actualMode: result.mode,
      correctMode,
      expectedPostId: testCase.expectedPostId,
      actualPostId: result.sources[0]?.postId,
      correctSource,
      answerFactMatched,
      latencyMs,
    });
  }

  const blogResults = results.filter((result) => result.expectedMode === 'retrieval');
  const factChecks = results.filter((result) => result.answerFactMatched !== undefined
    && cases.find((testCase) => testCase.query === result.query)?.mustIncludeAny);
  const latencies = results.map((result) => result.latencyMs);
  const modeCorrect = results.filter((result) => result.correctMode).length;
  const sourceCorrect = blogResults.filter((result) => result.correctSource).length;
  const factsCorrect = factChecks.filter((result) => result.answerFactMatched).length;

  console.table(results.map((result) => ({
    query: result.query,
    mode: `${result.actualMode}${result.correctMode ? '' : ' (expected ' + result.expectedMode + ')'}`,
    source: result.expectedPostId
      ? `${result.actualPostId ?? 'none'}${result.correctSource ? '' : ` (expected ${result.expectedPostId})`}`
      : '-',
    latencyMs: Math.round(result.latencyMs),
  })));
  console.log(`Intent/mode accuracy: ${percentage(modeCorrect, results.length)}`);
  console.log(`Blog source Hit@1: ${percentage(sourceCorrect, blogResults.length)}`);
  if (factChecks.length > 0) {
    console.log(`Answer keyword checks: ${percentage(factsCorrect, factChecks.length)} (smoke check, not a factuality proof)`);
  }
  console.log(`Latency p50/p95: ${Math.round(percentile(latencies, 0.5))}ms / ${Math.round(percentile(latencies, 0.95))}ms`);

  if (modeCorrect !== results.length || sourceCorrect !== blogResults.length || factsCorrect !== factChecks.length) {
    process.exitCode = 1;
  }
}

evaluate()
  .catch((error) => {
    console.error('RAG evaluation failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => db.end());
