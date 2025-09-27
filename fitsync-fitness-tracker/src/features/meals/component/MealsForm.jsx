import { useState } from "react";
import { useMealsForm } from "../../../hooks/useMealsForm"
import useSearch from "../../../hooks/useSearch";

export default function MealsForm() {
    const { 
        mealName,
        ingredients,
        getIngredientQuantity,
        calculatedCal,
        handleChange,
        handleClick,
        handleIngredientQuantityChange,
        handleSubmit  
    } = useMealsForm();

    const [ isOpen, setIsOpen ] = useState(false); // State for dropdown
    
    const { 
        query,
        handleIngredientSearchChange,
        handleScroll, 
        results, 
    } = useSearch("" ,700); // Ingredients search bar debouncer

    return (
        <div className="flex flex-col items-center bg-gradient-to-r from-blue-500 to-indigo-600 h-screen">
            <form className='flex flex-col bg-white' onSubmit={handleSubmit}>
                <label htmlFor="mealName">Enter meal name:</label>
                <input
                className="border rounded"
                type='text'
                name='mealName'
                value={mealName}
                onChange={handleChange}
                id="mealnName"
                placeholder="Enter Name" />
                <label htmlFor="ingredients">Enter ingredients:</label>
                <div className="relative w-full max-w-md">
                    <input
                    type='text'
                    className="border rounded min-w-md"
                    name='ingredients'
                    id="ingredients"
                    value={query}
                    onChange={handleIngredientSearchChange}
                    placeholder='Type to seach for ingredients...'
                    onFocus={() => setIsOpen(true)}
                    />
                    {isOpen && results.length > 0 && (
                        <ul 
                        className="absolute left-0 right-0 mt-1 border rounded bg-white shadow-md z-10 max-h-60 overflow-y-auto"
                        onScroll={handleScroll}>
                            {results?.map((item) => (
                                <li
                                key={item?.fdcId}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onMouseDown={() => handleClick(item)}
                                onMouseUp={() => setIsOpen(false)}
                                >
                                    {item?.description} 
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    <span>Selected Ingredients:</span>
                    {ingredients?.map((item) => {
                        return (
                            <div key={item.id} className="flex items-center space-x-2 my-1">
                                <p>{item.name}</p> 
                                <label>Quantity:</label>
                                <input
                                type="number"
                                value={getIngredientQuantity(item.id) ?? 0}
                                min={0}
                                onChange={(e) => handleIngredientQuantityChange(item.id, e.target.value)}
                                />
                            </div> 
                            )
                    })}
                </div>
                <label>Calories:</label>
                <span>{calculatedCal ? <p>{calculatedCal}</p> : <p className="text-gray-400">Please Select an ingredient to begin calculating total calories...</p>}</span>
                <button type='submit' className='border rounded'>Create Meal</button>
            </form>
        </div>
    )
}