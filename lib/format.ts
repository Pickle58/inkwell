import { formatDistanceToNow } from "date-fns";

export function formatSavedAt(timestamp: number): string {
  return formatDistanceToNow(timestamp, { addSuffix: true });
}
