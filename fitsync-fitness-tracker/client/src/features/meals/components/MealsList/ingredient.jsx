export default function Ingredient({ ingredient }){
    return (
        <div
        className="flex flex-row bg-gray-100 rounded-xl p-3 border border-gray-300 gap-4"
        >
            <h3 className="text-md font-medium text-gray-800 line-clamp-4">
                {ingredient.ingredientName || `Ingredient# ${ingredient.ingredientId}`}
            </h3>
            <div className="flex flex-col ml-auto text-sm text-gray-600">
                <p>Quantity(grams)</p>
                <p className="text-right">{ingredient.quantity}</p>
            </div>
        </div>
    )
}