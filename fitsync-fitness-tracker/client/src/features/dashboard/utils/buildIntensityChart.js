export const intensityOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
  },
  scales: {
    y: {
      beginAtZero: true,
      position: "left",
      ticks: { precision: 0 },
      title: { display: true, text: "Workouts" },
    },
    y1: {
      beginAtZero: true,
      position: "right",
      grid: { drawOnChartArea: false },
      title: { display: true, text: "Avg Volume" },
    },
  },
};

export function buildIntensityComboChart(metrics) {
  return {
    labels: metrics.map(m => m.label),
    datasets: [
      {
        type: "bar",
        label: "Workout Count",
        data: metrics.map(m => m.workoutCount),
        yAxisID: "y",
        borderRadius: 6,
      },
      {
        type: "line",
        label: "Avg Workout Volume",
        data: metrics.map(m => m.avgWorkoutVolume),
        yAxisID: "y1",
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };
}