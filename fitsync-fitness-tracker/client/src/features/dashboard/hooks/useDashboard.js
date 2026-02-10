import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNutritionReports } from "../services/fetchNutritionReports";
import { fetchWorkoutReports } from "../services/fetchWorkoutReports";
import { fetchRecommendations } from "../services/fetchRecommendations";

export function useDashboard(range) {
  // Local state for active view and query client for prefetching
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState("nutrition");

  // Query for fetching nutrition reports, enabled only when the active view is "nutrition"
  const nutritionQuery = useQuery({
    queryKey: ["dashboard", "nutrition", range],
    queryFn: () => fetchNutritionReports(range),
    enabled: activeView === "nutrition",
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: "always",
  });

  // Query hook for fetching workout reports, enabled only when the active view is "workouts"
  const workoutQuery = useQuery({
    queryKey: ["dashboard", "workouts", range],
    queryFn: () => fetchWorkoutReports(range),
    enabled: activeView === "workouts",
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: "always",
  });

  // Query hook for fetching recommendations, always enabled and with a longer stale time since recommendations will not change frequently
  const recommendationsQuery = useQuery({
    queryKey: ["dashboard", "recommendations"],
    queryFn: () => fetchRecommendations(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  // Prefetch the data for the inactive view
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
    activeView === "nutrition" ? nutritionQuery : workoutQuery;

  // Function to handle changing the active view when a button is clicked
  const handleActiveChange = (buttonValue) => {
    setActiveView(buttonValue);
  };

  return {
    nutritionQuery,
    workoutQuery,
    activeQuery,
    recommendationsQuery,
    activeView,
    handleActiveChange,
  };
}
