import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(47,74,102,0.12),transparent_45%),linear-gradient(to_bottom,rgba(255,252,247,0.2),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55vh] bg-[linear-gradient(to_top,rgba(28,36,48,0.06),transparent)]"
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <p className="animate-fade-rise font-[family-name:var(--font-fraunces)] text-xl tracking-tight text-ink">
          Inkwell
        </p>
        <Link
          href="/auth"
          className="rounded-full border border-rule bg-paper-elevated/80 px-4 py-2 text-sm text-ink-muted shadow-[var(--shadow-soft)] transition hover:text-ink"
        >
          Sign in
        </Link>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-start justify-center px-6 pb-24 pt-10 md:px-12">
        <h1 className="animate-fade-rise max-w-3xl font-[family-name:var(--font-fraunces)] text-6xl leading-[0.95] tracking-tight text-ink md:text-8xl">
          Inkwell
        </h1>
        <p className="animate-fade-rise-delay mt-6 max-w-xl text-xl leading-relaxed text-ink-muted md:text-2xl">
          Keep your references close and write with AI that knows what you know.
        </p>
        <div className="animate-fade-rise-delay-2 mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/auth"
            className="rounded-2xl bg-accent px-6 py-3.5 text-lg text-paper-elevated shadow-[var(--shadow-lift)] transition hover:-translate-y-0.5 hover:opacity-95"
          >
            Start writing
          </Link>
        </div>
      </section>
    </main>
  );
}
