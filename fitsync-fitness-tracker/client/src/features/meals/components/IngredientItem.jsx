import { FormField } from "../../../components/FormField";
import { FormInput } from "../../../components/FormInput";

export default function IngredientItem({ item, getIngredientField, handleRemoveClick, handleIngredientQuantityChange, formErrors }){
    return (
        <div 
        key={item.id} 
        className="flex items-center space-x-2 my-1 p-2 hover:border-1 rounded-md"
        >
            
            <p className="max-w-md hover:cursor-pointer select-none"
            onDoubleClick={() => handleRemoveClick(item.ingredientId)}
            >
                {item.ingredientName}
            </p>
            <div className="flex flex-row ml-auto">
                <span className="flex flex-row">
                    <FormField name="quantity" label="Quantity(grams)" formError={formErrors}>
                    <FormInput
                    name="quantity"
                    type="number"
                    inputValue={getIngredientField(item.ingredientId, "quantity")}
                    inputErrors={formErrors || ""}
                    handleChange={(e) => handleIngredientQuantityChange(e, item.ingredientId)}
                    placeholder=""
                    styling="min-w-min max-w-[60px] ml-auto mr-[10px]"
                    max={999}
                    onKeyDown={(e) => {
                            if(e.target.value.length === 3 && e.code !== "Backspace")
                                e.preventDefault();
                            return;
                        }   
                    }
                    data-testid={`quantity-input-${item.ingredientId}`}
                    />
                    </FormField>
                </span>
            </div> 
        </div> 
    )
}
