import { useState, useRef, useMemo, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import fetchIngredients from "../services/fetchIngredients";
import { shouldLoadMore } from "../../../utils/shouldLoadMore";
import { useMealFormDataIngredients } from "../store/MealsFormStore";

export default function useSearch(initialQuery = "", delay = 700) {
  const [query, setQuery] = useState(initialQuery);

  const ingredients = useMealFormDataIngredients();
  const ingredientIds = useMemo(
    () => ingredients.map((item) => item.id),
    [ingredients]
  );

  // Debounce
  const debounceRef = useRef(null);

  const debouncedSetQuery = useCallback(
    (value) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        setQuery(value);
      }, delay);
    },
    [delay]
  );

  // Query enabled guard 
  const isQueryEnabled =
    typeof query === "string" && query.trim().length > 0;

  // Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["ingredients", query],
    queryFn: ({ pageParam = 1 }) =>
      fetchIngredients(query, pageParam),

    enabled: isQueryEnabled,

    getNextPageParam: (lastPage) => {
      if (lastPage.pageNumber < lastPage.totalPages) {
        return lastPage.pageNumber + 1;
      }
      return undefined;
    },
  });

  // Derived results 
  const results = useMemo(() => {
    if (!data) return [];

    return data.pages
      .flatMap((page) => page.data)
      .filter((item) => !ingredientIds.includes(item.fdcId));
  }, [data, ingredientIds]);

  // Scroll handler 
  const handleScroll = useCallback(
    (e) => {
      if (!hasNextPage || isFetchingNextPage) return;

      const { scrollTop, scrollHeight, clientHeight } = e.target;

      if (shouldLoadMore(scrollTop, scrollHeight, clientHeight)) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  return {
    query,
    debouncedSetQuery,
    handleScroll,
    results,

    // React Query state
    data,
    status,
    error,
    isFetching,
    hasNextPage,
  };
}