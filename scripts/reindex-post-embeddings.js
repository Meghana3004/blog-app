require('dotenv').config();

const db = require('../db');
const { indexPost } = require('../services/aiAssistant');

async function reindexPosts() {
  const result = await db.query('SELECT post_id FROM posts ORDER BY post_id');
  for (const row of result.rows) {
    await indexPost(row.post_id);
    console.log(`Indexed post ${row.post_id}`);
  }
}

reindexPosts()
  .catch((error) => {
    console.error('Failed to reindex posts:', error.message);
    process.exitCode = 1;
  })
  .finally(() => db.end());
