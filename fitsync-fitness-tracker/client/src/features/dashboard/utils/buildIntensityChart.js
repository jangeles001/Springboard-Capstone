export function buildIntensityComboChart(metrics) {
  const allMuscles = new Set();
  metrics.forEach((m) => {
    Object.keys(m.muscleVolume || {}).forEach((muscle) => allMuscles.add(muscle));
  });
  const musclesArray = Array.from(allMuscles);

  const datasets = musclesArray.map((muscle, idx) => ({
    label: muscle,
    data: metrics.map((m) => m.muscleVolume?.[muscle] || 0),
    backgroundColor: `rgba(${50 + idx * 30}, ${100 + idx * 20}, ${200 - idx * 15}, 0.7)`, // varying colors
    borderRadius: 6,
  }));

  // Optional: add avgVolumePerMinute as line overlay
  datasets.push({
    label: "Avg Volume/Min",
    data: metrics.map((m) => m.avgVolumePerMinute),
    type: "line",
    borderColor: "rgba(139, 92, 246, 0.9)",
    backgroundColor: "rgba(139, 92, 246, 0.3)",
    yAxisID: "y1",
  });

  return {
    labels: metrics.map((m) => m.label),
    datasets,
  };
}