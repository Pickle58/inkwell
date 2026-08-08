export const POLAR_MONTHLY_PRICE_LABEL = "$19/mo";

/** Sandbox checkout-link redirect URL (preferred for local testing). */
export const DEFAULT_SANDBOX_CHECKOUT_LINK =
  "https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_NUp71gmInplx2XKIXQItYqLuWh41XFwxgor4M0JIM5P/redirect";

function getPolarCheckoutLink(): string {
  const link =
    process.env.NEXT_PUBLIC_POLAR_CHECKOUT_LINK?.trim() ||
    DEFAULT_SANDBOX_CHECKOUT_LINK;
  return link;
}

export function buildPolarCheckoutUrl(email: string): string {
  const url = new URL(getPolarCheckoutLink());
  const trimmed = email.trim().toLowerCase();
  if (trimmed) {
    url.searchParams.set("customer_email", trimmed);
  }
  // Ensure embed params survive the sandbox-api redirect into the checkout page.
  url.searchParams.set("embed", "true");
  return url.toString();
}

export const TRIAL_BENEFITS = [
  "Write with AI that uses your own knowledge and references",
  "Keep every document organized in one calm workspace",
  "Attach research and notes so drafts stay grounded",
  "Chat through edits without leaving the page",
] as const;
