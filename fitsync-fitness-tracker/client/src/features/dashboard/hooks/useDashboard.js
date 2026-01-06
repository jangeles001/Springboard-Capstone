import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNutritionReports } from "../services/fetchNutritionReports";
import { fetchWorkoutReports } from "../services/fetchWorkoutReports";

export function useDashboard(range) {
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState("nutrition");

 const nutritionQuery = useQuery({
    queryKey: ["dashboard", "nutrition", range],
    queryFn: () => fetchNutritionReports(range),
    enabled: activeView === "nutrition",
    staleTime: 5 * 60 * 1000,
  });

  const workoutQuery = useQuery({
    queryKey: ["dashboard", "workouts", range],
    queryFn: () => fetchWorkoutReports(range),
    enabled: activeView === "workouts",
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const nextView = activeView === "nutrition" ? "workouts" : "nutrition";

    queryClient.prefetchQuery({
      queryKey: ["dashboard", nextView, range],
      queryFn:
        nextView === "nutrition"
          ? () => fetchNutritionReports(range)
          : () => fetchWorkoutReports(range),
    });
  }, [activeView, range, queryClient]);

  const activeQuery =
  activeView === "nutrition"
  ? nutritionQuery
  : workoutQuery;

  return {
    nutritionQuery,
    workoutQuery,
    activeQuery,
    activeView,
    setActiveView,
  };
}
