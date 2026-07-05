// /utils/time.ts

const DENVER_TIMEZONE = 'America/Denver';

/**
 * Returns the current Date object.
 *
 * Example:
 * 2026-07-05T11:42:13.123Z
 */
export const now = (): Date => new Date();

/**
 * Formats a date/time in the America/Denver timezone.
 *
 * Example:
 * July 5, 2026, 5:42:13 AM
 */
export const formatDateTime = (
  date: Date | string | number = new Date(),
  options: Intl.DateTimeFormatOptions = {}
): string => {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: DENVER_TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    ...options
  }).format(new Date(date));
};

/**
 * Formats only the date in the America/Denver timezone.
 *
 * Example:
 * July 5, 2026
 */
export const formatDate = (
  date: Date | string | number = new Date()
): string => {
  return formatDateTime(date, {
    hour: undefined,
    minute: undefined,
    second: undefined
  });
};

/**
 * Formats only the time in the America/Denver timezone.
 *
 * Example:
 * 5:42:13 AM
 */
export const formatTime = (
  date: Date | string | number = new Date()
): string => {
  return formatDateTime(date, {
    year: undefined,
    month: undefined,
    day: undefined
  });
};

/**
 * Returns an ISO-8601 UTC timestamp.
 *
 * Example:
 * 2026-07-05T11:42:13.123Z
 */
export const iso = (
  date: Date | string | number = new Date()
): string => {
  return new Date(date).toISOString();
};

/**
 * Returns a Unix timestamp (seconds).
 *
 * Example:
 * 1783251733
 */
export const unix = (
  date: Date | string | number = new Date()
): number => {
  return Math.floor(new Date(date).getTime() / 1000);
};

/**
 * Returns a SQL-friendly timestamp in the America/Denver timezone.
 *
 * Example:
 * 2026-07-05 05:42:13
 */
export const sqlTimestamp = (
  date: Date | string | number = new Date()
): string => {
  const d = new Date(date);

  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: DENVER_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
    .format(d)
    .replace('T', ' ')
};