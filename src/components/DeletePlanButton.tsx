"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeletePlanButton({ planId }: { planId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this plan? This cannot be undone.")) return;
    setLoading(true);
    await fetch(`/api/plans/${planId}`, { method: "DELETE" });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-600 hover:underline disabled:opacity-60"
    >
      {loading ? "Deleting..." : "Delete plan"}
    </button>
  );
}
