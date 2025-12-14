import { useWorkoutsListContext } from "../../hooks/useWorkoutsListContext"

export function WorkoutsListHeader() {
    const { active, isLoading, handleActiveChange } = useWorkoutsListContext();

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-row mb-10">
            <button 
            className={active === "Personal" ? `border p-3 bg-gray-500` : `border p-3 bg-gray-200 hover:opacity-90 transition`} 
            onClick={() => handleActiveChange("Personal")}
            disabled={isLoading}
            >
                Personal
            </button>
            <button 
            className={active === "All" ? `border p-3 bg-gray-500` : `border p-3 bg-gray-200 hover:opacity-90 transition`}
            onClick={() => handleActiveChange("All")}
            disabled={isLoading}
            >
                All
            </button>
           </div>
           { active === "personal" ? 
           <h1 className="text-4xl font-bold text-white mb-8">Your Workouts</h1> : 
           <h1 className="text-4xl font-bold text-white mb-8">All Workouts</h1>}
          
        </div>
    )
}