import { useDashboardDisplayContext } from "../../hooks/useDashboardContext";

export function DashboardDisplayFooter(){

  const { recommendationsQuery } = useDashboardDisplayContext();

  console.log("Recommendations Query State:", {
    isLoading: recommendationsQuery.isLoading,
    isError: recommendationsQuery.isError,
    data: recommendationsQuery.data,
    error: recommendationsQuery.error,
  });
  
  return (
    <div className="rounded-2xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        AI Coach Insights
      </h3>

      {recommendationsQuery.isLoading &&
        <>
          <p className="text-sm text-gray-600">
            Loading personalized recommendations...
          </p>
          <div className="mt-4 h-24 rounded-lg bg-white/60 animate-pulse" />
        </>

      }

      {recommendationsQuery.isError && !recommendationsQuery.isLoading && (
        <p className="text-sm text-red-600">
          Failed to load recommendations. Please try again later.
        </p>
      )}

      {recommendationsQuery.data && (
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            {recommendationsQuery.data.summary}
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {recommendationsQuery.data.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}