export default function IngredientItem({ item, getIngredientField, handleRemoveClick, handleIngredientQuantityChange }){
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
                <label htmlFor="quantity" className="font-bold">Quantity:</label>
                <input
                className="w-11 bg-gray-100 border-1 rounded-md"
                type="number"
                    name="quantity"
                    min={0}
                    max={999}
                    value={getIngredientField(item.ingredientId, "quantity")}
                    onChange={(e) => handleIngredientQuantityChange(e, item.ingredientId)}
                    onKeyDown={(e) => {
                            if(e.target.value.length === 3 && e.code !== "Backspace")
                                e.preventDefault();
                            return;
                        }
                    }
                />
                <label htmlFor="quantity">g</label>
            </div> 
        </div> 
    )
}
