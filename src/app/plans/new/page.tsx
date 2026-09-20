"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ROLE_CATALOG } from "@/lib/roleCatalog";

function defaultTargetDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return d.toISOString().slice(0, 10);
}

export default function NewPlanPage() {
  const router = useRouter();
  const { status } = useSession();

  const [targetRoleId, setTargetRoleId] = useState(ROLE_CATALOG[0].id);
  const [targetDate, setTargetDate] = useState(defaultTargetDate());
  const [resumeMode, setResumeMode] = useState<"file" | "paste">("file");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (status === "unauthenticated") {
    router.push("/login");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (resumeMode === "file" && !resumeFile) {
      setError("Please choose a resume file, or switch to pasting your resume text.");
      return;
    }
    if (resumeMode === "paste" && resumeText.trim().length < 30) {
      setError("Please paste more of your resume text (at least a few sentences).");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("targetRoleId", targetRoleId);
    formData.append("targetDate", targetDate);
    if (resumeMode === "file" && resumeFile) {
      formData.append("resumeFile", resumeFile);
    } else {
      formData.append("resumeText", resumeText);
    }

    try {
      const res = await fetch("/api/plans", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      router.push(`/plans/${data.plan.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Create a new plan</h1>
      <p className="mt-1 text-sm text-slate-600">
        Upload your resume, pick the role you want to switch into, and choose your target date.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Target role</label>
          <select
            value={targetRoleId}
            onChange={(e) => setTargetRoleId(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          >
            {ROLE_CATALOG.map((role) => (
              <option key={role.id} value={role.id}>
                {role.title}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            {ROLE_CATALOG.find((r) => r.id === targetRoleId)?.description}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Target date</label>
          <input
            type="date"
            required
            value={targetDate}
            min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
            onChange={(e) => setTargetDate(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-500">
            When do you want to be ready to interview for this role?
          </p>
        </div>

        <div>
          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-slate-700">Resume</label>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setResumeMode("file")}
                className={`rounded-full px-3 py-1 ${
                  resumeMode === "file" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                Upload file
              </button>
              <button
                type="button"
                onClick={() => setResumeMode("paste")}
                className={`rounded-full px-3 py-1 ${
                  resumeMode === "paste" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                Paste text
              </button>
            </div>
          </div>

          {resumeMode === "file" ? (
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
              className="mt-2 w-full text-sm"
            />
          ) : (
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={10}
              placeholder="Paste your resume text here..."
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          )}
          <p className="mt-1 text-xs text-slate-500">PDF or plain text, up to 5MB.</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-brand-600 px-4 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Generating your roadmap..." : "Generate my roadmap"}
        </button>
      </form>
    </div>
  );
}
