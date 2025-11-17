import axios from "axios";

export async function fetchAllWgerExercises(limit = 200, delayMs = 200) {
  const allResults = [];
  let nextUrl = `https://wger.de/api/v2/exerciseinfo/?language=2&limit=${limit}&offset=0`;

  while (nextUrl) {
    console.log("Fetching:", nextUrl);

    try {
      const res = await axios.get(nextUrl);

      if (!res.data?.results) {
        console.warn("No results found for URL:", nextUrl);
        break;
      }

      // Filters out non-english descriptions
      const filtered = res.data.results.map((exercise) => {
        const englishTranslation = (exercise.translations =
          exercise.translations.filter((description) => {
            return description.language === 2;
          }));

        return { ...exercise, translations: englishTranslation };
      });

      allResults.push(...filtered);

      // WGER API provides absolute URLs for next page
      nextUrl = res.data.next;

      if (nextUrl) {
        // polite delay to avoid hammering the API
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    } catch (err) {
      console.error("Error fetching exercises:", err.message);
      break;
    }
  }

  console.log(`Fetched a total of ${allResults.length} exercises`);
  return allResults;
}
