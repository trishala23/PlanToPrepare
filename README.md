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
- Prisma + SQLite for persistence
- NextAuth (credentials provider) for accounts

## Getting started

```bash
npm install
cp .env.example .env   # then set a real NEXTAUTH_SECRET
npx prisma migrate dev
npm run dev
```

Open http://localhost:3000.

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
