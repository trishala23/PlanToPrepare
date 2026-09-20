# PlanToPrepare

Turn your resume into a personalized career-switch roadmap. Upload your resume,
pick the role you want to switch into and a target date, and get:

- A dated, phased roadmap that closes the gap between your current skills and
  the target role's requirements
- Progress tracking (mark milestones as done)
- Interview questions (behavioral, technical, and skill-based) tailored to
  your target role and detected experience level

Resume parsing, skill-gap analysis, and question selection are all rule-based
(keyword/heuristic matching) — no external AI API is required.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Prisma + PostgreSQL for persistence
- NextAuth (credentials provider) for accounts

## Getting started

Requires a PostgreSQL database (local or hosted — e.g. a free instance on
Neon, Supabase, or Vercel Postgres).

```bash
npm install
cp .env.example .env   # then set DATABASE_URL and a real NEXTAUTH_SECRET
npx prisma migrate deploy
npm run dev
```

Open http://localhost:3000.

## Deploying to Vercel

1. Create a Postgres database (Vercel's Storage tab → Postgres, or an
   external provider like Neon/Supabase) and copy its connection string.
2. In the Vercel dashboard, "Add New" → "Project" → import this GitHub repo.
3. Before the first deploy, set these Environment Variables (Production and
   Preview):
   - `DATABASE_URL` — the Postgres connection string from step 1
   - `NEXTAUTH_SECRET` — a random secret (e.g. `openssl rand -hex 32`)
   - `NEXTAUTH_URL` — your deployed URL, e.g. `https://your-project.vercel.app`
     (you'll need to add/update this after the first deploy once you know the
     assigned domain, then redeploy)
4. Deploy. The build command (`prisma generate && prisma migrate deploy &&
   next build`) applies pending database migrations automatically on every
   deploy, so no manual migration step is needed after the first setup.

## Project layout

- `src/lib/resumeParser.ts` — extracts text (PDF or plain text), detects
  skills, years of experience, and current title from a resume
- `src/lib/roleCatalog.ts` — target roles and their required skills
- `src/lib/roadmapGenerator.ts` — builds a phased, dated roadmap from the
  skill gap and target date
- `src/lib/interviewQuestions.ts` — behavioral/technical question bank by
  role and experience level
- `src/app/plans/new` — create-a-plan form (resume upload/paste, role, date)
- `src/app/plans/[id]` — roadmap timeline + interview questions for a plan
