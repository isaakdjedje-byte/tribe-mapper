# TRIBE MAPPING SYSTEM — SPECIFICATION

## PROJECT OVERVIEW

**Project Name:** TribeMapper
**Type:** Full-stack survey and network analysis system
**Core Functionality:** Three-layer system to map tribe members, relationships, roles, trust, influence, and structure
**Target Users:** Tribe leaders, community organizers, researchers, team builders

---

## 1. SYSTEM ARCHITECTURE

### 1.1 Technology Stack
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** CSS Modules with CSS Variables
- **Database:** SQLite with better-sqlite3 (portable, no external DB needed)
- **State Management:** React Context + useReducer
- **Network Analysis:** Custom algorithms (no heavy dependencies)
- **Deployment:** Vercel-ready, single-command deploy

### 1.2 Layer Structure
```
┌─────────────────────────────────────────────┐
│           RESPONDENT LAYER                  │
│  (Survey 1 → Survey 2 → Interview)         │
├─────────────────────────────────────────────┤
│            API LAYER                        │
│  (Survey endpoints, Analytics, Export)     │
├─────────────────────────────────────────────┤
│           DATA LAYER                        │
│  (SQLite DB, Schema, Migrations)           │
├─────────────────────────────────────────────┤
│         ANALYTICS ENGINE                    │
│  (Network analysis, Scoring, Mapping)     │
└─────────────────────────────────────────────┘
```

---

## 2. DATA MODEL

### 2.1 Tables

#### members
| Field | Type | Description |
|-------|------|-------------|
| id | TEXT PRIMARY KEY | UUID |
| anonymous_id | TEXT | Internal tracking ID |
| display_name | TEXT | Optional display name |
| email | TEXT | Contact (optional) |
| created_at | DATETIME | Timestamp |
| status | TEXT | pending/active/completed/exited |
| survey_stage | TEXT | none/survey1/survey2/interview |
| consent_data | INTEGER | 0/1 for data collection consent |
| consent_followup | INTEGER | 0/1 for follow-up contact |
| metadata | JSON | Extra fields |

#### survey_responses
| Field | Type | Description |
|-------|------|-------------|
| id | TEXT PRIMARY KEY | UUID |
| member_id | TEXT FK | Reference to member |
| survey_type | TEXT | survey1/survey2 |
| question_id | TEXT | Question identifier |
| answer_value | TEXT | JSON-encoded answer |
| answer_type | TEXT | single/multi/text/numeric |
| created_at | DATETIME | Timestamp |

#### relationships
| Field | Type | Description |
|-------|------|-------------|
| id | TEXT PRIMARY KEY | UUID |
| source_id | TEXT FK | Member ID |
| target_id | TEXT FK | Member ID |
| relationship_type | TEXT | trust/collaboration/influence/conflict |
| strength | INTEGER | 1-5 scale |
| direction | TEXT | uni/bidirectional |
| source_confidence | INTEGER | 1-5 confidence from source |
| created_at | DATETIME | Timestamp |
| validated | INTEGER | 0/1 cross-validation status |

#### inferred_properties
| Field | Type | Description |
|-------|------|-------------|
| id | TEXT PRIMARY KEY | UUID |
| member_id | TEXT FK | Reference to member |
| property_type | TEXT | role/centrality/bridge/isolate/cluster |
| property_value | TEXT | JSON value |
| confidence | REAL | 0-1 confidence score |
| source_questions | TEXT | JSON array of source question IDs |
| created_at | DATETIME | Timestamp |

#### tribe_signals
| Field | Type | Description |
|-------|------|-------------|
| id | TEXT PRIMARY KEY | UUID |
| signal_type | TEXT | values/tension/language/culture |
| signal_value | TEXT | JSON signal data |
| source_members | TEXT | JSON array of member IDs |
| confidence | REAL | 0-1 |
| created_at | DATETIME | Timestamp |

---

## 3. SURVEY 1: FOUNDATION MAPPING

### 3.1 Design Principles
- Mobile-first, single-column layout
- 12-18 questions maximum
- Average completion: 8-12 minutes
- No matrix questions
- Limited open text (max 3 fields)
- Behavioral and scenario-based inference questions
- Relationship nomination (not rating)

### 3.2 Question Structure

#### SECTION A: IDENTITY (3 questions)
1. **Name/Alias** — Text input (optional)
2. **Role self-description** — "How would you describe your role in [tribe name]?" — Open text, short
3. **Duration** — "How long have you been part of this group?" — Dropdown: <3mo, 3-12mo, 1-2yr, 2-5yr, 5+yr

#### SECTION B: RELATIONSHIPS (4 questions)
4. **Trust nominations** — "Who in the group do you trust most? List up to 5 names." — Text input with autocomplete from known members
5. **Collaboration** — "Who do you work with most closely?" — Multi-select with autocomplete
6. **Influence** — "Whose opinions typically sway decisions?" — Multi-select
7. **Conflicts** — "Who do you sometimes disagree with or find difficult?" — Multi-select (optional, private)

#### SECTION C: BEHAVIORAL INFERENCE (4 questions)
8. **Decision pattern** — Scenario: "A major decision needs to be made. What typically happens?" — Single choice among 4 behavioral descriptions
9. **Conflict resolution** — Scenario: "A disagreement emerges. What do you usually do?" — Single choice among 4 options
10. **Initiative** — Scenario: "Someone has an idea for a new project. What usually occurs?" — Single choice
11. **Information flow** — Scenario: "Important news travels through the group. How?" — Single choice

#### SECTION D: VALUES & LANGUAGE (4 questions)
12. **What matters most** — "Pick 3 from this list" — Multi-select values cards
13. **Tribe language** — "What words or phrases would a outsider not understand?" — Open text, short
14. **Shared experiences** — "What moments define this group?" — Open text, short
15. **Future vision** — "What should we be working toward?" — Open text, short

#### SECTION E: PERCEPTION (2 questions)
16. **Group health** — "How would you describe the group's current state?" — 5-point scale with descriptive labels
17. **Your role perception** — "How do you see your influence?" — Self-positioning slider

### 3.3 Hidden Internal Scoring
Each question maps to internal signals:
- Q4 (trust) → trust_edges + centrality_in
- Q5 (collaboration) → collaboration_edges + cluster
- Q6 (influence) → influence_edges + centrality
- Q7 (conflict) → conflict_edges + potential bridges
- Q8-11 → culture_stage + decision_pattern + conflict_style
- Q12 → values_signals + values_alignment
- Q13 → language_signals + tribe_cohesion
- Q16 → group_health_score
- Q17 → self_perceived_centrality

---

## 4. SURVEY 2: TARGETED DEEPENING

### 4.1 Trigger Criteria (Automatic)
Survey 2 is triggered when:
1. Member identified as high-centrality but low trust → investigate bridging
2. Discrepancy between self-perception and others' perception of role
3. Member nominated by many but didn't nominate others (possible isolate)
4. Trust asymmetry: A trusts B but B doesn't trust A (unilateral)
5. Values conflict detected from Q12 vs group norms
6. Missing data: No relationship nominations from this member
7. Cluster boundary: Member sits between clusters but no cross-cluster ties

### 4.2 Segmentation Rules
- **Bridge investigation:** Questions about connections to other subgroups
- **Role clarification:** Questions testing role hypothesis
- **Values deep-dive:** Scenarios revealing true values vs stated
- **Gap filling:** Missing relationship data

### 4.3 Question Bank (15 questions max)
Each targeted question has:
- Trigger condition
- Purpose (what hypothesis it tests)
- Answer format

---

## 5. INTERVIEW FALLBACK

### 5.1 Decision Criteria
- Survey 2 response rate < 50%
- Critical nodes (centrality > 0.8) with incomplete data
- Contradictory signals that surveys can't resolve
- Members who declined Survey 2 but are high-priority

### 5.2 Interview Guide (20 minutes)
1. Role clarification (5 min)
2. Relationship depth (5 min)
3. Values and vision (5 min)
4. Group dynamics observation (5 min)

### 5.3 AI Reflection Option
- Optional async reflection via secure form
- No third-party AI processing of raw data
- Summary only with member consent

---

## 6. ANALYTICS ENGINE

### 6.1 Network Metrics
- **Centrality:** Degree, betweenness, eigenvector
- **Clustering:** Louvain algorithm for community detection
- **Bridges:** Members connecting otherwise disconnected groups
- **Isolates:** Members with minimal connections
- **Triads:** Closed triangles, open triads
- **Density:** Overall network connectivity

### 6.2 Output Reports
- Tribe roster with roles
- Role map (visual)
- Relationship graph (JSON + visualization data)
- Trust map
- Collaboration map
- Influence map
- Isolates list
- Bridges list
- Bottlenecks (potential)
- Clusters/sub-tribes
- Missing links (predicted)
- Values alignment matrix
- Tension hotspots
- Survey 2 recommendation (Y/N + priority list)
- Interview shortlist

---

## 7. ADMIN WORKFLOW

### 7.1 Dashboard Features
- Launch Survey 1 (generate link)
- Track responses in real-time
- View completion rates
- Trigger Survey 2 for segments
- Export data (CSV, JSON)
- Run analytics
- View reports

### 7.2 Recontact Logic
- Automated reminder after 3 days
- Manual follow-up flag
- Survey 2 trigger by segment

---

## 8. PRIVACY & CONSENT

### 8.1 Consent Language (Survey 1 intro)
"Your responses are confidential. We use this information to understand group dynamics better. You can skip any question or withdraw at any time. Data is stored securely and won't be shared with other members."

### 8.2 Data Handling
- No individual responses shown to other members
- Aggregated insights only
- Member can request their data deletion
- Export includes only anonymized or consented data

---

## 9. DEPLOYMENT

### 9.1 Build Commands
```bash
npm run build
npm start
```

### 9.2 Environment
- Node.js 18+
- No external database required (SQLite)
- Single-page app, no complex routing

---

## 10. FILE STRUCTURE

```
/app
  /api
    /survey
      /submit
      /status
    /analytics
      /run
      /export
    /admin
      /launch
      /recontact
  /survey
    /[token]
      page.tsx
    /complete
      page.tsx
  /admin
    /dashboard
    /reports
    /settings
  layout.tsx
  page.tsx
/components
  /survey
    QuestionCard.tsx
    ProgressBar.tsx
    Navigation.tsx
  /admin
    StatsCard.tsx
    NetworkGraph.tsx
    DataTable.tsx
/lib
  /db
    schema.ts
    queries.ts
  /analytics
    metrics.ts
    scoring.ts
    graph.ts
  /survey
    questions.ts
    routing.ts
    validation.ts
/styles
  globals.css
  variables.css
/public
  /images
/data
  seed.ts
```
