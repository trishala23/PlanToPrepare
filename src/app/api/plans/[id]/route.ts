import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const plan = await prisma.plan.findFirst({
    where: { id: params.id, userId },
    include: { milestones: { orderBy: { order: "asc" } } },
  });

  if (!plan) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }

  return NextResponse.json({ plan });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const plan = await prisma.plan.findFirst({ where: { id: params.id, userId } });
  if (!plan) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }

  await prisma.plan.delete({ where: { id: plan.id } });
  return NextResponse.json({ success: true });
}
