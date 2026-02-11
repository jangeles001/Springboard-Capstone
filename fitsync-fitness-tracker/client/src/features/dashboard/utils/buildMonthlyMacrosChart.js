export function buildMonthlyMacroChart(logs) {
  return {
    labels: logs.map(l => l.label || l.month),
    datasets: [
      {
        label: "Protein",
        data: logs.map(l => l.protein),
        backgroundColor: "rgba(147, 51, 234, 0.5)",
        borderRadius: 10,
      },
      {
        label: "Carbs",
        data: logs.map(l => l.carbs),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderRadius: 10,
      },
      {
        label: "Fat",
        data: logs.map(l => l.fat),
        backgroundColor: "rgba(20, 184, 166, 0.5)",
        borderRadius: 10,
      },
    ],
  };
}