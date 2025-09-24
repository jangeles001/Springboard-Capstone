export default function getCalories(foodItem) {
  // Checks if foodItem is null or if it is not an array
  if (!foodItem || !Array.isArray(foodItem.foodNutrients)) return null;

  // Looks for Atwater General Factors first
  const nutrient = foodItem.foodNutrients.find(
    (n) => n.number === "957" && n.unitName === "KCAL"
  );

  if (nutrient) return nutrient.amount;

  // Looks for any nutrient with Energy in name and unit KCAL
  const fallback = foodItem.foodNutrients.find(
    (n) => n.name.toLowerCase().includes("energy") && n.unitName === "KCAL"
  );

  // Returns fallback or null if null
  return fallback ? fallback.amount : null;
}
