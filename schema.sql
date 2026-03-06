-- TribeMapper Postgres Schema
-- Run this in your Neon console or use for reference

-- Members table
CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    anonymous_id TEXT UNIQUE,
    display_name TEXT,
    email TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending',
    survey_stage TEXT DEFAULT 'none',
    consent_data INTEGER DEFAULT 0,
    consent_followup INTEGER DEFAULT 0,
    metadata TEXT DEFAULT '{}'
);

-- Survey responses table
CREATE TABLE IF NOT EXISTS survey_responses (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL,
    survey_type TEXT NOT NULL,
    question_id TEXT NOT NULL,
    answer_value TEXT,
    answer_type TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id)
);

-- Relationships table (trust, collaboration, influence, conflict)
CREATE TABLE IF NOT EXISTS relationships (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    relationship_type TEXT NOT NULL,
    strength INTEGER DEFAULT 3,
    direction TEXT DEFAULT 'bidirectional',
    source_confidence INTEGER DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validated INTEGER DEFAULT 0,
    FOREIGN KEY (source_id) REFERENCES members(id),
    FOREIGN KEY (target_id) REFERENCES members(id)
);

-- Inferred properties table
CREATE TABLE IF NOT EXISTS inferred_properties (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL,
    property_type TEXT NOT NULL,
    property_value TEXT,
    confidence REAL DEFAULT 0,
    source_questions TEXT DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id)
);

-- Tribe signals table
CREATE TABLE IF NOT EXISTS tribe_signals (
    id TEXT PRIMARY KEY,
    signal_type TEXT NOT NULL,
    signal_value TEXT,
    source_members TEXT DEFAULT '[]',
    confidence REAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Survey configs table
CREATE TABLE IF NOT EXISTS survey_configs (
    id TEXT PRIMARY KEY,
    survey_type TEXT NOT NULL,
    config_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_responses_member ON survey_responses(member_id);
CREATE INDEX IF NOT EXISTS idx_responses_type ON survey_responses(survey_type);
CREATE INDEX IF NOT EXISTS idx_relationships_source ON relationships(source_id);
CREATE INDEX IF NOT EXISTS idx_relationships_target ON relationships(target_id);
CREATE INDEX IF NOT EXISTS idx_inferred_member ON inferred_properties(member_id);
