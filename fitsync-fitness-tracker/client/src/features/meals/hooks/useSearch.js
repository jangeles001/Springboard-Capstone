import { useState, useRef, useMemo, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import fetchIngredients from "../services/fetchIngredients";
import { shouldLoadMore } from "../../../utils/shouldLoadMore";
import { useMealFormDataIngredients } from "../store/MealsFormStore";

export default function useSearch(initialQuery = "", delay = 700) {
  // Local state for the search query
  const [query, setQuery] = useState(initialQuery);

  // Accessing the current list of ingredients from the meal form context to filter out already added ingredients from search results
  const ingredients = useMealFormDataIngredients();
  const ingredientIds = useMemo(
    () => ingredients.map((item) => Number(item.ingredientId)),
    [ingredients]
  );

  // Debouncer reference to manage the timeout for the search input
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

  // Determines if the search query is a string and is not empty after trimming whitespace
  const isQueryEnabled =
    typeof query === "string" && query.trim().length > 0;

  // Infinite query to fetch ingredients based on the search query, with pagination support
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
    // Determines the next page parameter for pagination based on the last page's data
    getNextPageParam: (lastPage) => {
      if (lastPage.pageNumber < lastPage.totalPages) {
        return lastPage.pageNumber + 1;
      }
      return undefined;
    },
  });

  // Memoized search results that filters out ingredients already added to the meal form to avoid duplicates
  const results = useMemo(() => {
    if (!data) return [];

    // Flatten the paginated results and filter out ingredients that are already added to the meal form
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
    data,
    status,
    error,
    isFetching,
    hasNextPage,
  };
}