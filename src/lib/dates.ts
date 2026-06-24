export type QuickRange = {
  label: string;
  days?: number;
  months?: number;
  value: number;
};

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function diffDays(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDefaultRange(): { start: Date; end: Date } {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return { start: now, end: addDays(now, 7) };
}

export function getDefaultBounds(start: Date, end: Date): { minBound: Date; maxBound: Date } {
  const midpoint = new Date((start.getTime() + end.getTime()) / 2);
  return {
    minBound: addDays(midpoint, -22),
    maxBound: addDays(midpoint, 23),
  };
}

export function formatRangeLabel(date: Date, pairDate?: Date): string {
  const showYear = !pairDate || date.getFullYear() !== pairDate.getFullYear();
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    ...(showYear ? { year: "numeric" } : {}),
  };
  return date.toLocaleDateString("en-US", options);
}

export function snapToDay(date: Date): Date {
  return new Date(Math.floor(date.getTime() / 86400000) * 86400000);
}
