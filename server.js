require('dotenv').config();

const crypto = require('crypto');
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const multer = require('multer');
const db = require('./db');

const app = express();
const port = process.env.API_PORT || process.env.PORT || 5000;
const uploadDirectory = path.resolve(process.env.UPLOAD_DIR || 'uploads');
const sessionSecret = process.env.SESSION_SECRET || (
  process.env.NODE_ENV === 'production'
    ? null
    : crypto.randomBytes(32).toString('hex')
);

if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set in production.');
}

if (!process.env.SESSION_SECRET) {
  console.warn('SESSION_SECRET is unset; using an ephemeral development-only secret.');
}

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  store: new PgSession({
    pool: db,
    tableName: 'user_sessions',
    createTableIfMissing: true,
  }),
  name: 'blog.sid',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));
app.use('/uploads', express.static(uploadDirectory, {
  dotfiles: 'deny',
  index: false,
  maxAge: '1d',
}));

app.get('/', (req, res) => {
  res.json({ service: 'Infinite Horizons API', status: 'ok', health: '/health/ready' });
});
app.get('/health/live', (req, res) => {
  res.json({ status: 'alive' });
});
app.get('/health/ready', async (req, res) => {
  try {
    await db.query('SELECT 1');
    return res.json({ status: 'ready' });
  } catch (error) {
    console.error('Database readiness check failed:', error.message);
    return res.status(503).json({ status: 'not_ready' });
  }
});

const routes = require('./routes/routes');

app.use('/api', routes);
app.use('/', routes);
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  if (error instanceof multer.MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({ message: error.message });
  }
  if (error.code === 'INVALID_IMAGE_TYPE') {
    return res.status(415).json({ message: error.message });
  }
  console.error('Unhandled request error:', error);
  return res.status(500).json({ message: 'Internal server error' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    require('./services/aiAssistant').startEmbeddingWorker();
  });
}

module.exports = app;

