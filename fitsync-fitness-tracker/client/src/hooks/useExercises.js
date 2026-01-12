import { useEffect, useState, useMemo, useCallback } from "react";
import fetchExercises from "../services/fetchExercises";
import {
  useWorkoutActions,
  useCreatedWorkout,
} from "../features/workouts/store/WorkoutStore";

const BASE_URL = "https://wger.de/api/v2/exerciseinfo/?limit=20&offset=0";

export function useExercises(initialUrl = BASE_URL) {
  // Store State
  const createdWorkout = useCreatedWorkout();

  // Store Actions
  const { resetCreatedWorkout, addExerciseToCreatedWorkout } =
    useWorkoutActions();

  // Local state
  const [response, setResponse] = useState([]);
  const [prevLink, setPrevLink] = useState(null);
  const [nextLink, setNextLink] = useState(null);
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [error, setError] = useState(null);

  // Sets response state based on results from API
  const loadData = useCallback(async (url) => {
    setStatus("loading");
    setError(null);
    try {
      const { results, prev, next } = await fetchExercises(url);
      setResponse(results);
      setPrevLink(prev);
      setNextLink(next);
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setError(error);
      setStatus("error");
    }
  }, []);

  // Fetches exercise data from wger api using the url passed in
  const loadByCategory = useCallback(
    async (categoryId) => {
      const url = categoryId
        ? `https://wger.de/api/v2/exerciseinfo/?category=${categoryId}&language=2`
        : BASE_URL;
      await loadData(url);
    },
    [loadData]
  );

  // Filters out selected workouts from the current retreived workouts list being displayed
  const filteredResults = useMemo(() => {
    if (!createdWorkout?.exercises) return response;
    const selectedIds = new Set(createdWorkout?.exercises?.map((e) => e.id));
    return response.filter((ex) => !selectedIds.has(ex.id));
  }, [response, createdWorkout]);

  const handleClick = (exercise) => {
    addExerciseToCreatedWorkout(exercise);
  };

  // Loads exercise on hook mount and removes any previous createdWorkout data
  useEffect(() => {
    loadData(initialUrl);
    resetCreatedWorkout();
  }, [initialUrl, loadData, resetCreatedWorkout]);

  return {
    response: filteredResults,
    nextLink,
    prevLink,
    status,
    error,
    loadData,
    loadByCategory,
    handleClick,
  };
}
