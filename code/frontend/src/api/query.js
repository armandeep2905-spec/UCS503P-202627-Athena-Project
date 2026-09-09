/**
 * Query API — mock RAG responses.
 * Keyword-matches user input against mock response bank.
 */
import responses from '../mocks/queryResponses.json';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Send a query and receive a grounded answer with source citations.
 * @param {string} question
 * @returns {Promise<{ data?: { answer: string, sources: object[], locationId: number|null } }>}
 */
export async function sendQuery(question) {
  // Simulate RAG processing time
  await delay(800 + Math.random() * 700);

  const q = question.toLowerCase();

  // Find the best matching response by keyword overlap
  let bestMatch = null;
  let bestScore = 0;

  for (const resp of responses) {
    if (resp.keywords.includes('default')) continue;
    const score = resp.keywords.reduce(
      (acc, kw) => acc + (q.includes(kw) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      bestMatch = resp;
    }
  }

  // Fall back to default response
  if (!bestMatch || bestScore === 0) {
    bestMatch = responses.find((r) => r.keywords.includes('default'));
  }

  return {
    data: {
      answer: bestMatch.answer,
      sources: bestMatch.sources,
      locationId: bestMatch.locationId,
    },
  };
}
