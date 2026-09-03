import { format, differenceInCalendarDays, subDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const DEFAULT_APP_TZ = "America/New_York";

/** Parses a YYYY-MM-DD calendar-date string into a local-midnight Date, with
 * no timezone conversion, so callers can safely diff and format it. */
function parseCalendarDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Returns today's date as YYYY-MM-DD in the given IANA timezone, computed
 * from the server clock. Never derive "today" from the browser clock. */
export function todayInAppTz(tz: string = DEFAULT_APP_TZ): string {
  const zoned = toZonedTime(new Date(), tz);
  return format(zoned, "yyyy-MM-dd");
}

/** Yesterday's date as YYYY-MM-DD in the given IANA timezone. */
export function yesterdayInAppTz(tz: string = DEFAULT_APP_TZ): string {
  const zoned = toZonedTime(new Date(), tz);
  return format(subDays(zoned, 1), "yyyy-MM-dd");
}

/** "Sunday, 30 August 2026" */
export function formatLongDate(dateStr: string): string {
  return format(parseCalendarDate(dateStr), "EEEE, d MMMM yyyy");
}

/** "30 Aug" */
export function formatShortDate(dateStr: string): string {
  return format(parseCalendarDate(dateStr), "d MMM");
}

/** "today" | "yesterday" | "3 days ago" | "2 weeks ago" */
export function relativeLabel(dateStr: string, tz: string = DEFAULT_APP_TZ): string {
  const todayStr = todayInAppTz(tz);
  const diffDays = differenceInCalendarDays(parseCalendarDate(todayStr), parseCalendarDate(dateStr));

  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  const weeks = Math.floor(diffDays / 7);
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
}

/** True if dateStr is null, or older than staleAfterDays relative to today. */
export function isStale(
  dateStr: string | null,
  staleAfterDays: number,
  tz: string = DEFAULT_APP_TZ,
): boolean {
  if (!dateStr) return true;
  const todayStr = todayInAppTz(tz);
  const diffDays = differenceInCalendarDays(parseCalendarDate(todayStr), parseCalendarDate(dateStr));
  return diffDays > staleAfterDays;
}
