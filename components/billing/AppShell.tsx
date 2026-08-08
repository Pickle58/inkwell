import { SubscriptionGate } from "@/components/billing/SubscriptionGate";

export function AppShell({ children }: { children: React.ReactNode }) {
  return <SubscriptionGate>{children}</SubscriptionGate>;
}
