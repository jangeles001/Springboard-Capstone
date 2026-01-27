import { useEffect, useState, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import fetchExercises from "../../../services/fetchExercises";
import {
  useWorkoutActions,
  useCreatedWorkout,
} from "../store/WorkoutStore";

const BASE_URL = "https://wger.de/api/v2/exerciseinfo/?limit=20&offset=0";

export function useExercises(initialUrl = BASE_URL) {
  // Local State
  const [url, setUrl] = useState(initialUrl);

  // Store State
  const createdWorkout = useCreatedWorkout();
  // Store Actions
  const { resetCreatedWorkout, addExerciseToCreatedWorkout } =
    useWorkoutActions();

  const fetchExercisesQuery = useQuery({
    queryKey: ["exercises", url],
    queryFn: () => fetchExercises(url),
    keepPreviousData: true,
  });

  // Filters out selected workouts from the current retreived workouts list being displayed
  const filteredResults = useMemo(() => {
    // If no exercises have been added yet, return all results
    if (!createdWorkout?.exercises) return fetchExercisesQuery.data?.results || [];
    
    // Create a set of selected exercise IDs for efficient lookup
    const selectedIds = new Set(createdWorkout?.exercises?.map((e) => e.id));

    // Filter out exercises that are already selected
    return ( 
      fetchExercisesQuery.data?.results?.filter((ex) => 
        !selectedIds.has(ex.id)) || []
    ) 
  }, [fetchExercisesQuery.data, createdWorkout]);

  // Loads exercise data from wger api using the provided url
  const loadData = useCallback(async (newUrl) => {
    setUrl(newUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetches exercise data from wger api using the url passed in
  const loadByCategory = useCallback(
    async (categoryId) => {
      const url = categoryId
        ? `https://wger.de/api/v2/exerciseinfo/?category=${categoryId}&language=2`
        : BASE_URL;
      setUrl(url);
    },
    []
  );

  // Handles when an exercise is clicked to add to created workout
  const handleClick = (exercise) => {
    addExerciseToCreatedWorkout(exercise);
  };

  // Reset created workout when component using this hook unmounts
  useEffect(() => {
    return () => {
      resetCreatedWorkout();
    };
  }, [resetCreatedWorkout]);

  return {
    response: filteredResults,
    nextLink: fetchExercisesQuery.data?.next,
    prevLink: fetchExercisesQuery.data?.previous,
    status: fetchExercisesQuery.status,
    error: fetchExercisesQuery.error,
    loadData,
    loadByCategory,
    handleClick,
  };
}
