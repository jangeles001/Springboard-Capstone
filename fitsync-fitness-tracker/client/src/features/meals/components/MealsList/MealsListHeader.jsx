import { useMealsListContext } from "../../hooks/useMealsListContext";

export function MealsListHeader() {
    const { active, isLoading, handleActiveChange } = useMealsListContext();

    return (
        <div className="flex flex-col items-center w-full bg-gradient-to-r from-blue-500 to-indigo-600 mb-10">
            <div className="flex flex-row ml-auto mt-5 mr-5">
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
           <h1 className="text-4xl font-bold text-white mb-8">Your Meals</h1> : 
           <h1 className="text-4xl font-bold text-white mb-8">All Meals</h1>}
          
        </div>
    )
}