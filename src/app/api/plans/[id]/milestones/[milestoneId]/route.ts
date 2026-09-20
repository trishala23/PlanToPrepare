import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; milestoneId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const plan = await prisma.plan.findFirst({ where: { id: params.id, userId } });
  if (!plan) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }

  const milestone = await prisma.milestone.findFirst({
    where: { id: params.milestoneId, planId: plan.id },
  });
  if (!milestone) {
    return NextResponse.json({ error: "Milestone not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const completed = typeof body.completed === "boolean" ? body.completed : !milestone.completed;

  const updated = await prisma.milestone.update({
    where: { id: milestone.id },
    data: { completed },
  });

  return NextResponse.json({ milestone: updated });
}
