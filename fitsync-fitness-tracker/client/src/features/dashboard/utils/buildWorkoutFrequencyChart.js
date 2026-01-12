export const frequencyOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { intersect: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
    },
  },
};


export function buildWorkoutFrequencyChart(metrics) {
  return {
    labels: metrics.map(m => m.label),
    datasets: [
      {
        label: "Workouts",
        data: metrics.map(m => m.workoutCount),
        borderRadius: 6,
      },
    ],
  };
}