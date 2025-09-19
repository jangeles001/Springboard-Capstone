export default async function fetchExercises(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch exercises");

  const json = await res.json();

  return {
    results:json,
    prev: json.previous,
    next: json.next,
  };
}
