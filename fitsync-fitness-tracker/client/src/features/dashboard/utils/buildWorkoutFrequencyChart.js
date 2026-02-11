export function buildWorkoutFrequencyChart(metrics) {
  return {
    labels: metrics.map((m) => m.label),
    datasets: [
      {
        label: "Workouts",
        data: metrics.map((m) => m.workoutCount),
        backgroundColor: "rgba(59, 130, 246, 0.7)", // blue
        borderRadius: 6,
      },
      {
        label: "Total Duration (min)",
        data: metrics.map((m) => m.totalDuration),
        type: "line",
        borderColor: "rgba(139, 92, 246, 0.8)", // purple
        backgroundColor: "rgba(139, 92, 246, 0.3)",
        yAxisID: "y1", // secondary axis if using combo chart
      },
    ],
  };
}