const API_KEY = import.meta.env.VITE_USDA_API_KEY;

export default async function fetchIngredients(query) {
  const params = new URLSearchParams({
    api_key: API_KEY,
    query: query
  });
  let res = null;
  if(query) {
    res = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?${params}`)
  }else{
    res = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/api_key=${API_KEY}`)
  } 
  if (!res.ok) throw new Error("Failed to fetch exercises");

  const json = await res.json();

  return {
    results: json,
  };
}
