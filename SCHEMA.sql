-- Chatbots Database Schema 
-- Generated for normalized chatbot data structure 
-- Main chatbots table 

CREATE TABLE chatbots ( id INTEGER PRIMARY KEY, name VARCHAR(255) NOT NULL, description TEXT, ai_model VARCHAR(100) NOT NULL, status VARCHAR(50) NOT NULL DEFAULT 'draft', created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT chk_status CHECK (status IN ('active', 'draft', 'inactive')) ); 

-- Chatbot appearance settings 
CREATE TABLE chatbot_appearance ( id INTEGER PRIMARY KEY AUTOINCREMENT, chatbot_id INTEGER NOT NULL, primary_color VARCHAR(7) NOT NULL, -- Hex color code 
font_family VARCHAR(100) NOT NULL, chat_icon VARCHAR(100) NOT NULL, welcome_message TEXT NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE, UNIQUE(chatbot_id) -- One-to-one relationship 
); 

-- Chatbot behavior settings 

CREATE TABLE chatbot_behavior ( id INTEGER PRIMARY KEY AUTOINCREMENT, chatbot_id INTEGER NOT NULL, initial_messages JSON NOT NULL, -- Array of initial messages 
fallback_message TEXT NOT NULL, enable_human_handoff BOOLEAN NOT NULL DEFAULT false, offline_message TEXT NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE, UNIQUE(chatbot_id) -- One-to-one relationship 
);

-- Chatbot platform integrations 
CREATE TABLE chatbot_integrations ( id INTEGER PRIMARY KEY AUTOINCREMENT, chatbot_id INTEGER NOT NULL, platform VARCHAR(100) NOT NULL, api_key VARCHAR(500), -- Encrypted API key 
is_active BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE, UNIQUE(chatbot_id, platform) -- One chatbot can have one config per platform 
); 

-- Chatbot performance statistics 
CREATE TABLE chatbot_stats ( id INTEGER PRIMARY KEY AUTOINCREMENT, chatbot_id INTEGER NOT NULL, total_messages INTEGER NOT NULL DEFAULT 0, unique_users INTEGER NOT NULL DEFAULT 0, average_rating DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 5.00 
response_rate DECIMAL(5,4) DEFAULT 0.0000, -- 0.0000 to 1.0000 
conversions_count INTEGER NOT NULL DEFAULT 0, last_calculated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE, UNIQUE(chatbot_id), -- One-to-one relationship 
CONSTRAINT chk_rating CHECK (average_rating >= 0 AND average_rating <= 5), CONSTRAINT chk_response_rate CHECK (response_rate >= 0 AND response_rate <= 1) ); 

-- Enhanced training data for vectorization 
CREATE TABLE training_data ( id INTEGER PRIMARY KEY AUTOINCREMENT, chatbot_id INTEGER NOT NULL, content_type VARCHAR(50) NOT NULL, -- faq, knowledge_base, procedure, external_link, website_content 
category VARCHAR(100) NOT NULL, title VARCHAR(255) NOT NULL, content TEXT NOT NULL, intent VARCHAR(100) NOT NULL, keywords TEXT, -- Comma-separated keywords for search 
confidence_score DECIMAL(4,3) DEFAULT 0.000, -- 0.000 to 1.000 
source_url VARCHAR(500), -- URL for external content 
is_active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE, CONSTRAINT chk_content_type CHECK (content_type IN ('faq', 'knowledge_base', 'procedure', 'external_link', 'website_content')), CONSTRAINT chk_confidence CHECK (confidence_score >= 0 AND confidence_score <= 1) ); 

-- Indexes for better performance 
CREATE INDEX idx_chatbots_status ON chatbots(status); CREATE INDEX idx_chatbots_ai_model ON chatbots(ai_model); CREATE INDEX idx_chatbot_appearance_chatbot_id ON chatbot_appearance(chatbot_id); CREATE INDEX idx_chatbot_behavior_chatbot_id ON chatbot_behavior(chatbot_id); CREATE INDEX idx_chatbot_integrations_chatbot_id ON chatbot_integrations(chatbot_id); CREATE INDEX idx_chatbot_integrations_platform ON chatbot_integrations(platform); CREATE INDEX idx_chatbot_stats_chatbot_id ON chatbot_stats(chatbot_id); CREATE INDEX idx_training_data_chatbot_id ON training_data(chatbot_id); CREATE INDEX idx_training_data_content_type ON training_data(content_type); CREATE INDEX idx_training_data_category ON training_data(category); CREATE INDEX idx_training_data_intent ON training_data(intent); CREATE INDEX idx_training_data_is_active ON training_data(is_active); 

-- Full-text search index for training data content 
CREATE VIRTUAL TABLE training_data_fts USING fts5( title, content, keywords, content=training_data, content_rowid=id );

-- Triggers to maintain FTS index 
CREATE TRIGGER training_data_fts_insert AFTER INSERT ON training_data BEGIN INSERT INTO training_data_fts(rowid, title, content, keywords) VALUES (new.id, new.title, new.content, new.keywords); END; CREATE TRIGGER training_data_fts_delete AFTER DELETE ON training_data BEGIN DELETE FROM training_data_fts WHERE rowid = old.id; END; CREATE TRIGGER training_data_fts_update AFTER UPDATE ON training_data BEGIN DELETE FROM training_data_fts WHERE rowid = old.id; INSERT INTO training_data_fts(rowid, title, content, keywords) VALUES (new.id, new.title, new.content, new.keywords); END;