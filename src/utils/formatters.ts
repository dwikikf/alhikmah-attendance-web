// Data Formatters - Date, number, percentage formatting

import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Format a date string to locale display format
 */
export function formatDate(
  dateString: string,
  formatStr: string = "dd MMMM yyyy",
): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "-";
    return format(date, formatStr, { locale: id });
  } catch {
    return "-";
  }
}

/**
 * Format a date string to include time
 */
export function formatDateTime(dateString: string): string {
  return formatDate(dateString, "dd MMM yyyy, HH:mm");
}

/**
 * Format a date as relative time (e.g., "2 jam yang lalu")
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "-";
    return formatDistanceToNow(date, { addSuffix: true, locale: id });
  } catch {
    return "-";
  }
}

/**
 * Format a time string (HH:mm)
 */
export function formatTime(dateString: string): string {
  return formatDate(dateString, "HH:mm");
}

/**
 * Format a number as percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a number with locale separator
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

/**
 * Capitalize first letter of each word
 */
export function capitalize(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number = 50): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}
