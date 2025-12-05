export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function subMonths(d: Date, months: number): Date {
  return new Date(d.getFullYear(), d.getMonth() - months, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
}
