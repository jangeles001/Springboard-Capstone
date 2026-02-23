/**
 * This was a test of re-exporting and what I would benefit from it.
 * Decided against using this everywhere but kept for meals as an example.
 */

export * from "./components/MealsForm"; // re-export all MealsForm components
export * from "./hooks/useMealsForm"; // re-export hook
export * from "./store/MealsFormStore"; // re-export store (Zustand)
export * from "./utils/nutrition"; // re-export utilities
