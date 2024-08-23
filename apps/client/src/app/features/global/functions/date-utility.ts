export function dateStringFromDate(date: Date) {
  return date.toDateString().substring(4);
}

export function timeStringFromDate(date: Date) {
  return date.toTimeString().split(' ')[0];
}
