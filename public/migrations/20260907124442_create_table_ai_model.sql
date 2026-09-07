-- Migration: create_table_ai_model

CREATE TABLE ai_models (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  model_id TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE
);