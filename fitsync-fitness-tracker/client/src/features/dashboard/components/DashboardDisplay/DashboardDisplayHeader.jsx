import { useDashboardDisplayContext } from "../../hooks/useDashboardContext"

export function DashboardDisplayHeader(){
    const { activeView, handleActiveChange, workoutQuery, nutritionQuery } = useDashboardDisplayContext();

  return (
    <div 
    className="mb-8 rounded-2xl bg-white p-6 shadow-sm border"
    data-testid="dashboard-display-header"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Progress Insights
          </h1>
          <p className="text-sm text-gray-500">
            Track nutrition and training trends over time
          </p>
        </div>

        <div className="flex gap-2">
          <button
            disabled={nutritionQuery.isLoading}
            onClick={() => handleActiveChange("nutrition")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition hover:cursor-pointer
              ${
                activeView === "nutrition"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
          >
            Nutrition
          </button>

          <button
            disabled={workoutQuery.isLoading}
            onClick={() => handleActiveChange("workouts")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition hover:cursor-pointer
              ${
                activeView === "workouts"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
          >
            Workouts
          </button>
        </div>
      </div>
    </div>
  );
}