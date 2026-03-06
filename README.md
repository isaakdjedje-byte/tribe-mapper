# TribeMapper

A tribe mapping system for understanding community dynamics, relationships, and structure.

## Features

- **Survey System**: Two-layer survey system (Foundation + Deepening)
- **Network Analysis**: Automatic detection of bridges, isolates, clusters, and bottlenecks
- **Privacy-Focused**: Consent-based, no dark patterns, transparent data handling
- **Admin Dashboard**: Real-time insights into tribe health and dynamics

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Database**: PostgreSQL (via Neon serverless)
- **Deployment**: Vercel

## Setup

### 1. Prerequisites

- Node.js 18+
- A Neon database (free tier works)

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Database

Create a `.env.local` file in the project root:

```bash
# Get your connection string from Neon dashboard
# https://console.neon.tech
DATABASE_URL=postgresql://username:password@host.neon.tech/dbname?sslmode=require
```

### 4. Initialize Database

The database tables are created automatically on first API call. To manually initialize:

```bash
npm run db:init
```

Or run the schema in Neon console:
```bash
psql $DATABASE_URL -f schema.sql
```

### 5. Run Locally

```bash
npm run dev
```

Visit http://localhost:3000

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel environment
3. Add variable in Vercel project settings:
   - `DATABASE_URL` = your Neon pooled connection string
4. Deploy

## Usage

1. Visit `/admin` to access the dashboard
2. Generate survey links in the Settings tab
3. Share links with tribe members
4. Monitor responses in the Overview tab
5. Review network analysis in the Analytics tab

## Project Structure

```
├── app/
│   ├── api/survey/route.ts   # All API endpoints
│   ├── admin/page.tsx        # Admin dashboard
│   ├── survey/[token]/        # Survey 1 pages
│   └── survey2/[token]/      # Survey 2 pages
├── lib/
│   ├── db.ts                 # Database layer (Postgres/Neon)
│   ├── analytics/engine.ts   # Network analysis algorithms
│   └── survey/questions.ts   # Question definitions
├── schema.sql                # Postgres schema
├── scripts/import-sqlite.js  # SQLite to Postgres import
└── .env.example              # Environment template
```

## Importing Existing Data

If you have data from a SQLite database and want to migrate to Postgres:

```bash
# Set both environment variables
export DATABASE_URL="postgresql://..."  # Neon connection
export SQLITE_DB_PATH="./tribemapper.db"

# Run import script
node scripts/import-sqlite.js
```

## License

MIT
