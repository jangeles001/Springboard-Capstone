import { useState, useEffect, useRef } from "react";
import fetchIngredients from "../services/fetchIngredients";

export default function useSearch(initialQuery = "", delay = 700) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setStatus("idle");
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setStatus("loading");
      setError(null);
      try {
        const data = await fetchIngredients(query);
        setResults(data);
        setStatus("success");
      } catch (error) {
        setError(error);
        setStatus("error");
      }
    }, delay);

    return clearTimeout(debounceRef.current);

  }, [query, delay]);

  const handleIngredientChange = (e) => {
    const currentQuery = e.target.value;
    setQuery(currentQuery);
  }

  return { query, handleIngredientChange, results, status, error };
}
