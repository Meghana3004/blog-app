# Infinite Horizons

A full-stack blog application with authenticated post management, taxonomy filters,
image uploads, and a retrieval-augmented assistant grounded in published posts.

## Features

- React UI with rich-text posts, profiles, comments, replies, likes, search, and pagination.
- PostgreSQL API with password hashing, PostgreSQL-backed sessions, and owner-only post edits/deletes.
- Category and tag filtering with server-side pagination and search.
- Local image uploads (JPEG, PNG, GIF, or WebP; maximum 5 MB per file).
- Local RAG assistant using Ollama chat and embedding models, PostgreSQL `pgvector` cosine similarity, and cited post sources.
- Deterministic responses for greetings, thanks, and assistant help; general questions are answered separately from blog-grounded queries.

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

   `gemma:2b` keeps the download small. For a stronger 2024-era chat model, optionally run `ollama pull llama3.1:8b` (about 4.9 GB), then set `OLLAMA_CHAT_MODEL=llama3.1:8b` in `.env` and restart the API. Keep `nomic-embed-text` for embeddings.

6. Rebuild embeddings for existing posts:

   ```powershell
   npm run ai:reindex
   ```

   Ollama must be running locally. New and edited posts are queued for background indexing while the API is running. Greeting, thanks, and help responses do not need Ollama.
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
npm run ai:evaluate
npm run build
```

`npm run ai:evaluate` runs the small labeled question set in `scripts/rag-evaluation.json`
against the local Ollama models and current database. It reports intent/mode accuracy,
blog retrieval Hit@1, response latency, and an optional expected-keyword smoke check.
These results describe only this test set; keyword checks are not proof of factuality.
For interviews, discuss how you would grow the set with held-out questions and human
relevance/factuality judgments rather than presenting the demo-set score as universal accuracy.
The current retrieval settings use one source (`top_k=1`), a cosine-similarity threshold
of `0.55`, 768-dimensional Nomic embeddings, and temperature `0.2`.

## Resume draft

Use these claims only after the database setup and an end-to-end demo have been verified:

- Built a full-stack React/Node.js blog with PostgreSQL-backed sessions, password hashing,
  owner-scoped post CRUD, comments, replies, likes, uploads, category/tag filters, and
  server-side search/pagination.
- Implemented a local-model RAG blog assistant with asynchronous Ollama embedding jobs,
  PostgreSQL pgvector cosine retrieval, grounded answers, and source citations.
