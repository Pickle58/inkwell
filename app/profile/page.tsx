import { AccountMenu } from "@/components/account/AccountMenu";
import { ProfileForm } from "@/components/account/ProfileForm";
import { AppShell } from "@/components/billing/AppShell";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <AppShell>
      <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10 md:px-10">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight"
            >
              Inkwell
            </Link>
            <p className="mt-2 text-ink-muted">Account settings</p>
          </div>
          <AccountMenu />
        </header>
        <ProfileForm />
      </main>
    </AppShell>
  );
}
