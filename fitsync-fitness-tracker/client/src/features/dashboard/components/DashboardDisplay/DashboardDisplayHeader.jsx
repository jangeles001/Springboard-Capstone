import { useDashboardDisplayContext } from "../../hooks/useDashboardContext"

export function DashboardDisplayHeader(){
    const { activeView, handleActiveChange, workoutQuery, nutritionQuery } = useDashboardDisplayContext();

    return (
        <div className="flex flex-col justify-center w-full bg-blue-500">
            <div className="flex flex-row ml-auto mt-5 mr-10">
            <button 
            className={activeView === "nutrition" ? `active-view` : `inactive-view`} 
            onClick={() => handleActiveChange("nutrition")}
            disabled={nutritionQuery.isLoading}
            >
                Nutrition Insights
            </button>
            <button 
            className={activeView === "workouts" ? `active-view` : 'inactive-view'}
            onClick={() => handleActiveChange("workouts")}
            disabled={workoutQuery.isLoading}
            >
                Workout Insights
            </button>
           </div>
            <h2 className="ml-[100px] font-bold text-2xl text-white p-5">Progress Insights</h2>
        </div>
    )
}