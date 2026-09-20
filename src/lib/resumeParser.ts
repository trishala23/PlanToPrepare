import { SKILL_KEYWORDS } from "@/lib/skills";

export type ExperienceLevel = "entry" | "mid" | "senior";

export interface ParsedResume {
  text: string;
  detectedSkills: string[];
  yearsOfExperience: number;
  experienceLevel: ExperienceLevel;
  currentTitle: string | null;
}

function escapeForRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function detectSkills(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();

  for (const [skill, aliases] of Object.entries(SKILL_KEYWORDS)) {
    for (const alias of aliases) {
      // Aliases may already contain regex escapes (e.g. "c\\+\\+"); use as-is.
      // Allow an optional trailing "s" so simple plurals (e.g. "REST APIs",
      // "pivot tables") still match a singular alias.
      const pattern = new RegExp(`(?<![a-z0-9])${alias}s?(?![a-z0-9])`, "i");
      if (pattern.test(lower)) {
        found.add(skill);
        break;
      }
    }
  }

  return Array.from(found);
}

const EXPLICIT_YEARS_PATTERNS = [
  /(\d+(?:\.\d+)?)\+?\s*(?:years|yrs)\s*(?:of)?\s*(?:professional\s*)?experience/i,
  /experience\s*[:\-]?\s*(\d+(?:\.\d+)?)\+?\s*(?:years|yrs)/i,
];

export function detectYearsOfExperience(text: string): number {
  for (const pattern of EXPLICIT_YEARS_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const years = parseFloat(match[1]);
      if (!Number.isNaN(years) && years >= 0 && years <= 50) {
        return Math.round(years * 10) / 10;
      }
    }
  }

  // Fallback: look at year ranges like "2019 - 2023" or "2019 - Present" and
  // approximate total experience from the earliest to the latest year mentioned.
  const now = new Date().getFullYear();
  const yearMatches = Array.from(text.matchAll(/\b(19|20)\d{2}\b/g)).map((m) => parseInt(m[0], 10));
  const presentMentioned = /present|current(?:ly)?/i.test(text);

  const validYears = yearMatches.filter((y) => y >= 1980 && y <= now);
  if (validYears.length === 0) return 0;

  const earliest = Math.min(...validYears);
  const latest = presentMentioned ? now : Math.max(...validYears);
  const span = latest - earliest;

  if (span <= 0) return 0;
  // Cap to a sane range; resumes rarely list more than ~40 years.
  return Math.min(span, 40);
}

export function classifyExperienceLevel(years: number): ExperienceLevel {
  if (years < 2) return "entry";
  if (years < 6) return "mid";
  return "senior";
}

const TITLE_KEYWORDS = [
  "engineer",
  "developer",
  "manager",
  "analyst",
  "designer",
  "scientist",
  "consultant",
  "architect",
  "specialist",
  "administrator",
  "lead",
  "director",
  "intern",
  "associate",
  "coordinator",
];

export function detectCurrentTitle(text: string): string | null {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 40); // titles usually appear near the top or right after "Experience"

  for (const line of lines) {
    if (line.length > 80) continue;
    const lower = line.toLowerCase();
    if (TITLE_KEYWORDS.some((kw) => lower.includes(kw))) {
      // Strip common trailing separators like " | Company | Dates"
      const cleaned = line.split(/[|,–—-]/)[0].trim();
      if (cleaned.length > 2 && cleaned.length < 60) {
        return cleaned;
      }
    }
  }
  return null;
}

export function parseResumeText(text: string): ParsedResume {
  const cleaned = text.replace(/\r/g, "").trim();
  const detectedSkills = detectSkills(cleaned);
  const yearsOfExperience = detectYearsOfExperience(cleaned);
  const experienceLevel = classifyExperienceLevel(yearsOfExperience);
  const currentTitle = detectCurrentTitle(cleaned);

  return {
    text: cleaned,
    detectedSkills,
    yearsOfExperience,
    experienceLevel,
    currentTitle,
  };
}

export async function extractTextFromUpload(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (isPdf) {
    // Lazy import so the (fairly heavy) pdf-parse module only loads when needed.
    const pdfParse = (await import("pdf-parse")).default;
    const result = await pdfParse(buffer);
    return result.text;
  }

  return buffer.toString("utf-8");
}
