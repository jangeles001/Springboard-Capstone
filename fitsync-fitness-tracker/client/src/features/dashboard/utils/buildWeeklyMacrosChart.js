export function buildWeeklyMacroChart(logs) {
  return {
    labels: logs.map(l => l.label || l.week),
    datasets: [
      {
        label: "Protein",
        data: logs.map(l => l.protein),
        backgroundColor: "rgba(147, 51, 234, 0.55)",
        borderRadius: 8,
      },
      {
        label: "Carbs",
        data: logs.map(l => l.carbs),
        backgroundColor: "rgba(59, 130, 246, 0.55)",
        borderRadius: 8,
      },
      {
        label: "Fat",
        data: logs.map(l => l.fat),
        backgroundColor: "rgba(20, 184, 166, 0.55)",
        borderRadius: 8,
      },
    ],
  };
}