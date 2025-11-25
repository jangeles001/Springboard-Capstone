export function getMembershipDuration(createdAt) {
  const now = new Date();
  const created = new Date(createdAt);

  const diffMs = now - created; // milliseconds difference

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffYears = Math.floor(diffDays / 365);
  const diffMonths = Math.floor((diffDays % 365) / 30);

  return { years: diffYears, months: diffMonths, days: diffDays };
}
