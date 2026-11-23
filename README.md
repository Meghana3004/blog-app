# Infinite Horizons

A full-stack blog application with authenticated post management, taxonomy filters,
image uploads, and a retrieval-augmented assistant grounded in published posts.

## Features

- React UI with rich-text posts, profiles, comments, replies, likes, search, and pagination.
- PostgreSQL API with password hashing, PostgreSQL-backed sessions, and owner-only post edits/deletes.
- Category and tag filtering with server-side pagination and search.
- Local image uploads (JPEG, PNG, GIF, or WebP; maximum 5 MB per file).
- Local RAG assistant using Ollama chat and embedding models, PostgreSQL `pgvector` cosine similarity, and cited post sources.
- Deterministic rule-based responses for greetings and assistant help.

## Local setup

Requirements: Node.js 20+, PostgreSQL with pgvector, and Ollama for local AI inference.

1. Copy `.env.example` to `.env`, or merge its settings into your existing `.env`. Never commit `.env`.
2. Set `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD` to match your local PostgreSQL server. The examples use port `5433`; keep `PORT=3000` and `API_PORT=3001`.
3. Ensure pgvector is installed on that PostgreSQL server and start PostgreSQL. On a new, empty database only, run `dumps/Dump20240724/postgres_import.sql` once to create the legacy tables and import demo posts.

4. Apply the application schema:

   ```powershell
   npm install
   npm run db:migrate
   ```

   The local-model migration changes the embedding column to 768 dimensions and removes only old, incompatible embedding vectors. It does not delete posts, users, comments, or other blog data.
5. Install Ollama for Windows, then download the 2024-era chat and embedding models:

   ```powershell
   ollama pull gemma:2b
   ollama pull nomic-embed-text
   ```

6. Rebuild embeddings for existing posts:

   ```powershell
   npm run ai:reindex
   ```

   Ollama must be running locally. New and edited posts are queued for background indexing while the API is running. The basic greeting/help responses do not need Ollama.
7. Start the API and UI together:

   ```powershell
   npm run dev:all
   ```

   Open the frontend URL printed by Create React App, normally `http://localhost:3000`.

Docker Compose is optional if you prefer the bundled pgvector database. The import script is for a new empty database; do not run it over existing tables or data. Imported legacy accounts have no password hashes, so register a new account to use the password-based login.

In development, an unset `SESSION_SECRET` is replaced with an ephemeral secret and a
warning. Set a long random `SESSION_SECRET` in production. Generate one with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Uploaded files are stored in the local `uploads/` directory, which is ignored by Git.
Use durable object storage before deploying to an ephemeral filesystem.

## Tests and build

```powershell
npm test -- --watchAll=false
npm run test:api
npm run build
```

## Resume draft

Use these claims only after the database setup and an end-to-end demo have been verified:

- Built a full-stack React/Node.js blog with PostgreSQL-backed sessions, password hashing,
  owner-scoped post CRUD, comments, replies, likes, uploads, category/tag filters, and
  server-side search/pagination.
- Implemented a local-model RAG blog assistant with asynchronous Ollama embedding jobs,
  PostgreSQL pgvector cosine retrieval, grounded answers, and source citations.
