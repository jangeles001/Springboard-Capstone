import FieldErrorMessages from "../../../../components/FieldErrorMessages";
import { useMealsFormContext } from "../../hooks/useMealsFormContext";
import IngredientItem from "../IngredientItem";

export function MealsFormIngredients() {
    const { ingredients, getIngredientField, handleRemoveClick, handleIngredientQuantityChange, formErrors } = useMealsFormContext();

    return (
        <div>
            <span className="font-bold">
                <p className={`${formErrors.ingredients ? 'form-label-error' : 'form-label'}`}>Selected Ingredients</p>
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
                })
                }
                {formErrors.ingredients && <FieldErrorMessages field="ingredient" error={formErrors.ingredients} />}
            </div>
        </div>
    )
}