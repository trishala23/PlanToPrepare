import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as { id: string }).id;
  const plans = await prisma.plan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { milestones: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Your plans</h1>
        <Link
          href="/plans/new"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          + New plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-600">
            You don&apos;t have any career-switch plans yet.
          </p>
          <Link
            href="/plans/new"
            className="mt-4 inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Create your first plan
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => {
            const completed = plan.milestones.filter((m) => m.completed).length;
            const total = plan.milestones.length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <Link
                key={plan.id}
                href={`/plans/${plan.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand-300 hover:shadow"
              >
                <h2 className="font-semibold text-slate-900">{plan.title}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Target date: {formatDate(plan.targetDate)}
                </p>
                <div className="mt-3">
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-brand-600"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {completed} / {total} milestones complete
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
