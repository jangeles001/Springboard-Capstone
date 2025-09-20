import { useState } from "react";
import { useMealsForm } from "../../../hooks/useMealsForm"
import useSearch from "../../../hooks/useSearch";

export default function MealsForm() {
    const { 
        mealName, 
        ingredients, 
        calories,
        handleChange,
        handleSubmit  
    } = useMealsForm();

    const [ isOpen, setIsOpen ] = useState(false); // State for future dropdown
    
      const { query,
        handleIngredientChange, 
        results, 
        status } = useSearch("", 700); // Ingredients search bar debouncer

        console.log(results);
    return (
        <div className="flex flex-col">
            <form>
                <label htmlFor="mealName">Enter meal name:</label>
                <input
                className="border rounded"
                type='text'
                name='mealName'
                value={mealName}
                id="mealnName"
                placeholder="Enter Name">
                </input>
                <label htmlFor="ingredients">Enter ingredients:</label>
                <input
                type='text'
                className="border rounded min-w-md"
                name='ingredients'
                id="ingredients"
                value={query}
                onChange={ handleIngredientChange }
                placeholder='Type to seach for ingredients...'
                >
                </input>
                <div>
                    {/** Populate with ingredients selected */}
                </div>
                <label>Calories:</label> {/** calculate for user based on ingredients */}
                <span>**CALORIES**</span>
                <button type='submit' className='border rounded'>Create Meal</button>
            </form>
        </div>
    )
}