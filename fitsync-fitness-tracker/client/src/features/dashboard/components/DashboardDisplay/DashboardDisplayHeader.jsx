import { useDashboardDisplayContext } from "../../hooks/useDashboardContext"

export function DashboardDisplayHeader(){
    const { activeView, handleActiveChange, workoutQuery, nutritionQuery } = useDashboardDisplayContext

    console.log(workoutQuery, nutritionQuery)

    return (
        <div className="flex flex-col justify-center">
            <div className="flex flex-row ml-auto mt-5 mr-5">
            <button 
            className={activeView === "nutrition" ? `border p-3 bg-gray-500` : `border p-3 bg-gray-200 hover:opacity-90 transition`} 
            onClick={() => handleActiveChange("nutrition")}
            disabled={true}
            >
                Nutrition Insights
            </button>
            <button 
            className={activeView === "workouts" ? `border p-3 bg-gray-500` : `border p-3 bg-gray-200 hover:opacity-90 transition`}
            onClick={() => handleActiveChange("workouts")}
            disabled={true}
            >
                Workout Insights
            </button>
           </div>
            <h2 className="ml-[50px] font-bold text-xl p-5">Progress Insights</h2>
        </div>
    )
}