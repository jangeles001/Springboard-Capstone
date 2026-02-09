import { usdaApi } from "../../../services/usdaApi";
const API_KEY = import.meta.env.VITE_USDA_API_KEY;

export default async function fetchIngredients(query, page = 1) {
  // If query is empty or only whitespace, return empty
  if (!query || !query.trim()) {
    return { data: [], pageNumber: 1, totalPages: 1 };
  }

  // Construct query parameters for the USDA API
  const params = new URLSearchParams();
  params.append("api_key", API_KEY);
  params.append("query", query.trim());
  params.append("pageNumber", page);
  params.append("pageSize", 15);

  // Append each dataType individually
  ["Foundation", "SurveyFNDDS", "SR Legacy", "Branded"].forEach((type) =>
    params.append("dataType", type)
  );

  // Makes the API request
  const res = await usdaApi.get(`/fdc/v1/foods/search?${params.toString()}`);

  const json = res.data;

  return {
    data: json.foods ?? [],
    pageNumber: json.currentPage ?? 1,
    totalPages: json.totalPages ?? 1,
  };
}