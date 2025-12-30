export function buildCaloriesChartConfig(logs, nutritionGoals) {
  const values = logs.map((d) => d.calories);
  const goal = nutritionGoals.calories;

  const { min, max } = getYAxisBounds([...values, goal]);

  return {
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 400,
      },
      scales: {
        y: {
          min,
          max,
          ticks: { stepSize: 500 },
        },
      },
    },
  };
}

function getYAxisBounds(values, padding = 0.1) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return {
    min: Math.floor(min - range * padding),
    max: Math.ceil(max + range * padding),
  };
}
