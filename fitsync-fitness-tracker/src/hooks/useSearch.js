import { useState, useEffect, useRef } from "react";
import fetchIngredients from "../services/fetchIngredients";
import { shouldLoadMore } from "../utils/shouldLoadMore";

export default function useSearch(initialQuery = "", delay = 700) {
  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setStatus("loading");
      setError(null);
      try {
        const { data, newPage } = await fetchIngredients({ query });
        setResults(data);
        setCurrentPage(newPage);
        setStatus("success");
      } catch (error) {
        setError(error);
        setStatus("error");
      }
    }, delay);

    return () => clearTimeout(debounceRef.current);
  }, [query, delay]);

  const handleIngredientSearchChange = (e) => {
    const currentQuery = e.target.value;
    setQuery(currentQuery);
  };

  // Handles scroll load
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    console.log(currentPage);
    if (shouldLoadMore(scrollTop, scrollHeight, clientHeight)) {
      setCurrentPage((prevState) => prevState + 1);
      const { data, newPage } = fetchIngredients({ query, currentPage });
      setResults(data);
      setCurrentPage(newPage);
    }
  };

  return {
    query,
    handleIngredientSearchChange,
    handleScroll,
    results,
    status,
    error,
  };
}
