import { format, formatDistanceToNow, parseISO, differenceInDays } from 'date-fns';

export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
  } catch {
    return dateString;
  }
};

export const formatRelativeTime = (dateString: string): string => {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDateRange = (start: string, end: string): string => {
  try {
    const startDate = parseISO(start);
    const endDate = parseISO(end);
    const days = differenceInDays(endDate, startDate);
    return `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd, yyyy')} (${days} days)`;
  } catch {
    return `${start} - ${end}`;
  }
};

export const calculateTotalCost = (
  pricePerDay: number,
  startDate: string,
  endDate: string,
): number => {
  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const days = differenceInDays(end, start);
    return pricePerDay * days;
  } catch {
    return 0;
  }
};

export const toInputDateFormat = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'yyyy-MM-dd');
  } catch {
    return dateString;
  }
};
