import { useState, useEffect, useRef, useMemo } from "react";
import fetchIngredients from "../../../services/fetchIngredients";
import { shouldLoadMore } from "../../../utils/shouldLoadMore";
import { useMealFormDataIngredients } from "../store/MealsFormStore";

export default function useSearch(initialQuery = "", delay = 700) {
  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);
  const ingredients = useMealFormDataIngredients();
  const ingredientIds = useMemo(
    () => ingredients.map((item) => item.id),
    [ingredients]
  );
  useEffect(() => {
    if (!query) {
      setResults([]);
      setCurrentPage(0);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setStatus("loading");
      setError(null);
      try {
        const { data, pageNumber, totalPages } = await fetchIngredients(query);
        const filteredData = data.filter((item) => {
          return !ingredientIds.includes(item.fdcId);
        });
        setResults(filteredData);
        setCurrentPage(pageNumber);
        setTotalPages(totalPages);
        setStatus("success");
      } catch (error) {
        setError(error);
        setStatus("error");
      }
    }, delay);

    return () => clearTimeout(debounceRef.current);
  }, [query, delay, ingredientIds]);

  const handleIngredientSearchChange = (e) => {
    const currentQuery = e.target.value;
    setQuery(currentQuery);
  };

  // Handles scroll load
  const handleScroll = async (e) => {
    if (status === "loading") {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      shouldLoadMore(scrollTop, scrollHeight, clientHeight) &&
      totalPages !== currentPage
    ) {
      setStatus("loading");
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      const { data } = await fetchIngredients(query, nextPage);
      setResults((prevState) => [...prevState, ...data]);
      setStatus("success");
    }
  };

  return {
    query,
    setQuery,
    handleIngredientSearchChange,
    handleScroll,
    results,
    status,
    error,
  };
}
