export const volumeOptions = {
  responsive: true,
  plugins: {
    legend: { display: true },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export function buildTotalVolumeChart(metrics) {
  return {
    labels: metrics.map(m => m.label),
    datasets: [
      {
        label: "Total Volume",
        data: metrics.map(m => m.totalVolume),
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };
}