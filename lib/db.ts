import { neon } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn('DATABASE_URL not set - database operations will fail');
}

type NeonSql = ReturnType<typeof neon>;

const sql: NeonSql | null = DATABASE_URL ? neon(DATABASE_URL) : null;

export function isConfigured(): boolean {
  return sql !== null;
}

async function runQuery<T>(query: string, params: any[] = []): Promise<T[]> {
  if (!sql) throw new Error('Database not configured');
  const result = await sql(query, params);
  return result as T[];
}

async function runSingle<T>(query: string, params: any[] = []): Promise<T | undefined> {
  const results = await runQuery<T>(query, params);
  return results[0];
}

export async function initializeDatabase() {
  if (!sql) {
    console.log('Skipping DB init - no DATABASE_URL');
    return;
  }

  // Neon/Postgres doesn't support multiple SQL commands in a prepared statement
  // Split each DDL operation into separate await calls

  await sql`CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    anonymous_id TEXT UNIQUE,
    display_name TEXT,
    email TEXT,
    phone_number TEXT,
    full_name TEXT,
    date_of_birth TEXT,
    profession TEXT,
    current_activity_or_job_title TEXT,
    primary_language TEXT,
    additional_languages TEXT DEFAULT '[]',
    role_in_tribe TEXT,
    tenure TEXT,
    current_address_line1 TEXT,
    current_address_line2 TEXT,
    current_city TEXT,
    current_postal_code TEXT,
    current_country TEXT,
    profile_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending',
    survey_stage TEXT DEFAULT 'none',
    consent_data INTEGER DEFAULT 0,
    consent_followup INTEGER DEFAULT 0,
    consent_storage INTEGER DEFAULT 0,
    consent_analysis INTEGER DEFAULT 0,
    consent_contact INTEGER DEFAULT 0,
    consent_birthday_reminder INTEGER DEFAULT 0,
    metadata TEXT DEFAULT '{}'
  );`;

  await sql`CREATE TABLE IF NOT EXISTS survey_responses (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL,
    survey_type TEXT NOT NULL,
    question_id TEXT NOT NULL,
    answer_value TEXT,
    answer_type TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id)
  );`;

  await sql`CREATE TABLE IF NOT EXISTS relationships (
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
  );`;

  await sql`CREATE TABLE IF NOT EXISTS inferred_properties (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL,
    property_type TEXT NOT NULL,
    property_value TEXT,
    confidence REAL DEFAULT 0,
    source_questions TEXT DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id)
  );`;

  await sql`CREATE TABLE IF NOT EXISTS tribe_signals (
    id TEXT PRIMARY KEY,
    signal_type TEXT NOT NULL,
    signal_value TEXT,
    source_members TEXT DEFAULT '[]',
    confidence REAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`;

  await sql`CREATE TABLE IF NOT EXISTS survey_configs (
    id TEXT PRIMARY KEY,
    survey_type TEXT NOT NULL,
    config_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`;

  await sql`CREATE INDEX IF NOT EXISTS idx_responses_member ON survey_responses(member_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_responses_type ON survey_responses(survey_type);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_relationships_source ON relationships(source_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_relationships_target ON relationships(target_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_inferred_member ON inferred_properties(member_id);`;
}

export interface MemberRow {
  id: string;
  anonymous_id: string;
  display_name: string | null;
  email: string | null;
  phone_number: string | null;
  full_name: string | null;
  date_of_birth: string | null;
  profession: string | null;
  current_activity_or_job_title: string | null;
  primary_language: string | null;
  additional_languages: string;
  role_in_tribe: string | null;
  tenure: string | null;
  current_address_line1: string | null;
  current_address_line2: string | null;
  current_city: string | null;
  current_postal_code: string | null;
  current_country: string | null;
  profile_notes: string | null;
  created_at: Date;
  status: string;
  survey_stage: string;
  consent_data: number;
  consent_followup: number;
  consent_storage: number;
  consent_analysis: number;
  consent_contact: number;
  consent_birthday_reminder: number;
  metadata: string;
}

export interface CreateMemberData {
  display_name?: string;
  email?: string;
  phone_number?: string;
  anonymous_id?: string;
  full_name?: string;
  date_of_birth?: string;
  profession?: string;
  current_activity_or_job_title?: string;
  primary_language?: string;
  additional_languages?: string[];
  role_in_tribe?: string;
  tenure?: string;
  current_address_line1?: string;
  current_address_line2?: string;
  current_city?: string;
  current_postal_code?: string;
  current_country?: string;
  profile_notes?: string;
}

export async function createMember(data: CreateMemberData): Promise<string> {
  const id = uuidv4();
  const anonId = data.anonymous_id || uuidv4();
  await runQuery(
    `INSERT INTO members (
      id, anonymous_id, display_name, email, phone_number, full_name, date_of_birth, 
      profession, current_activity_or_job_title, primary_language, additional_languages, 
      role_in_tribe, tenure, current_address_line1, current_address_line2, current_city, 
      current_postal_code, current_country, profile_notes, status, survey_stage
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 'pending', 'none')`,
    [
      id, anonId, data.display_name || null, data.email || null, data.phone_number || null,
      data.full_name || null, data.date_of_birth || null, data.profession || null,
      data.current_activity_or_job_title || null, data.primary_language || null, 
      JSON.stringify(data.additional_languages || []), data.role_in_tribe || null, 
      data.tenure || null, data.current_address_line1 || null, data.current_address_line2 || null,
      data.current_city || null, data.current_postal_code || null, data.current_country || null,
      data.profile_notes || null
    ]
  );
  return id;
}

export async function getMember(id: string): Promise<MemberRow | undefined> {
  return runSingle<MemberRow>('SELECT * FROM members WHERE id = $1', [id]);
}

export async function getMemberByAnonymousId(anonymousId: string): Promise<MemberRow | undefined> {
  return runSingle<MemberRow>('SELECT * FROM members WHERE anonymous_id = $1', [anonymousId]);
}

export interface UpdateMemberData {
  status?: string;
  survey_stage?: string;
  consent_data?: number;
  consent_followup?: number;
  consent_storage?: number;
  consent_analysis?: number;
  consent_contact?: number;
  consent_birthday_reminder?: number;
  display_name?: string;
  email?: string;
  phone_number?: string;
  full_name?: string;
  date_of_birth?: string;
  profession?: string;
  current_activity_or_job_title?: string;
  primary_language?: string;
  additional_languages?: string[];
  role_in_tribe?: string;
  tenure?: string;
  current_address_line1?: string;
  current_address_line2?: string;
  current_city?: string;
  current_postal_code?: string;
  current_country?: string;
  profile_notes?: string;
  metadata?: string;
}

export async function updateMember(id: string, data: UpdateMemberData) {
  const fields: string[] = [];
  const values: any[] = [];
  
  // Handle simple fields
  const simpleFields = [
    'status', 'survey_stage', 'consent_data', 'consent_followup', 
    'consent_storage', 'consent_analysis', 'consent_contact', 'consent_birthday_reminder',
    'display_name', 'email', 'phone_number', 'full_name', 'date_of_birth', 'profession', 
    'current_activity_or_job_title', 'primary_language', 'role_in_tribe', 'tenure', 
    'current_address_line1', 'current_address_line2', 'current_city', 'current_postal_code', 
    'current_country', 'profile_notes', 'metadata'
  ];
  
  simpleFields.forEach(field => {
    if (data[field as keyof UpdateMemberData] !== undefined) {
      fields.push(field);
      values.push(data[field as keyof UpdateMemberData]);
    }
  });
  
  // Handle array fields (need JSON stringification)
  if (data.additional_languages !== undefined) {
    fields.push('additional_languages');
    values.push(JSON.stringify(data.additional_languages));
  }
  
  if (fields.length === 0) return;
  
  const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
  const query = `UPDATE members SET ${setClause} WHERE id = $1`;
  await runQuery(query, [id, ...values]);
}

export async function saveSurveyResponse(data: {
  member_id: string;
  survey_type: string;
  question_id: string;
  answer_value: string;
  answer_type: string;
}): Promise<string> {
  const id = uuidv4();
  await runQuery(
    `INSERT INTO survey_responses (id, member_id, survey_type, question_id, answer_value, answer_type) VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, data.member_id, data.survey_type, data.question_id, data.answer_value, data.answer_type]
  );
  return id;
}

export async function getSurveyResponses(memberId: string, surveyType?: string) {
  if (surveyType) {
    return runQuery('SELECT * FROM survey_responses WHERE member_id = $1 AND survey_type = $2', [memberId, surveyType]);
  }
  return runQuery('SELECT * FROM survey_responses WHERE member_id = $1', [memberId]);
}

export interface RelationshipRow {
  id: string;
  source_id: string;
  target_id: string;
  relationship_type: string;
  strength: number;
  direction: string;
  source_confidence: number;
  created_at: Date;
  validated: number;
  source_name: string | null;
  target_name: string | null;
}

export async function saveRelationship(data: {
  source_id: string;
  target_id: string;
  relationship_type: string;
  strength?: number;
  source_confidence?: number;
}): Promise<string> {
  const id = uuidv4();
  await runQuery(
    `INSERT INTO relationships (id, source_id, target_id, relationship_type, strength, source_confidence) VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, data.source_id, data.target_id, data.relationship_type, data.strength || 3, data.source_confidence || 3]
  );
  return id;
}

export async function getRelationships(type?: string, memberId?: string): Promise<RelationshipRow[]> {
  let query = 'SELECT * FROM relationships';
  const params: string[] = [];
  const conditions: string[] = [];
  let paramIndex = 1;

  if (type) {
    conditions.push(`relationship_type = $${paramIndex++}`);
    params.push(type);
  }
  if (memberId) {
    conditions.push(`(source_id = $${paramIndex++} OR target_id = $${paramIndex++})`);
    params.push(memberId, memberId);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  return runQuery<RelationshipRow>(query, params);
}

export async function saveInferredProperty(data: {
  member_id: string;
  property_type: string;
  property_value: string;
  confidence: number;
  source_questions: string[];
}): Promise<string> {
  const id = uuidv4();
  await runQuery(
    `INSERT INTO inferred_properties (id, member_id, property_type, property_value, confidence, source_questions) VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, data.member_id, data.property_type, data.property_value, data.confidence, JSON.stringify(data.source_questions)]
  );
  return id;
}

export async function getInferredProperties(memberId?: string) {
  if (memberId) {
    return runQuery('SELECT * FROM inferred_properties WHERE member_id = $1', [memberId]);
  }
  return runQuery('SELECT * FROM inferred_properties');
}

export async function saveTribeSignal(data: {
  signal_type: string;
  signal_value: string;
  source_members: string[];
  confidence: number;
}): Promise<string> {
  const id = uuidv4();
  await runQuery(
    `INSERT INTO tribe_signals (id, signal_type, signal_value, source_members, confidence) VALUES ($1, $2, $3, $4, $5)`,
    [id, data.signal_type, data.signal_value, JSON.stringify(data.source_members), data.confidence]
  );
  return id;
}

export async function getTribeSignals(type?: string) {
  if (type) {
    return runQuery('SELECT * FROM tribe_signals WHERE signal_type = $1', [type]);
  }
  return runQuery('SELECT * FROM tribe_signals');
}

export async function getAllMembers(status?: string): Promise<MemberRow[]> {
  if (status) {
    return runQuery<MemberRow>('SELECT * FROM members WHERE status = $1', [status]);
  }
  return runQuery<MemberRow>('SELECT * FROM members');
}

export async function getMemberCount(status?: string): Promise<number> {
  const result = status 
    ? await runSingle<{ count: number }>('SELECT COUNT(*) as count FROM members WHERE status = $1', [status])
    : await runSingle<{ count: number }>('SELECT COUNT(*) as count FROM members');
  return result?.count || 0;
}

export async function getSurveyStats(surveyType: string) {
  return runSingle<{ respondents: number; total_responses: number; last_response: Date | null }>(
    `SELECT COUNT(DISTINCT member_id) as respondents, COUNT(*) as total_responses, MAX(created_at) as last_response FROM survey_responses WHERE survey_type = $1`,
    [surveyType]
  );
}

export interface SurveyResponseRow {
  id: string;
  member_id: string;
  survey_type: string;
  question_id: string;
  answer_value: string;
  answer_type: string;
  created_at: Date;
  display_name: string | null;
  anonymous_id: string | null;
}

export async function getAllResponsesWithMembers(): Promise<SurveyResponseRow[]> {
  return runQuery<SurveyResponseRow>(`
    SELECT r.*, m.display_name, m.anonymous_id
    FROM survey_responses r
    JOIN members m ON r.member_id = m.id
  `);
}

export async function getAllRelationships(): Promise<RelationshipRow[]> {
  return runQuery<RelationshipRow>(`
    SELECT 
      r.*,
      s.display_name as source_name,
      t.display_name as target_name
    FROM relationships r
    LEFT JOIN members s ON r.source_id = s.id
    LEFT JOIN members t ON r.target_id = t.id
  `);
}

export async function deleteMemberData(memberId: string) {
  await runQuery('DELETE FROM survey_responses WHERE member_id = $1', [memberId]);
  await runQuery('DELETE FROM relationships WHERE source_id = $1 OR target_id = $1', [memberId]);
  await runQuery('DELETE FROM inferred_properties WHERE member_id = $1', [memberId]);
  await runQuery('DELETE FROM members WHERE id = $1', [memberId]);
}
