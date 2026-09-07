-- Migration: create_table_ai_model

CREATE TABLE IF NOT EXISTS ai_models (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  model_id TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  provider TEXT NOT NULL
);