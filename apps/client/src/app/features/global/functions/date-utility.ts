export function dateStringFromDate(date: Date) {
  return date.toISOString().split('T')[0];
}

export function timeStringFromDate(date: Date) {
  return date.toTimeString().split(' ')[0];
}
