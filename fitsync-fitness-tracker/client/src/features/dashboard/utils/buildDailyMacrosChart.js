export function buildDailyMacroChart(logs) {
  return {
    labels: logs.map(l => l.label || l.date),
    datasets: [
      {
        label: "Protein",
        data: logs.map(l => l.protein),
        backgroundColor: "rgba(147, 51, 234, 0.6)", // purple
        borderRadius: 6,
      },
      {
        label: "Carbs",
        data: logs.map(l => l.carbs),
        backgroundColor: "rgba(59, 130, 246, 0.6)", // blue
        borderRadius: 6,
      },
      {
        label: "Fat",
        data: logs.map(l => l.fat),
        backgroundColor: "rgba(20, 184, 166, 0.6)", // teal
        borderRadius: 6,
      },
    ],
  };
}