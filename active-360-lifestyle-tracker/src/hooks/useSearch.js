import { useState, useEffect, useRef } from "react";

export default function useSearch(initialQuery = "", delay = "700") {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://wger.de/api/v2/exerciseinfo/?limit=20&offset=0&search=${query}`
        );
        const json = await res.json();

        const filtered = json.results.map((exercise) => {
          const englishTranslation = exercise.translations.filter(
            (translation) => translation.language === 2
          );
          return { ...exercise, translations: englishTranslation };
        });

        setResults(filtered);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }

      return clearTimeout(debounceRef.current);
    }, delay);
  }, [query, delay]);

  return { query, setQuery, results, loading, error };
}
