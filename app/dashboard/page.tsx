import { CreateDocumentButton } from "@/components/dashboard/CreateDocumentButton";
import { DocumentList } from "@/components/dashboard/DocumentList";
import { SignOutButton } from "@/components/dashboard/SignOutButton";
import Link from "next/link";

export default function DashboardPage() {
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
