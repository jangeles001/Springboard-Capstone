const API_KEY = import.meta.env.VITE_USDA_API_KEY;

export default async function fetchExercises(url) {
  const res = await fetch(url + `&api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch exercises");

  const json = await res.json();

  return {
    results: json,
    prev: json.previous,
    next: json.next,
  };
}
