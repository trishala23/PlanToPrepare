import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRoleById } from "@/lib/roleCatalog";
import { getInterviewQuestions } from "@/lib/interviewQuestions";
import { ExperienceLevel } from "@/lib/resumeParser";
import { MilestoneItem } from "@/components/MilestoneItem";
import { DeletePlanButton } from "@/components/DeletePlanButton";

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default async function PlanDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }
  const userId = (session.user as { id: string }).id;

  const plan = await prisma.plan.findFirst({
    where: { id: params.id, userId },
    include: { milestones: { orderBy: { order: "asc" } } },
  });

  if (!plan) {
    notFound();
  }

  const role = getRoleById(plan.targetRoleId);
  const detectedSkills: string[] = JSON.parse(plan.detectedSkills);
  const missingSkills: string[] = JSON.parse(plan.missingSkills);
  const matchedSkills = role ? role.requiredSkills.filter((s) => detectedSkills.includes(s)) : detectedSkills;
  const level = plan.experienceLevel as ExperienceLevel;

  const questions = role ? getInterviewQuestions(role.id, level, matchedSkills) : null;

  const completedCount = plan.milestones.filter((m) => m.completed).length;
  const progress = plan.milestones.length > 0 ? Math.round((completedCount / plan.milestones.length) * 100) : 0;

  return (
    <div className="space-y-10">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{plan.title}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {formatDate(plan.startDate)} &rarr; {formatDate(plan.targetDate)}
              {plan.currentTitle ? ` · Currently: ${plan.currentTitle}` : ""} ·{" "}
              {plan.yearsOfExperience > 0
                ? `${plan.yearsOfExperience} yrs experience`
                : "Entry-level experience"}{" "}
              ({level})
            </p>
          </div>
          <DeletePlanButton planId={plan.id} />
        </div>

        <div className="mt-4">
          <div className="h-2.5 w-full rounded-full bg-slate-100">
            <div className="h-2.5 rounded-full bg-brand-600" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {completedCount} / {plan.milestones.length} milestones complete ({progress}%)
          </p>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Skill snapshot</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-700">Skills already on your resume</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((s) => (
                  <span key={s} className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">None detected yet</span>
              )}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-700">Skills to build for {role?.title}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {missingSkills.length > 0 ? (
                missingSkills.map((s) => (
                  <span key={s} className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">You already cover the core skills!</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Your roadmap</h2>
        <ol className="mt-4 space-y-4 border-l-2 border-slate-100">
          {plan.milestones.map((m) => (
            <MilestoneItem
              key={m.id}
              planId={plan.id}
              id={m.id}
              phase={m.phase}
              title={m.title}
              description={m.description}
              skills={JSON.parse(m.skills)}
              startDate={m.startDate.toISOString()}
              endDate={m.endDate.toISOString()}
              completed={m.completed}
            />
          ))}
        </ol>
      </section>

      {questions && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            Interview questions for {role?.title} ({level} level)
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            <QuestionColumn title="Behavioral" questions={questions.behavioral} />
            <QuestionColumn title="Technical" questions={questions.technical} />
            <QuestionColumn title="Based on your skills" questions={questions.skillBased} />
          </div>
        </section>
      )}
    </div>
  );
}

function QuestionColumn({ title, questions }: { title: string; questions: string[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      {questions.length > 0 ? (
        <ul className="mt-2 space-y-2 text-sm text-slate-600">
          {questions.map((q, i) => (
            <li key={i} className="border-b border-slate-50 pb-2 last:border-0 last:pb-0">
              {q}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-slate-400">No questions available yet for this role.</p>
      )}
    </div>
  );
}
