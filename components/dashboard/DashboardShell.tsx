"use client";

import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { CreateDocumentButton } from "./CreateDocumentButton";
import { DocumentList } from "./DocumentList";
import { SignOutButton } from "./SignOutButton";

export function DashboardShell() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-10 text-ink-muted md:px-10">
        Loading…
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10 md:px-10">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight"
          >
            Inkwell
          </Link>
          <p className="mt-2 text-ink-muted">Your documents</p>
        </div>
        <div className="flex items-center gap-4">
          <SignOutButton />
          <CreateDocumentButton className="rounded-xl bg-accent px-5 py-3 text-paper-elevated shadow-[var(--shadow-soft)]" />
        </div>
      </header>
      <DocumentList />
    </main>
  );
}
