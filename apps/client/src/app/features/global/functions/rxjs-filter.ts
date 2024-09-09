export function isNotNull<T>(val: T): val is Exclude<T, null> {
  return val != null;
}
export function isNotUndefined<T>(val: T): val is Exclude<T, undefined> {
  return val != undefined;
}
