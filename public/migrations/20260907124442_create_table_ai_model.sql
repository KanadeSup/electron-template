CREATE TABLE IF NOT EXISTS ai_providers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_id TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  api_key TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ai_models (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  model_id TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  ai_provider_id INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  
  FOREIGN KEY (ai_provider_id) REFERENCES ai_providers(id) ON DELETE CASCADE
);

INSERT INTO ai_providers (provider_id, provider_name, sort_order) VALUES
  ('openai', 'OpenAI', 0),
  ('anthropic', 'Anthropic', 1),
  ('gemini', 'Gemini', 2),
  ('xai', 'XAI', 3),
  ('open-router', 'OpenRouter', 4);
