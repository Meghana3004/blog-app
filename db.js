require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool();

pool.on('error', (err) => {
  console.error('Unexpected error from an idle PostgreSQL client:', err);
});

module.exports = pool;
