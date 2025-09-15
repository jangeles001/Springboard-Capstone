import { useEffect, useState, useCallback } from "react";
import fetchExercises from "../services/fetchExercises";

const BASE_URL = "https://wger.de/api/v2/exerciseinfo/?limit=20&offset=0";

export function useExercises(initialUrl = BASE_URL) {
  const [response, setResponse] = useState([]);
  const [prevLink, setPrevLink] = useState(null);
  const [nextLink, setNextLink] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async (url) => {
    setIsLoading(true);
    setError(null);
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
  };

  const loadByCategory = useCallback(async (categoryId) => {
    const url = categoryId ? `https://wger.de/api/v2/exerciseinfo/?category=${categoryId}&language=2` 
      : BASE_URL;
    await loadData(url)
  },[])

  useEffect(() => {
    loadData(initialUrl);
  }, [initialUrl]);

  return { response, nextLink, prevLink, isLoading, error, loadData, loadByCategory };
}
