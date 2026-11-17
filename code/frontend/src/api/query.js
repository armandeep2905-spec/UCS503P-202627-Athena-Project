/**
 * Query API — Live RAG with Gemini + Official TIET Documents.
 * Calls Django backend POST /api/query/ with graceful offline fallback.
 */
import { fetchClient } from './client';
import fallbackResponses from '../mocks/queryResponses.json';

/**
 * Send a query and receive a grounded answer with source citations.
 * @param {string} question
 * @returns {Promise<{ data: { answer: string, sources: object[], locationId: number|null } }>}
 */
export async function sendQuery(question) {
  try {
    const { data, error } = await fetchClient('/api/query/', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });

    if (data && data.answer) {
      return { data };
    }

    if (error) {
      console.warn('Live API response error, checking local fallback:', error);
    }
  } catch (err) {
    console.warn('Backend query unreachable, falling back to local bank:', err);
  }

  // Fallback to local response bank if backend is not running
  const q = question.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const resp of fallbackResponses) {
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

  if (!bestMatch || bestScore === 0) {
    bestMatch = Array.isArray(fallbackResponses) ? fallbackResponses.find((r) => r.keywords && r.keywords.includes('default')) : null;
  }

  if (!bestMatch) {
    bestMatch = {
      answer: "I'm Athena, your campus assistant. How can I assist you with Thapar academics, courses, regulations, or campus facilities today?",
      sources: [],
      locationId: null,
    };
  }

  return {
    data: {
      answer: bestMatch.answer || "I could not find an answer right now.",
      sources: Array.isArray(bestMatch.sources) ? bestMatch.sources : [],
      locationId: bestMatch.locationId || null,
    },
  };
}
