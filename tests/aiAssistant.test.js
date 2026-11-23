const assert = require('node:assert/strict');
const test = require('node:test');
const {
  answerQuestion,
  contentToText,
  getRuleBasedAnswer,
} = require('../services/aiAssistant');
const requireAuth = require('../middleware/requireAuth');
const db = require('../db');

test('extracts readable text from Draft.js post content', () => {
  const content = JSON.stringify({
    blocks: [{ text: 'First paragraph' }, { text: 'Second paragraph' }],
  });
  assert.equal(contentToText(content), 'First paragraph\nSecond paragraph');
});

test('uses a deterministic response for greetings', () => {
  assert.match(getRuleBasedAnswer('Hello!'), /Ask me a question/);
  assert.equal(getRuleBasedAnswer('Where is the post about Paris?'), null);
});

test('answers blog questions with local Ollama embeddings and chat', async () => {
  const originalFetch = global.fetch;
  const originalQuery = db.query;
  const requests = [];
  let retrievalLimit;
  global.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    requests.push({ url, body });
    const result = url.endsWith('/api/embed')
      ? { embeddings: [Array(768).fill(0.1)] }
      : { message: { content: 'The post says Paris is the capital. [1]' } };
    return { ok: true, statusText: 'OK', json: async () => result };
  };
  db.query = async (_sql, values) => {
    retrievalLimit = values[1];
    return {
    rows: [{
      post_id: 7,
      title: 'A trip to Paris',
      content: 'Paris is the capital.',
      similarity: '0.9',
    }, {
      post_id: 8,
      title: 'A trip to Tokyo',
      content: 'Tokyo is in Japan.',
      similarity: '0.5',
    }],
    };
  };

  try {
    const result = await answerQuestion('What does the Paris post say?');
    assert.equal(result.mode, 'retrieval');
    assert.deepEqual(result.sources.map((source) => source.postId), [7]);
    assert.equal(retrievalLimit, 1);
    assert.equal(requests[0].url.endsWith('/api/embed'), true);
    assert.match(requests[0].body.input, /^search_query: /);
    assert.equal(requests[1].url.endsWith('/api/chat'), true);
    assert.equal(requests[1].body.model, process.env.OLLAMA_CHAT_MODEL || 'gemma:2b');
    assert.match(requests[1].body.messages[1].content, /A trip to Paris/);
    assert.doesNotMatch(requests[1].body.messages[1].content, /A trip to Tokyo/);
  } finally {
    global.fetch = originalFetch;
    db.query = originalQuery;
  }
});

test('declines weak retrieval matches instead of sending unrelated context to chat', async () => {
  const originalFetch = global.fetch;
  const originalQuery = db.query;
  let chatRequested = false;
  global.fetch = async (url) => {
    if (url.endsWith('/api/chat')) {
      chatRequested = true;
      throw new Error('Chat should not be called for a weak match');
    }
    return {
      ok: true,
      statusText: 'OK',
      json: async () => ({ embeddings: [Array(768).fill(0.1)] }),
    };
  };
  db.query = async () => ({
    rows: [{
      post_id: 8,
      title: 'A trip to Tokyo',
      content: 'Tokyo is in Japan.',
      similarity: '0.3',
    }],
  });

  try {
    const result = await answerQuestion('How do I repair a bicycle?');
    assert.equal(result.sources.length, 0);
    assert.match(result.answer, /could not find a relevant post/i);
    assert.equal(chatRequested, false);
  } finally {
    global.fetch = originalFetch;
    db.query = originalQuery;
  }
});

test('rejects requests without an authenticated session', () => {
  const response = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  let continued = false;

  requireAuth({ session: {} }, response, () => {
    continued = true;
  });

  assert.equal(response.statusCode, 401);
  assert.equal(continued, false);
});

test('allows requests with a session user', () => {
  let continued = false;
  requireAuth({ session: { user: { username: 'reader' } } }, {}, () => {
    continued = true;
  });
  assert.equal(continued, true);
});
