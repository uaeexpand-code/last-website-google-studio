import { format, parse, differenceInDays, isToday, isTomorrow, isYesterday, startOfDay } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { TranslationKey } from '@/types';

const timeZone = 'Asia/Dubai';

// Returns the current Date object representing the time in UAE.
export const getUaeDate = (): Date => {
  return toZonedTime(new Date(), timeZone);
};

// Formats a Date object to a 'YYYY-MM-DD' string.
export const formatToYyyyMmDd = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Takes a 'YYYY-MM-DD' string and formats it to 'DD/MM/YYYY'.
export const formatToDdMmYyyy = (dateStr: string): string => {
  const uaeDate = fromZonedTime(dateStr, timeZone);
  return format(uaeDate, 'dd/MM/yyyy');
};

// Takes a 'YYYY-MM-DD' string and returns a Date object representing the start of that day in UAE.
export const parseFromYyyyMmDd = (dateStr: string): Date => {
    return fromZonedTime(dateStr, timeZone);
}

// Takes a 'YYYY-MM-DD' string and returns a human-readable string like "Today", "Tomorrow", etc.
export const getSmartDateDisplay = (dateStr: string, t: (key: TranslationKey, replacements?: Record<string, string | number>) => string): string => {
  // The Date object representing the expense date in UAE time.
  const expenseDate = parseFromYyyyMmDd(dateStr);
  // The Date object representing the start of today in UAE time.
  const uaeToday = startOfDay(getUaeDate());
  
  if (isToday(expenseDate)) return t('date.today');
  if (isTomorrow(expenseDate)) return t('date.tomorrow');
  if (isYesterday(expenseDate)) return t('date.yesterday');

  const daysDiff = differenceInDays(startOfDay(expenseDate), uaeToday);

  if (daysDiff > 0) {
    return t('date.in_x_days', { days: daysDiff });
  } else {
    return t('date.x_days_ago', { days: Math.abs(daysDiff) });
  }
};