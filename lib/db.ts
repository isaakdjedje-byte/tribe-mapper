import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'tribemapper.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      anonymous_id TEXT UNIQUE,
      display_name TEXT,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'pending',
      survey_stage TEXT DEFAULT 'none',
      consent_data INTEGER DEFAULT 0,
      consent_followup INTEGER DEFAULT 0,
      metadata TEXT DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS survey_responses (
      id TEXT PRIMARY KEY,
      member_id TEXT NOT NULL,
      survey_type TEXT NOT NULL,
      question_id TEXT NOT NULL,
      answer_value TEXT,
      answer_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (member_id) REFERENCES members(id)
    );

    CREATE TABLE IF NOT EXISTS relationships (
      id TEXT PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relationship_type TEXT NOT NULL,
      strength INTEGER DEFAULT 3,
      direction TEXT DEFAULT 'bidirectional',
      source_confidence INTEGER DEFAULT 3,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      validated INTEGER DEFAULT 0,
      FOREIGN KEY (source_id) REFERENCES members(id),
      FOREIGN KEY (target_id) REFERENCES members(id)
    );

    CREATE TABLE IF NOT EXISTS inferred_properties (
      id TEXT PRIMARY KEY,
      member_id TEXT NOT NULL,
      property_type TEXT NOT NULL,
      property_value TEXT,
      confidence REAL DEFAULT 0,
      source_questions TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (member_id) REFERENCES members(id)
    );

    CREATE TABLE IF NOT EXISTS tribe_signals (
      id TEXT PRIMARY KEY,
      signal_type TEXT NOT NULL,
      signal_value TEXT,
      source_members TEXT DEFAULT '[]',
      confidence REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS survey_configs (
      id TEXT PRIMARY KEY,
      survey_type TEXT NOT NULL,
      config_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_responses_member ON survey_responses(member_id);
    CREATE INDEX IF NOT EXISTS idx_responses_type ON survey_responses(survey_type);
    CREATE INDEX IF NOT EXISTS idx_relationships_source ON relationships(source_id);
    CREATE INDEX IF NOT EXISTS idx_relationships_target ON relationships(target_id);
    CREATE INDEX IF NOT EXISTS idx_inferred_member ON inferred_properties(member_id);
  `);
}

export interface MemberRow {
  id: string;
  anonymous_id: string;
  display_name: string | null;
  email: string | null;
  created_at: string;
  status: string;
  survey_stage: string;
  consent_data: number;
  consent_followup: number;
  metadata: string;
}

export function createMember(data: { display_name?: string; email?: string; anonymous_id?: string }) {
  const id = uuidv4();
  const stmt = db.prepare(`
    INSERT INTO members (id, anonymous_id, display_name, email, status, survey_stage)
    VALUES (?, ?, ?, ?, 'pending', 'none')
  `);
  stmt.run(id, data.anonymous_id || uuidv4(), data.display_name || null, data.email || null);
  return id;
}

export function getMember(id: string): MemberRow | undefined {
  const stmt = db.prepare('SELECT * FROM members WHERE id = ?');
  return stmt.get(id) as MemberRow | undefined;
}

export function getMemberByAnonymousId(anonymousId: string): MemberRow | undefined {
  const stmt = db.prepare('SELECT * FROM members WHERE anonymous_id = ?');
  return stmt.get(anonymousId) as MemberRow | undefined;
}

export function updateMember(id: string, data: Partial<{
  status: string;
  survey_stage: string;
  consent_data: number;
  consent_followup: number;
  display_name: string;
  email: string;
  metadata: string;
}>) {
  const fields = Object.keys(data);
  const values = Object.values(data);
  if (fields.length === 0) return;
  
  const setClause = fields.map(f => `${f} = ?`).join(', ');
  const stmt = db.prepare(`UPDATE members SET ${setClause} WHERE id = ?`);
  stmt.run(...values, id);
}

export function saveSurveyResponse(data: {
  member_id: string;
  survey_type: string;
  question_id: string;
  answer_value: string;
  answer_type: string;
}) {
  const id = uuidv4();
  const stmt = db.prepare(`
    INSERT INTO survey_responses (id, member_id, survey_type, question_id, answer_value, answer_type)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, data.member_id, data.survey_type, data.question_id, data.answer_value, data.answer_type);
  return id;
}

export function getSurveyResponses(memberId: string, surveyType?: string) {
  if (surveyType) {
    const stmt = db.prepare('SELECT * FROM survey_responses WHERE member_id = ? AND survey_type = ?');
    return stmt.all(memberId, surveyType);
  }
  const stmt = db.prepare('SELECT * FROM survey_responses WHERE member_id = ?');
  return stmt.all(memberId);
}

export function saveRelationship(data: {
  source_id: string;
  target_id: string;
  relationship_type: string;
  strength?: number;
  source_confidence?: number;
}) {
  const id = uuidv4();
  const stmt = db.prepare(`
    INSERT INTO relationships (id, source_id, target_id, relationship_type, strength, source_confidence)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    id,
    data.source_id,
    data.target_id,
    data.relationship_type,
    data.strength || 3,
    data.source_confidence || 3
  );
  return id;
}

export function getRelationships(type?: string, memberId?: string): RelationshipRow[] {
  let query = 'SELECT * FROM relationships';
  const params: string[] = [];
  const conditions: string[] = [];

  if (type) {
    conditions.push('relationship_type = ?');
    params.push(type);
  }
  if (memberId) {
    conditions.push('(source_id = ? OR target_id = ?)');
    params.push(memberId, memberId);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  const stmt = db.prepare(query);
  return stmt.all(...params) as RelationshipRow[];
}

export function saveInferredProperty(data: {
  member_id: string;
  property_type: string;
  property_value: string;
  confidence: number;
  source_questions: string[];
}) {
  const id = uuidv4();
  const stmt = db.prepare(`
    INSERT INTO inferred_properties (id, member_id, property_type, property_value, confidence, source_questions)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    id,
    data.member_id,
    data.property_type,
    data.property_value,
    data.confidence,
    JSON.stringify(data.source_questions)
  );
  return id;
}

export function getInferredProperties(memberId?: string) {
  if (memberId) {
    const stmt = db.prepare('SELECT * FROM inferred_properties WHERE member_id = ?');
    return stmt.all(memberId);
  }
  const stmt = db.prepare('SELECT * FROM inferred_properties');
  return stmt.all();
}

export function saveTribeSignal(data: {
  signal_type: string;
  signal_value: string;
  source_members: string[];
  confidence: number;
}) {
  const id = uuidv4();
  const stmt = db.prepare(`
    INSERT INTO tribe_signals (id, signal_type, signal_value, source_members, confidence)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(
    id,
    data.signal_type,
    data.signal_value,
    JSON.stringify(data.source_members),
    data.confidence
  );
  return id;
}

export function getTribeSignals(type?: string) {
  if (type) {
    const stmt = db.prepare('SELECT * FROM tribe_signals WHERE signal_type = ?');
    return stmt.all(type);
  }
  const stmt = db.prepare('SELECT * FROM tribe_signals');
  return stmt.all();
}

export function getAllMembers(status?: string): MemberRow[] {
  if (status) {
    const stmt = db.prepare('SELECT * FROM members WHERE status = ?');
    return stmt.all(status) as MemberRow[];
  }
  const stmt = db.prepare('SELECT * FROM members');
  return stmt.all() as MemberRow[];
}

export function getMemberCount(status?: string) {
  if (status) {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM members WHERE status = ?');
    return (stmt.get(status) as { count: number }).count;
  }
  const stmt = db.prepare('SELECT COUNT(*) as count FROM members');
  return (stmt.get() as { count: number }).count;
}

export function getSurveyStats(surveyType: string) {
  const stmt = db.prepare(`
    SELECT 
      COUNT(DISTINCT member_id) as respondents,
      COUNT(*) as total_responses,
      MAX(created_at) as last_response
    FROM survey_responses 
    WHERE survey_type = ?
  `);
  return stmt.get(surveyType);
}

export interface SurveyResponseRow {
  id: string;
  member_id: string;
  survey_type: string;
  question_id: string;
  answer_value: string;
  answer_type: string;
  created_at: string;
  display_name: string | null;
  anonymous_id: string | null;
}

export function getAllResponsesWithMembers(): SurveyResponseRow[] {
  const stmt = db.prepare(`
    SELECT r.*, m.display_name, m.anonymous_id
    FROM survey_responses r
    JOIN members m ON r.member_id = m.id
  `);
  return stmt.all() as SurveyResponseRow[];
}

export interface RelationshipRow {
  id: string;
  source_id: string;
  target_id: string;
  relationship_type: string;
  strength: number;
  direction: string;
  source_confidence: number;
  created_at: string;
  validated: number;
  source_name: string | null;
  target_name: string | null;
}

export function getAllRelationships(): RelationshipRow[] {
  const stmt = db.prepare(`
    SELECT 
      r.*,
      s.display_name as source_name,
      t.display_name as target_name
    FROM relationships r
    LEFT JOIN members s ON r.source_id = s.id
    LEFT JOIN members t ON r.target_id = t.id
  `);
  return stmt.all() as RelationshipRow[];
}

export function deleteMemberData(memberId: string) {
  db.prepare('DELETE FROM survey_responses WHERE member_id = ?').run(memberId);
  db.prepare('DELETE FROM relationships WHERE source_id = ? OR target_id = ?').run(memberId, memberId);
  db.prepare('DELETE FROM inferred_properties WHERE member_id = ?').run(memberId);
  db.prepare('DELETE FROM members WHERE id = ?').run(memberId);
}

export default db;
