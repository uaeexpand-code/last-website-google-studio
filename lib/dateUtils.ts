
import { format, parse, differenceInDays, isToday, isTomorrow, isYesterday, startOfDay } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { TranslationKey } from '@/types';

const timeZone = 'Asia/Dubai';

export const getUaeDate = (): Date => {
  return utcToZonedTime(new Date(), timeZone);
};

export const formatToYyyyMmDd = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatToDdMmYyyy = (dateStr: string): string => {
  const date = parse(dateStr, 'yyyy-MM-dd', new Date());
  const uaeDate = utcToZonedTime(date, timeZone);
  return format(uaeDate, 'dd/MM/yyyy');
};

export const parseFromYyyyMmDd = (dateStr: string): Date => {
    // When parsing, treat the string as a UTC date to avoid timezone shifts from the browser
    return zonedTimeToUtc(`${dateStr}T00:00:00`, timeZone);
}

export const getSmartDateDisplay = (dateStr: string, t: (key: TranslationKey, replacements?: Record<string, string | number>) => string): string => {
  const date = parseFromYyyyMmDd(dateStr);
  const uaeDate = utcToZonedTime(date, timeZone);
  const uaeToday = startOfDay(getUaeDate());
  
  if (isToday(uaeDate)) return t('date.today');
  if (isTomorrow(uaeDate)) return t('date.tomorrow');
  if (isYesterday(uaeDate)) return t('date.yesterday');

  const daysDiff = differenceInDays(startOfDay(uaeDate), uaeToday);

  if (daysDiff > 0) {
    return t('date.in_x_days', { days: daysDiff });
  } else {
    return t('date.x_days_ago', { days: Math.abs(daysDiff) });
  }
};
