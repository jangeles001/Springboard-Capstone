import { useState } from "react";
import { useMealsForm } from "../../../hooks/useMealsForm"
import useSearch from "../../../hooks/useSearch";
import IngredientItem from "./IngredientItem";
import ResultItem from "./ResultItem";

export default function MealsForm() {
    const { 
        mealName,
        ingredients,
        macros,
        getIngredientField,
        handleChange,
        handleClick,
        handleRemoveClick,
        handleIngredientQuantityChange,
        handleSubmit  
    } = useMealsForm();
    
    const { 
        query,
        setQuery,
        handleIngredientSearchChange,
        handleScroll, 
        results, 
    } = useSearch("" ,700); // Ingredients search bar debouncer

    const [ isOpen, setIsOpen ] = useState(false); // State for dropdown

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 h-screen">
            <form className='flex flex-col bg-white m-20 border-2 rounded-xl p-10 gap-3 min-h-[400px]' onSubmit={handleSubmit}>
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
                        {isOpen && results?.length > 0 && (
                            <ul 
                            className="absolute left-0 right-0 mt-1 border rounded bg-white shadow-md z-10 max-h-60 overflow-y-auto"
                            onScroll={handleScroll}>
                                {results?.map((item) => (
                                    <ResultItem 
                                    item={item} 
                                    onClick={ () => {
                                        handleClick(item)
                                        setQuery("");
                                        setIsOpen(false);
                                    }} 
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div>
                    <span className="font-bold">
                        <p>Selected Ingredients:</p>
                        <p className="text-gray-400">(Double-click on the ingredient name to remove)</p>
                    </span>
                    <div className="min-h-[100px]">
                        {ingredients?.map((item) => {
                            return (
                            <IngredientItem 
                            item={item} 
                            getIngredientField={getIngredientField} 
                            handleRemoveClick={handleRemoveClick} 
                            handleIngredientQuantityChange={handleIngredientQuantityChange} 
                            />)
                        })}
                    </div>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="macros" className="font-bold">Macros:</label>
                    <span className="flex flex-row gap-4">
                        {Object?.entries(macros || {})?.map(([key, value]) => (
                            <div 
                            className="flex flex-row" 
                            key={key}>
                                <p>{key.toUpperCase()}: {value}</p>
                            </div>
                        ))}
                    </span>
                </div>
                <button 
                type='submit' 
                className='text-white border rounded bg-gradient-to-r from-blue-500 to-indigo-600 '
                >
                    Create Meal
                </button>
            </form>
        </div>
    )
}