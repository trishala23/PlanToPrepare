"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  planId: string;
  id: string;
  phase: string;
  title: string;
  description: string;
  skills: string[];
  startDate: string;
  endDate: string;
  completed: boolean;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function MilestoneItem({
  planId,
  id,
  phase,
  title,
  description,
  skills,
  startDate,
  endDate,
  completed,
}: Props) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(completed);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    setSaving(true);
    const next = !isCompleted;
    setIsCompleted(next);
    try {
      await fetch(`/api/plans/${planId}/milestones/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: next }),
      });
      router.refresh();
    } catch {
      setIsCompleted(!next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <li className="relative pl-8">
      <span
        className={`absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
          isCompleted ? "border-brand-600 bg-brand-600" : "border-slate-300 bg-white"
        }`}
      />
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              {phase}
            </span>
            <h3 className={`mt-0.5 font-semibold ${isCompleted ? "text-slate-400 line-through" : "text-slate-900"}`}>
              {title}
            </h3>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-500">
            <input
              type="checkbox"
              checked={isCompleted}
              disabled={saving}
              onChange={toggle}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Done
          </label>
        </div>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">
            {formatDate(startDate)} – {formatDate(endDate)}
          </span>
          {skills.map((s) => (
            <span key={s} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {s}
            </span>
          ))}
        </div>
      </div>
    </li>
  );
}
