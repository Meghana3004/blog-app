DROP INDEX IF EXISTS post_embeddings_embedding_idx;

DELETE FROM embedding_jobs;

DELETE FROM post_embeddings;

ALTER TABLE post_embeddings
  ALTER COLUMN embedding TYPE VECTOR(768)
  USING embedding::vector(768);

CREATE INDEX post_embeddings_embedding_idx
  ON post_embeddings USING hnsw (embedding vector_cosine_ops);
