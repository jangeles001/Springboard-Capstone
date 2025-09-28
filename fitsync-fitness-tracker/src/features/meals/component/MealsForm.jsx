import { useState } from "react";
import { useMealsForm } from "../../../hooks/useMealsForm"
import useSearch from "../../../hooks/useSearch";

export default function MealsForm() {
    const { 
        mealName,
        ingredients,
        getIngredientField,
        totalCalories,
        handleChange,
        handleClick,
        handleIngredientQuantityChange,
        handleSubmit  
    } = useMealsForm();

    const [ isOpen, setIsOpen ] = useState(false); // State for dropdown
    
    const { 
        query,
        setQuery,
        handleIngredientSearchChange,
        handleScroll, 
        results, 
    } = useSearch("" ,700); // Ingredients search bar debouncer

    return (
        <div className="flex flex-col items-center bg-gradient-to-r from-blue-500 to-indigo-600 h-screen">
            <form className='flex flex-col bg-white m-20 border-2 rounded-xl p-10 gap-3' onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <label htmlFor="mealName" className="font-bold">Enter meal name:</label>
                    <input
                    className="border rounded"
                    type='text'
                    name='mealName'
                    value={mealName}
                    onChange={handleChange}
                    id="mealnName"
                    placeholder="Meal Name" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="ingredients" className="font-bold">Enter ingredients:</label>
                    <div className="relative w-full max-w-md">
                        <input
                        type='text'
                        className="border rounded min-w-md"
                        name='ingredients'
                        id="ingredients"
                        value={query}
                        onChange={handleIngredientSearchChange}
                        placeholder='Type to search for ingredients...'
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
                                    onMouseDown={() => {
                                        handleClick(item)
                                        setQuery("");
                                    }}
                                    onMouseUp={() => setIsOpen(false)}
                                    >
                                        {item?.description} 
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div>
                    <span className="font-bold">Selected Ingredients:</span>
                    {ingredients?.map((item) => {
                        return (
                            <div key={item.id} className="flex items-center space-x-2 my-1">
                                <p>{item.name}</p>
                                <div className="flex flex-row ml-auto">
                                    <label htmlFor="quantity" className="font-bold">Quantity:</label>
                                    <input
                                    className="w-8 
                                    [&::-webkit-inner-spin-button]:appearance-none 
                                    [&::-webkit-outer-spin-button]:m-0 [appearance:textfield]
                                    bg-gray-200 border-1 rounded-md"
                                    type="number"
                                    name="quantity"
                                    min={0}
                                    value={getIngredientField(item.id, "quantity") ?? ""}
                                    onChange={(e) => handleIngredientQuantityChange(item.id, e.target.value)}
                                    />
                                    <label htmlFor="quantity">g</label>
                                </div> 
                            </div> 
                            )
                    })}
                </div>
                <div className="flex flex-col">
                    <label className="font-bold">Calories:</label>
                    <span><p>{totalCalories}</p></span>
                </div>
                <button type='submit' className='border rounded'>Create Meal</button>
            </form>
        </div>
    )
}