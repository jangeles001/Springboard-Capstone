export default function Ingredient({ ingredient }){
    return (
        <div
        className="flex flex-row bg-gray-100 rounded-xl p-3 border border-gray-300"
        >
            <h3 className="text-md font-medium text-gray-800">
                {ingredient.ingredientName || `Ingredient# ${ingredient.ingredientId}`}
            </h3>
            <span className="flex flex-col ml-auto pl-5">
                <p>Quantity(grams)</p>
                <p className="ml-auto">{ingredient.quantity}</p>
            </span>
        </div>
    )
}