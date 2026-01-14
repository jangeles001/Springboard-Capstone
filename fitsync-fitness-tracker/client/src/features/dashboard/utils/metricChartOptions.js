export const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: { intersect: false },
  },
};

export const comboOptions = {
  ...baseOptions,
  scales: {
    y: {
      beginAtZero: true,
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