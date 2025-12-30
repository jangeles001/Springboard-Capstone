export function getDateRange(range, baseDate = new Date()) {
  const now = new Date(baseDate);

  function dailyRange(type) {
    const start = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    return { start, end, type: type };
  }

  function weeklyRange(type) {
    const day = now.getUTCDay(); // 0 (Sun) → 6 (Sat)
    const diff = (day + 6) % 7; // days since Monday
    const start = new Date(now);
    start.setUTCDate(now.getUTCDate() - diff);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 7);
    return { start, end, type: type };
  }

  function monthlyRange(type) {
    const start = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
    );
    const end = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)
    );
    return { start, end, type: type };
  }

  if (range === "daily") return dailyRange("daily");
  if (range === "weekly") return weeklyRange("weekly");
  if (range === "monthly") return monthlyRange("monthly");
  if (range === "all") {
    return {
      daily: dailyRange("daily"),
      weekly: weeklyRange("weekly"),
      monthly: monthlyRange("monthly"),
    };
  }

  throw new Error(`Unsupported range: ${range}`);
}
