export function removeKey(obj, key) {
  const next = { ...obj };
  delete next[key];
  return next;
}
