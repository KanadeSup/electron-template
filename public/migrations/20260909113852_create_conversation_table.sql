-- Create conversations table
CREATE TABLE conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  name TEXT NOT NULL,
  model TEXT DEFAULT NULL,
  history TEXT DEFAULT NULL,
  
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create conversation messages table
CREATE TABLE conversation_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER NOT NULL,
  
  type TEXT NOT NULL,
  content TEXT NOT NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE
);

--- Create index
CREATE INDEX idx_conversation_messages_conversation_id_updated_at 
ON conversation_messages (conversation_id, updated_at);
