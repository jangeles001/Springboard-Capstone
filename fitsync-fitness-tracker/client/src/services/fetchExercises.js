export default async function fetchExercises(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch exercises");

  const json = await res.json();

  const filtered = json.results.map((exercise) => {
    const englishTranslation = (exercise.translations =
      exercise.translations.filter((description) => {
        return description.language === 2;
      }))

    return { ...exercise, translations: englishTranslation};
  });

  return {
    results: filtered,
    prev: json.previous,
    next: json.next,
  };
}
