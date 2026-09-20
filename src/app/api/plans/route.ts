import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractTextFromUpload, parseResumeText } from "@/lib/resumeParser";
import { getRoleById } from "@/lib/roleCatalog";
import { computeMissingSkills, generateRoadmap } from "@/lib/roadmapGenerator";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const plans = await prisma.plan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { milestones: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ plans });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  try {
    const formData = await req.formData();
    const targetRoleId = String(formData.get("targetRoleId") || "");
    const targetDateRaw = String(formData.get("targetDate") || "");
    const resumeFile = formData.get("resumeFile") as File | null;
    const resumeTextInput = formData.get("resumeText") as string | null;

    const role = getRoleById(targetRoleId);
    if (!role) {
      return NextResponse.json({ error: "Please select a valid target role." }, { status: 400 });
    }

    const targetDate = new Date(targetDateRaw);
    const startDate = new Date();
    if (Number.isNaN(targetDate.getTime()) || targetDate <= startDate) {
      return NextResponse.json({ error: "Target date must be a valid date in the future." }, { status: 400 });
    }

    let rawText = "";
    if (resumeFile && resumeFile.size > 0) {
      if (resumeFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "Resume file must be under 5MB." }, { status: 400 });
      }
      rawText = await extractTextFromUpload(resumeFile);
    } else if (resumeTextInput && resumeTextInput.trim().length > 0) {
      rawText = resumeTextInput;
    } else {
      return NextResponse.json({ error: "Please upload a resume file or paste your resume text." }, { status: 400 });
    }

    if (rawText.trim().length < 30) {
      return NextResponse.json(
        { error: "We couldn't read enough text from your resume. Try pasting it as plain text instead." },
        { status: 400 }
      );
    }

    const parsed = parseResumeText(rawText);
    const missingSkills = computeMissingSkills(role, parsed.detectedSkills);
    const matchedSkills = role.requiredSkills.filter((s) => parsed.detectedSkills.includes(s));

    const milestones = generateRoadmap({
      role,
      missingSkills,
      matchedSkills,
      startDate,
      targetDate,
    });

    const plan = await prisma.plan.create({
      data: {
        userId,
        title: `${role.title} switch plan`,
        targetRoleId: role.id,
        targetRoleTitle: role.title,
        experienceLevel: parsed.experienceLevel,
        startDate,
        targetDate,
        resumeText: parsed.text.slice(0, 20000),
        detectedSkills: JSON.stringify(parsed.detectedSkills),
        missingSkills: JSON.stringify(missingSkills),
        currentTitle: parsed.currentTitle,
        yearsOfExperience: parsed.yearsOfExperience,
        milestones: {
          create: milestones.map((m) => ({
            phase: m.phase,
            title: m.title,
            description: m.description,
            skills: JSON.stringify(m.skills),
            startDate: m.startDate,
            endDate: m.endDate,
            order: m.order,
          })),
        },
      },
      include: { milestones: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (err) {
    console.error("Create plan error", err);
    return NextResponse.json({ error: "Something went wrong while generating your plan." }, { status: 500 });
  }
}
