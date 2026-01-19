import { api } from "./api"
const API_KEY = import.meta.env.VITE_USDA_API_KEY;
const BASE_URL = "https://api.nal.usda.gov/fdc/v1";

function buildParams({ query, page = 1, pageSize = 15 }) {
  // Constructs initial search params
  const params = new URLSearchParams({ api_key: API_KEY });

  // Always includes both data types
  params.append("dataType", "Foundation");
  params.append("dataType", "SurveyFNDDS");

  // Adds query to params if passed in
  if (query) params.append("query", query);
  params.append("pageNumber", page);
  params.append("pageSize", pageSize);

  return params.toString();
}

export default async function fetchIngredients(query, page) {
  const url = `${BASE_URL}/foods/search?${buildParams({ query, page })}`;
  
  const res = await api.get(url);
  if (!res) throw new Error("Failed to fetch ingredients");

  const json = await res.json();

  return {
    data: json.foods ?? [],
    pageNumber: json.currentPage,
    totalPages: json.totalPages,
  };
}
