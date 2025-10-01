import { useState } from "react";
import { useMealsForm } from "../../../hooks/useMealsForm"
import useSearch from "../../../hooks/useSearch";

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

    const [ isOpen, setIsOpen ] = useState(false); // State for dropdown
    
    const { 
        query,
        setQuery,
        handleIngredientSearchChange,
        handleScroll, 
        results, 
    } = useSearch("" ,700); // Ingredients search bar debouncer

    return (
        <div className="flex flex-col items-center bg-gray-100 h-screen">
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
                        {isOpen && results?.length > 0 && (
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
                    <span className="font-bold">
                        <p>Selected Ingredients:</p>
                        <p className="text-gray-400">(Double-click on the ingredient name to remove)</p>
                    </span>
                    {ingredients?.map((item) => {
                        return (
                            <div 
                            key={item.id} 
                            className="flex items-center space-x-2 my-1 p-2 hover:border-1 rounded-md">
                                <p className="max-w-md hover:cursor-pointer select-none"
                                onDoubleClick={() => handleRemoveClick(item.id)}>
                                    {item.name}
                                </p>
                                <div className="flex flex-row ml-auto">
                                    <label htmlFor="quantity" className="font-bold">Quantity:</label>
                                    <input
                                    className="w-10 
                                    [&::-webkit-inner-spin-button]:appearance-none 
                                    [&::-webkit-outer-spin-button]:m-0 [appearance:textfield]
                                    bg-gray-200 border-1 rounded-md"
                                    type="number"
                                    name="quantity"
                                    min={0}
                                    max={999}
                                    maxLength={5}
                                    value={getIngredientField(item.id, "quantity") ?? ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                            // allow empty input
                                            if (value === "") {
                                                handleIngredientQuantityChange(item.id, "");
                                                return;
                                            }

                                            // enforce numeric, range, and max 5 digits
                                            const num = Number(value);
                                            if (!Number.isNaN(num) && num >= 0 && num <= 999 && value.length <= 5) {
                                                handleIngredientQuantityChange(item.id, num);
                                            }
                                        }
                                    }
                                    />
                                    <label htmlFor="quantity">g</label>
                                </div> 
                            </div> 
                            )
                    })}
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
                <button type='submit' className='border rounded'>Create Meal</button>
            </form>
        </div>
    )
}