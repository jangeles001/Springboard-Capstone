import { useEffect, useState, useMemo, useCallback } from "react";
import fetchExercises from "../services/fetchExercises";
import {
  useWorkoutActions,
  useCreatedWorkout,
} from "../features/workouts/store/WorkoutStore";

const BASE_URL = "https://wger.de/api/v2/exerciseinfo/?limit=20&offset=0";

export function useExercises(initialUrl = BASE_URL) {
  // Store state slice selector
  const createdWorkout = useCreatedWorkout();

  // Store actions selector
  const { addToCreatedWorkout, removeFromCreatedWorkout, createWorkout, resetCreatedWorkout } =
    useWorkoutActions();

  // Hook states
  const [response, setResponse] = useState([]);
  const [workoutName, setWorkoutName] = useState("");
  // const [ createdWorkout, setCreateWorkout ] = useState(""); // may change state handling to hook vs in workouts store.
  const [prevLink, setPrevLink] = useState(null);
  const [nextLink, setNextLink] = useState(null);
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [error, setError] = useState(null);

  // Sets hook state based on response from API
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
  },[]);

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
    if (!createdWorkout) return response;
    const selectedIds = new Set(createdWorkout.map((e) => e.id));
    return response.filter((ex) => !selectedIds.has(ex.id));
  }, [response, createdWorkout]);

  // Adds exercise to create workout window
  const handleClick = (exercise) => {
    addToCreatedWorkout(exercise);
  };

  // Removes exercise from create workout window
  const handleRemove = (id) => {
    removeFromCreatedWorkout(id);
  };

  // Changes the workout name
  const handleChange = (e) => {
    setWorkoutName(e.target.value);
  };

  // Adds created workout to stored list of created workouts
  const handleSubmit = () => {
    if (createdWorkout) {
      createWorkout(workoutName);
      setWorkoutName("");
    }
  };

  // Loads exercise on hook mount and removes any previous createdWorkout data
  useEffect(() => {
    loadData(initialUrl);
    resetCreatedWorkout();
  }, [initialUrl, loadData, resetCreatedWorkout]);

  return {
    response: filteredResults,
    createdWorkout,
    workoutName,
    nextLink,
    prevLink,
    status,
    error,
    loadData,
    loadByCategory,
    handleClick,
    handleRemove,
    handleSubmit,
    handleChange,
  };
}
