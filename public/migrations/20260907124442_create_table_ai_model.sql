CREATE TABLE IF NOT EXISTS providers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_name TEXT NOT NULL,
  provider_label TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  api_key TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ai_models (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  model_name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  provider_id INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  
  FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

INSERT INTO providers (provider_name, provider_label, sort_order) VALUES
  ('openai', 'OpenAI', 0),
  ('anthropic', 'Anthropic', 1),
  ('gemini', 'Gemini', 2),
  ('xai', 'XAI', 3),
  ('open-router', 'OpenRouter', 4);
