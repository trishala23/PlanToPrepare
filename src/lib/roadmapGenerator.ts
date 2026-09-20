import { RoleDefinition } from "@/lib/roleCatalog";

export interface MilestoneInput {
  phase: string;
  title: string;
  description: string;
  skills: string[];
  startDate: Date;
  endDate: Date;
  order: number;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function chunk<T>(items: T[], size: number): T[][] {
  if (items.length === 0) return [];
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

export function computeMissingSkills(role: RoleDefinition, detectedSkills: string[]): string[] {
  const have = new Set(detectedSkills);
  return role.requiredSkills.filter((s) => !have.has(s));
}

/**
 * Builds a phased, dated roadmap between startDate and targetDate.
 * The last portion of the timeline is always reserved for interview prep;
 * remaining time is split across foundations, core-skill building, and a
 * portfolio/project phase sized by how many skills are missing.
 */
export function generateRoadmap({
  role,
  missingSkills,
  matchedSkills,
  startDate,
  targetDate,
}: {
  role: RoleDefinition;
  missingSkills: string[];
  matchedSkills: string[];
  startDate: Date;
  targetDate: Date;
}): MilestoneInput[] {
  const totalDays = Math.max(
    1,
    Math.round((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  );
  const totalWeeks = Math.max(1, Math.round(totalDays / 7));

  const milestones: MilestoneInput[] = [];
  let cursor = new Date(startDate);
  let order = 0;

  const interviewWeeks = Math.min(3, Math.max(1, Math.round(totalWeeks * 0.15)));
  const interviewDays = interviewWeeks * 7;
  const buildingDays = Math.max(totalDays - interviewDays, totalWeeks <= 2 ? 0 : 7);

  if (missingSkills.length === 0) {
    milestones.push({
      phase: "Skill Refresh",
      title: `Sharpen existing skills for the ${role.title} role`,
      description: `Your resume already covers the core skills for ${role.title}. Use this time to deepen expertise, review fundamentals, and study how ${matchedSkills.slice(0, 4).join(", ") || "your existing skills"} are applied in real ${role.title} work.`,
      skills: matchedSkills.slice(0, 5),
      startDate: new Date(cursor),
      endDate: addDays(cursor, Math.max(buildingDays, 7)),
      order: order++,
    });
    cursor = addDays(cursor, Math.max(buildingDays, 7));
  } else {
    const half = Math.ceil(missingSkills.length / 2);
    const foundationSkills = missingSkills.slice(0, half);
    const coreSkills = missingSkills.slice(half);

    const foundationShare = coreSkills.length > 0 ? 0.4 : 0.6;
    const coreShare = coreSkills.length > 0 ? 0.35 : 0;
    const portfolioShare = 1 - foundationShare - coreShare;

    const foundationDays = Math.max(Math.round(buildingDays * foundationShare), foundationSkills.length > 0 ? 5 : 0);
    const coreDays = Math.max(Math.round(buildingDays * coreShare), coreSkills.length > 0 ? 5 : 0);
    const portfolioDays = Math.max(buildingDays - foundationDays - coreDays, 5);

    if (foundationSkills.length > 0) {
      const skillGroups = chunk(foundationSkills, Math.max(1, Math.ceil(foundationSkills.length / 2)));
      const daysPerGroup = Math.max(3, Math.floor(foundationDays / skillGroups.length));
      for (const group of skillGroups) {
        milestones.push({
          phase: "Foundations",
          title: `Build foundations in ${group.join(", ")}`,
          description: `Learn the fundamentals of ${group.join(", ")} through structured tutorials, official documentation, and small practice exercises. Aim to be comfortable explaining core concepts out loud before moving on.`,
          skills: group,
          startDate: new Date(cursor),
          endDate: addDays(cursor, daysPerGroup),
          order: order++,
        });
        cursor = addDays(cursor, daysPerGroup);
      }
    }

    if (coreSkills.length > 0) {
      const skillGroups = chunk(coreSkills, Math.max(1, Math.ceil(coreSkills.length / 2)));
      const daysPerGroup = Math.max(3, Math.floor(coreDays / skillGroups.length));
      for (const group of skillGroups) {
        milestones.push({
          phase: "Core Skill Building",
          title: `Go deeper: ${group.join(", ")}`,
          description: `Move from tutorials to applied practice with ${group.join(", ")}. Build small hands-on exercises or contribute to an existing project so you can speak to real usage in interviews.`,
          skills: group,
          startDate: new Date(cursor),
          endDate: addDays(cursor, daysPerGroup),
          order: order++,
        });
        cursor = addDays(cursor, daysPerGroup);
      }
    }

    milestones.push({
      phase: "Portfolio & Practice",
      title: `Build a portfolio project for ${role.title}`,
      description: `Design and build one end-to-end project that demonstrates ${role.requiredSkills.slice(0, 4).join(", ")}. Document it clearly (README, demo, write-up) so it can anchor your resume and interview stories.`,
      skills: role.requiredSkills.slice(0, 4),
      startDate: new Date(cursor),
      endDate: addDays(cursor, portfolioDays),
      order: order++,
    });
    cursor = addDays(cursor, portfolioDays);
  }

  // Always end with interview preparation, however long the runway is.
  milestones.push({
    phase: "Interview Preparation",
    title: `Mock interviews & applications for ${role.title}`,
    description: `Tailor your resume to ${role.title}, apply to target companies, and run through technical and behavioral mock interviews. Review common questions for this role and level, and practice explaining your portfolio project.`,
    skills: role.requiredSkills.slice(0, 3),
    startDate: new Date(cursor),
    endDate: new Date(targetDate),
    order: order++,
  });

  return milestones;
}
