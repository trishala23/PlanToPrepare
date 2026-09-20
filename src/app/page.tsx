import Link from "next/link";
import { ROLE_CATALOG } from "@/lib/roleCatalog";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Turn your resume into a career-switch roadmap
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Upload your resume, pick the role you want to switch into, and choose your target date.
          We&apos;ll build a personalized, week-by-week plan to close your skill gaps — plus
          interview questions tailored to your experience level.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-md bg-brand-600 px-6 py-3 font-medium text-white shadow hover:bg-brand-700"
          >
            Create your plan
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
          >
            Log in
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        <FeatureCard
          title="1. Upload your resume"
          body="Upload a PDF or paste your resume text. We extract your skills, experience level, and current title."
        />
        <FeatureCard
          title="2. Pick your target role & date"
          body="Choose from roles like Software Engineer, Data Scientist, Product Manager, and more, and set when you want to be ready."
        />
        <FeatureCard
          title="3. Get your roadmap"
          body="Receive a phased, dated timeline that closes your skill gaps, plus interview questions matched to your level."
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Roles you can plan a switch into</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {ROLE_CATALOG.map((role) => (
            <span
              key={role.id}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600"
            >
              {role.title}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{body}</p>
    </div>
  );
}
