export function MealDisplayCard({ item }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border">

      <h2 className="text-3xl font-bold mb-2">
        {item.mealName}
      </h2>

      <p className="text-gray-600 mb-6">
        {item.mealDescription}
      </p>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(item.mealMacros).map(([k, v]) => (
          <div
            key={k}
            className="bg-gray-100 rounded-xl p-3 text-center"
          >
            <p className="text-xs uppercase text-gray-500">{k}</p>
            <p className="font-semibold">{v}</p>
          </div>
        ))}
      </div>

      {/* Ingredients */}
      <div className="flex flex-col gap-3">
        {item.ingredients.map((ingredient) => (
          <div
            key={ingredient.ingredientId}
            className="border rounded-lg p-3"
          >
            <p className="font-medium">
              {ingredient.ingredientName}
            </p>
            <p className="text-sm text-gray-500">
              {ingredient.quantity}g — {ingredient.macros.calories} cal
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}