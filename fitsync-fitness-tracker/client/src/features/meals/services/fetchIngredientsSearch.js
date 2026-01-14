import fetchIngredients from "../../../services/fetchIngredients";

export async function fetchIngredientsSeach({ query, pageParam = 0 }) {
  const response = await fetchIngredients(query, pageParam);

  return {
    data: response.data,
    pageNumber: response.pageNumber,
    totalPages: response.totalPages,
  };
}