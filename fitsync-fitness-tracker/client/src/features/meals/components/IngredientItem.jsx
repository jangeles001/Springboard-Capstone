export default function IngredientItem({ item, getIngredientField, handleRemoveClick, handleIngredientQuantityChange }){
    return (
        <div 
        key={item.id} 
        className="flex items-center space-x-2 my-1 p-2 hover:border-1 rounded-md"
        >
            <p className="max-w-md hover:cursor-pointer select-none"
            onDoubleClick={() => handleRemoveClick(item.id)}
            >
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
                    // Allow empty input
                    if (value === "") {
                        handleIngredientQuantityChange(item.id, "");
                        return;
                    }
                    // Enforce numeric, range, and max 5 digits
                    const num = Number(value);
                    if (!Number.isNaN(num) && num >= 0 && num <= 999 && value.length <= 5) {
                        handleIngredientQuantityChange(item.id, num);
                    }
                }}
                />
                <label htmlFor="quantity">g</label>
            </div> 
        </div> 
    )
}
