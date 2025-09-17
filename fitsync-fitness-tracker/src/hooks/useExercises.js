import { useEffect, useState, useMemo, useCallback } from "react";
import fetchExercises from "../services/fetchExercises";
import {
  useWorkoutActions,
  useCreatedWorkout,
} from "../features/workouts/store/WorkoutStore";

const BASE_URL = "https://wger.de/api/v2/exerciseinfo/?limit=20&offset=0";

export function useExercises(initialUrl = BASE_URL) {
  const createdWorkout = useCreatedWorkout();
  const { addToCreatedWorkout, removeFromCreatedWorkout, createWorkout } =
    useWorkoutActions();

  const [response, setResponse] = useState([]);
  const [workoutName, setWorkoutName] = useState("");
  // const [ createdWorkout, setCreateWorkout ] = useState("");
  const [prevLink, setPrevLink] = useState(null);
  const [nextLink, setNextLink] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async (url) => {
    setIsLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const { results, prev, next } = await fetchExercises(url);
      setResponse(results);
      setPrevLink(prev);
      setNextLink(next);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadByCategory = useCallback(
    async (categoryId) => {
      const url = categoryId
        ? `https://wger.de/api/v2/exerciseinfo/?category=${categoryId}&language=2`
        : BASE_URL;
      await loadData(url);
    },
    [loadData]
  );

  const filteredResults = useMemo(() => {
    if (!createdWorkout) return response;
    const selectedIds = new Set(createdWorkout.map((e) => e.id));
    return response.filter((ex) => !selectedIds.has(ex.id));
  }, [response, createdWorkout]);

  const handleClick = (exercise) => {
    addToCreatedWorkout(exercise);
  };

  const handleRemove = (id) => {
    removeFromCreatedWorkout(id);
  };

  const handleChange = (e) => {
    setWorkoutName(e.target.value);
  };

  const handleSubmit = () => {
    if (createdWorkout) {
      createWorkout(workoutName);
      setWorkoutName("");
    }
  };

  useEffect(() => {
    loadData(initialUrl);
  }, [initialUrl, loadData]);

  return {
    response: filteredResults,
    createdWorkout,
    workoutName,
    nextLink,
    prevLink,
    isLoading,
    error,
    loadData,
    loadByCategory,
    handleClick,
    handleRemove,
    handleSubmit,
    handleChange,
  };
}
