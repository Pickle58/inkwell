const ACCESS_STATUSES = new Set(["active", "trialing"]);

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function hasSubscriptionAccess(status: string): boolean {
  return ACCESS_STATUSES.has(status);
}

export function toMillis(
  value: Date | string | number | null | undefined,
): number | null {
  if (value == null) {
    return null;
  }
  if (typeof value === "number") {
    return value;
  }
  const millis = new Date(value).getTime();
  return Number.isFinite(millis) ? millis : null;
}
