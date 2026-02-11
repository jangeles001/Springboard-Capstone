export default function getCalories(foodItem) {
  // Checks if foodItem is null or if it is not an array
  if (!foodItem || !Array.isArray(foodItem.foodNutrients)) return null;

  // Looks for Atwater General Factors first
  const nutrient = foodItem.foodNutrients.find(
    (item) => item.number === "957" && item.unitName === "KCAL"
  );

  if (nutrient) return nutrient.amount;

  // Looks for any nutrient with "energy" in name and unit KCAL
  const fallback = foodItem.foodNutrients.find(
    (item) =>
      item.nutrientName.toLowerCase().includes("energy") &&
      item.unitName === "KCAL"
  );

  // Returns fallback or null if null
  return fallback ? fallback.value : null;
}

// Extracts macros information
export function getMacros(foodItem) {
  if (!foodItem || !Array.isArray(foodItem.foodNutrients)) return null;

  const nutrientMap = foodItem.foodNutrients.reduce((map, nutrient) => {
    map[nutrient.nutrientNumber] = nutrient.value;
    return map;
  }, {});

  const protein = nutrientMap["203"] ?? 0; // Protein
  const fat = nutrientMap["204"] ?? 0; // Total fat
  const carbs = nutrientMap["205"] ?? 0; // Carbs by difference
  const fiber = nutrientMap["291"] ?? 0; // Fiber
  const netCarbs = Math.max(0, carbs - fiber);

  // Fallback calories if USDA didn’t provide
  const calories =
    getCalories(foodItem) || protein * 4 + fat * 9 + netCarbs * 4;

  return {
    protein,
    fat,
    carbs,
    fiber,
    netCarbs,
    calories,
  };
}