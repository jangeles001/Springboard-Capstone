import { useState, useRef, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query"
import fetchIngredientSearch from "../../../services/fetchIngredients";
import { shouldLoadMore } from "../../../utils/shouldLoadMore";
import { useMealFormDataIngredients } from "../store/MealsFormStore";

export default function useSearch(initialQuery = "", delay = 700) {
  const [query, setQuery] = useState(initialQuery);
  const ingredients = useMealFormDataIngredients();
  
  const ingredientIds = useMemo(
    () => ingredients.map((item) => item.id),
    [ingredients]
  );

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
      queryFn: ({ pageParam = 0 }) =>
        fetchIngredientSearch({ query, pageParam }),
      enabled: !!query,
      getNextPageParam: (lastPage) => {
        if (lastPage.pageNumber < lastPage.totalPages - 1) {
          return lastPage.pageNumber + 1;
        }
        return undefined;
      },
      staleTime: 5 * 60 * 1000,
  });

  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }

  const debounceRef = useRef(null)

  const handleIngredientSearchChange = (e) => {
  const value = e.target.value;

  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }

  debounceRef.current = setTimeout(() => {
    setQuery(value);
  }, delay);
};

  const results = useMemo(() => {
  if (!data) return [];

  return data.pages
    .flatMap((page) => page.data)
    .filter((item) => !ingredientIds.includes(item.fdcId));
}, [data, ingredientIds]);

  // Handles scroll load
const handleScroll = (e) => {
  if (!hasNextPage || isFetchingNextPage) return;

  const { scrollTop, scrollHeight, clientHeight } = e.target;

  if (shouldLoadMore(scrollTop, scrollHeight, clientHeight)) {
    fetchNextPage();
  }
};

  return {
    data,
    setQuery,
    handleIngredientSearchChange,
    handleScroll,
    results,
  };
}
