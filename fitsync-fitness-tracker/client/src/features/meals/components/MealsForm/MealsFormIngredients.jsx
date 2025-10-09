import { useMealsFormContext } from "../../hooks/useMealsFormContext";
import IngredientItem from "../IngredientItem";

export function MealsFormIngredients() {
    const { ingredients, getIngredientField, handleRemoveClick, handleIngredientQuantityChange } = useMealsFormContext();

    return (
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
                        />
                    )
                })}
            </div>
        </div>
    )
}