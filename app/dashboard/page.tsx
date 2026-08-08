import { AccountMenu } from "@/components/account/AccountMenu";
import { AppShell } from "@/components/billing/AppShell";
import { CreateDocumentButton } from "@/components/dashboard/CreateDocumentButton";
import { DocumentList } from "@/components/dashboard/DocumentList";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <AppShell>
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
            <CreateDocumentButton className="rounded-xl bg-accent px-5 py-3 text-paper-elevated shadow-[var(--shadow-soft)]" />
            <AccountMenu />
          </div>
        </header>
        <DocumentList />
      </main>
    </AppShell>
  );
}
