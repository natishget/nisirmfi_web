-- Migration: Add contentHash column to documents table
-- Purpose: Enables duplicate ingestion prevention by storing SHA-256 hash of document content.
-- When re-indexing, documents with unchanged content (same hash) are skipped,
-- saving embedding API calls and ingestion time.

ALTER TABLE documents ADD COLUMN IF NOT EXISTS "contentHash" VARCHAR;
