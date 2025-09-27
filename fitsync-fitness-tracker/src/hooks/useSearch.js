import { useState, useEffect, useRef } from "react";
import fetchIngredients from "../services/fetchIngredients";
import { shouldLoadMore } from "../utils/shouldLoadMore";

export default function useSearch(initialQuery = "", delay = 700) {
  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setStatus("loading");
      setError(null);
      try {
        const { data, pageNumber, totalPages } = await fetchIngredients({
          query,
        });
        setCurrentPage(pageNumber);
        setTotalPages(totalPages);
        setResults(data);
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
    if (
      shouldLoadMore(scrollTop, scrollHeight, clientHeight) &&
      totalPages !== currentPage
    ) {
      setCurrentPage((prevState) => prevState + 1);
      const { data } = fetchIngredients({
        query,
        currentPage,
      });
      setResults(data);
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
