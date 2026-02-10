export function buildTotalVolumeChart(metrics) {
  return {
    labels: metrics.map((m) => m.label),
    datasets: [
      {
        label: "Total Volume (lbs)",
        data: metrics.map((m) => m.totalVolume),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderRadius: 6,
        yAxisID: "y", // ✅ REQUIRED
      },
      {
        label: "Avg Volume / Min",
        data: metrics.map((m) => m.avgVolumePerMinute),
        type: "line",
        borderColor: "rgba(139, 92, 246, 0.9)",
        backgroundColor: "rgba(139, 92, 246, 0.3)",
        yAxisID: "y1",
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };
}