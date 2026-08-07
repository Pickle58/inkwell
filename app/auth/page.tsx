import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export default function AuthPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <Link
        href="/"
        className="mb-8 font-[family-name:var(--font-fraunces)] text-2xl tracking-tight"
      >
        Inkwell
      </Link>
      <AuthForm />
    </main>
  );
}
