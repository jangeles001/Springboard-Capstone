import { useDashboardDisplayContext } from "../../hooks/useDashboardContext";

export function DashboardDisplayFooter(){
  const { recommendationsQuery } = useDashboardDisplayContext();
  
  return (
    <div className="rounded-2xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        AI Coach Insights
      </h3>

      {recommendationsQuery.isLoading ?
        <>
          <p className="text-sm text-gray-600">
            Loading personalized recommendations...
          </p>
          <div className="mt-4 h-24 rounded-lg bg-white/60 animate-pulse" />
        </>
        :
        <div className="space-y-4 min-w-full">
          <p className="text-sm text-gray-700">
            {recommendationsQuery?.data?.data?.insights?.muscleImbalances}
          </p>
          <p className="text-sm text-gray-700">
            {recommendationsQuery?.data?.data?.insights?.progressionTips}
          </p>
          <p className="text-sm text-gray-700">
            Recommended Exercises:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {recommendationsQuery.data?.data?.recommendations?.map((rec, index) => (
              <div key={`rec-${index}`} className="flex flex-col gap-1">
                <h4 key={rec.exerciseName} className="font-bold">{rec.exerciseName}</h4>
                <p key={`rec.description-${rec.exerciseName}`}><span className="font-semibold">Description: </span>{`${rec.description}`}</p>
                <p key={`rec.reasoning-${rec.exerciseName}`}><span className="font-semibold">Reasoning: </span>{`${rec.reasoning}`}</p>
                <p key={`rec.index-${rec.exerciseName}`}><span className="font-semibold">Target Muscles: </span>{rec.targetMuscles.join(', ')}</p>
                <br></br>
              </div>
            ))}
          </ul>
        </div>
      }
    </div>
  );
}