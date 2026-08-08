"use client";

import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";
import { useConvexAuth, useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import {
  POLAR_MONTHLY_PRICE_LABEL,
  TRIAL_BENEFITS,
  buildPolarCheckoutUrl,
} from "@/lib/polar";

type CheckoutInstance = Awaited<ReturnType<typeof PolarEmbedCheckout.create>>;

export function SubscriptionGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const subscribed = useQuery(
    api.billing.isSubscribed,
    isAuthenticated ? {} : "skip",
  );
  const viewer = useQuery(api.users.viewer, isAuthenticated ? {} : "skip");
  const [openingCheckout, setOpeningCheckout] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyTimedOut, setVerifyTimedOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const checkoutRef = useRef<CheckoutInstance | null>(null);

  useEffect(() => {
    return () => {
      checkoutRef.current?.close();
      checkoutRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!subscribed) {
      return;
    }
    checkoutRef.current?.close();
    checkoutRef.current = null;
  }, [subscribed]);

  useEffect(() => {
    if (!verifying || subscribed) {
      return;
    }
    const timer = window.setTimeout(() => {
      setVerifyTimedOut(true);
    }, 20000);
    return () => window.clearTimeout(timer);
  }, [verifying, subscribed]);

  const showVerifying = verifying && !subscribed;

  const openCheckout = async () => {
    if (openingCheckout || !viewer?.email) {
      return;
    }

    setCheckoutError(null);
    setOpeningCheckout(true);

    try {
      const checkout = await PolarEmbedCheckout.create(
        buildPolarCheckoutUrl(viewer.email),
        { theme: "light" },
      );
      checkoutRef.current = checkout;

      checkout.addEventListener("success", (event) => {
        event.preventDefault();
        setVerifying(true);
        checkout.close();
        checkoutRef.current = null;
      });

      checkout.addEventListener("close", () => {
        checkoutRef.current = null;
        setOpeningCheckout(false);
      });
    } catch (error) {
      console.error("Failed to open Polar checkout", error);
      setCheckoutError(
        "Could not open checkout. Confirm this site is listed under Polar Embedding hosts.",
      );
      setOpeningCheckout(false);
    }
  };

  if (authLoading || (isAuthenticated && subscribed === undefined)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink-muted">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated || subscribed) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen paper-texture">
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(28,36,48,0.45)] px-4 py-8 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="trial-title"
      >
        <div className="soft-panel animate-fade-rise w-full max-w-lg space-y-6 p-8 shadow-[var(--shadow-lift)]">
          <div className="space-y-2 text-center">
            <p className="font-[family-name:var(--font-fraunces)] text-sm tracking-wide text-ink-muted">
              Inkwell
            </p>
            <h2
              id="trial-title"
              className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight"
            >
              Start your free trial
            </h2>
            <p className="text-ink-muted">
              Unlock Inkwell for {POLAR_MONTHLY_PRICE_LABEL} after your trial.
              Keep writing with AI that knows your notes.
            </p>
          </div>

          <ul className="space-y-3 text-left">
            {TRIAL_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex gap-3 text-sm leading-relaxed">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-xl bg-accent-soft px-4 py-3 text-center text-sm text-accent">
            {POLAR_MONTHLY_PRICE_LABEL} · Cancel anytime during the trial
          </div>

          {showVerifying ? (
            <p className="text-center text-sm text-ink-muted">
              {verifyTimedOut
                ? "Still confirming. Use the same email as your Inkwell account at checkout, then wait a moment."
                : "Purchase received. Confirming your subscription…"}
            </p>
          ) : null}

          {checkoutError ? (
            <p className="rounded-xl bg-accent-soft px-3 py-2 text-sm text-accent">
              {checkoutError}
            </p>
          ) : null}

          <button
            type="button"
            disabled={openingCheckout || showVerifying || !viewer?.email}
            onClick={() => {
              void openCheckout();
            }}
            className="w-full rounded-xl bg-accent px-4 py-3 text-paper-elevated shadow-[var(--shadow-soft)] transition hover:opacity-95 disabled:opacity-60"
          >
            {showVerifying
              ? "Verifying…"
              : openingCheckout
                ? "Opening checkout…"
                : "Start free trial"}
          </button>
        </div>
      </div>
    </div>
  );
}
