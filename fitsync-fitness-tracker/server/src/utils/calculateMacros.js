/**
 * Calculates recommended macro goals based on user profile.
 */
export function calculateMacros(profile) {
  const { heightInches, weightLbs, age, gender, activityLevel, goalType } =
    profile;

  // BMR (Mifflin–St Jeor, imperial)
  // Formula: (10*weightKg + 6.25*heightCm - 5*age + s) → we need imperial version
  // BMR (men) = 66 + (6.23*weightLbs) + (12.7*heightInches) - (6.8*age)
  // BMR (women) = 655 + (4.35*weightLbs) + (4.7*heightInches) - (4.7*age)

  let bmr;
  if (gender === "male") {
    bmr = 66 + 6.23 * weightLbs + 12.7 * heightInches - 6.8 * age;
  } else if (gender === "female") {
    bmr = 655 + 4.35 * weightLbs + 4.7 * heightInches - 4.7 * age;
  } else {
    // prefer_not_to_say -> average of male & female
    const maleBMR = 66 + 6.23 * weightLbs + 12.7 * heightInches - 6.8 * age;
    const femaleBMR = 655 + 4.35 * weightLbs + 4.7 * heightInches - 4.7 * age;
    bmr = (maleBMR + femaleBMR) / 2;
  }

  // Activity multiplier (Based on standard nutrition science references)
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  const maintenanceCalories = bmr * (activityMultipliers[activityLevel] || 1.2);

  // Apply goal adjustments
  let calorieAdjustment = 0;
  if (goalType === "cut") calorieAdjustment = -500; // moderate deficit
  if (goalType === "bulk") calorieAdjustment = 300; // moderate surplus
  const targetCalories = maintenanceCalories + calorieAdjustment;

  // Split macros
  // Example: Protein = 1g per lb bodyweight, Fats = 25% of calories, rest carbs
  const proteinGrams = Math.round(weightLbs * 1); // 1g per lb
  const fatCalories = targetCalories * 0.25; // 25% from fats
  const fatGrams = Math.round(fatCalories / 9); // 9 cal per gram
  const remainingCalories = targetCalories - (proteinGrams * 4 + fatGrams * 9);
  const carbsGrams = Math.round(Math.max(remainingCalories / 4, 0));

  return {
    calories: Math.round(targetCalories),
    protein: proteinGrams,
    carbs: carbsGrams,
    fats: fatGrams,
    calculatedAt: new Date(),
    formulaVersion: "imperial-v1",
  };
}
