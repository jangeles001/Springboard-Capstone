export function buildMacroChartData(logs, nutritionGoals) {
  return {
    labels: logs.map((log) => log.label),
    datasets: [
      {
        label: "Calories",
        data: logs.map((log) => log.calories),
        backgroundColor: logs.map((log) =>
          getGoalColor(log.calories, nutritionGoals.calories)
        ),
      },
      {
        label: "Protein",
        data: logs.map((log) => log.protein),
        backgroundColor: logs.map((log) =>
          getGoalColor(log.protein, nutritionGoals.protein)
        ),
      },
      {
        label: "Carbs",
        data: logs.map((log) => log.carbs),
        backgroundColor: logs.map((log) =>
          getGoalColor(log.carbs, nutritionGoals.carbs)
        ),
      },
      {
        label: "Fat",
        data: logs.map((log) => log.fat),
        backgroundColor: logs.map((log) =>
          getGoalColor(log.fat, nutritionGoals.fats)
        ),
      },
    ],
  };
}

export function scaleGoal(dailyGoal, periodLength) {
  return dailyGoal * periodLength;
}

function getGoalColor(value, goal) {
  const ratio = value / goal;

  if (ratio >= 0.9 && ratio <= 1.1) return "rgba(22, 163, 74, 0.8)"; // green
  if (ratio >= 0.75 && ratio < 0.9) return "rgba(245, 158, 11, 0.8)"; // yellow
  if (ratio > 1.1 && ratio <= 1.25) return "rgba(245, 158, 11, 0.8)"; // yellow

  return "rgba(220, 38, 38, 0.8)"; // red
}
