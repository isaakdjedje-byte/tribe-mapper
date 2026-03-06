#!/usr/bin/env node
/**
 * SQLite to Postgres Import Script
 * 
 * Usage:
 * 1. Export your SQLite database first (sqlite3 tribemapper.db ".dump" > dump.sql)
 * 2. Or use this script to import specific tables
 * 
 * This script imports members and relationships from SQLite to Neon Postgres.
 * Run after setting DATABASE_URL in your environment.
 */

const Database = require('better-sqlite3');
const { neon } = require('@neondatabase/serverless');
const path = require('path');

const SQLITE_DB_PATH = process.env.SQLITE_DB_PATH || path.join(process.cwd(), 'tribemapper.db');
const NEON_DATABASE_URL = process.env.DATABASE_URL;

if (!NEON_DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is required');
  console.log('Example: export DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"');
  process.exit(1);
}

async function importData() {
  console.log('Reading SQLite database...');
  const sqliteDb = Database(SQLITE_DB_PATH);
  const sql = neon(NEON_DATABASE_URL);

  // Import members
  console.log('Importing members...');
  const members = sqliteDb.prepare('SELECT * FROM members').all();
  
  for (const member of members) {
    await sql`
      INSERT INTO members (id, anonymous_id, display_name, email, created_at, status, survey_stage, consent_data, consent_followup, metadata)
      VALUES (${member.id}, ${member.anonymous_id}, ${member.display_name}, ${member.email}, ${member.created_at}, ${member.status}, ${member.survey_stage}, ${member.consent_data}, ${member.consent_followup}, ${member.metadata})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log(`Imported ${members.length} members`);

  // Import survey responses
  console.log('Importing survey responses...');
  const responses = sqliteDb.prepare('SELECT * FROM survey_responses').all();
  
  for (const response of responses) {
    await sql`
      INSERT INTO survey_responses (id, member_id, survey_type, question_id, answer_value, answer_type, created_at)
      VALUES (${response.id}, ${response.member_id}, ${response.survey_type}, ${response.question_id}, ${response.answer_value}, ${response.answer_type}, ${response.created_at})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log(`Imported ${responses.length} survey responses`);

  // Import relationships
  console.log('Importing relationships...');
  const relationships = sqliteDb.prepare('SELECT * FROM relationships').all();
  
  for (const rel of relationships) {
    await sql`
      INSERT INTO relationships (id, source_id, target_id, relationship_type, strength, direction, source_confidence, created_at, validated)
      VALUES (${rel.id}, ${rel.source_id}, ${rel.target_id}, ${rel.relationship_type}, ${rel.strength}, ${rel.direction}, ${rel.source_confidence}, ${rel.created_at}, ${rel.validated})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log(`Imported ${relationships.length} relationships`);

  // Import inferred properties
  console.log('Importing inferred properties...');
  const inferredProps = sqliteDb.prepare('SELECT * FROM inferred_properties').all();
  
  for (const prop of inferredProps) {
    await sql`
      INSERT INTO inferred_properties (id, member_id, property_type, property_value, confidence, source_questions, created_at)
      VALUES (${prop.id}, ${prop.member_id}, ${prop.property_type}, ${prop.property_value}, ${prop.confidence}, ${prop.source_questions}, ${prop.created_at})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log(`Imported ${inferredProps.length} inferred properties`);

  // Import tribe signals
  console.log('Importing tribe signals...');
  const signals = sqliteDb.prepare('SELECT * FROM tribe_signals').all();
  
  for (const signal of signals) {
    await sql`
      INSERT INTO tribe_signals (id, signal_type, signal_value, source_members, confidence, created_at)
      VALUES (${signal.id}, ${signal.signal_type}, ${signal.signal_value}, ${signal.source_members}, ${signal.confidence}, ${signal.created_at})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log(`Imported ${signals.length} tribe signals`);

  sqliteDb.close();
  console.log('Import complete!');
}

importData().catch(console.error);
