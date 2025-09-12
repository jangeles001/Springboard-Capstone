import { useEffect, useState } from "react";
import fetchExercises from "../services/fetchExercises";

const BASE_URL = "https://wger.de/api/v2/exerciseinfo/?limit=20&offset=0";

export function useExercise(initialUrl = BASE_URL) {
  const [response, setResponse] = useState([]);
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async (url) => {
    setIsLoading(true);
    setError(null);
    try {
      const { results, prev, next } = await fetchExercises(url);
      setResponse(results);
      setPrev(prev);
      setNext(next);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(initialUrl);
  }, [initialUrl]);

  return { response, next, prev, isLoading, error, loadData };
}
