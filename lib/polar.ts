export const POLAR_MONTHLY_PRICE_LABEL = "$19/mo";

function getPolarCheckoutLink(): string {
  const link = process.env.NEXT_PUBLIC_POLAR_CHECKOUT_LINK?.trim();
  if (!link) {
    throw new Error(
      "NEXT_PUBLIC_POLAR_CHECKOUT_LINK is not set. Create a Polar sandbox checkout link and add it to .env.local.",
    );
  }
  return link;
}

export function buildPolarCheckoutUrl(email: string): string {
  const url = new URL(getPolarCheckoutLink());
  const trimmed = email.trim().toLowerCase();
  if (trimmed) {
    url.searchParams.set("customer_email", trimmed);
  }
  return url.toString();
}

export const TRIAL_BENEFITS = [
  "Write with AI that uses your own knowledge and references",
  "Keep every document organized in one calm workspace",
  "Attach research and notes so drafts stay grounded",
  "Chat through edits without leaving the page",
] as const;
