import Ingredient from "./ingredient";

export function MealCard({ item: meal, onClick, handleDelete, active}) {
  return (
    <div className="flex flex-col min-w-md max-w-md bg-white rounded-2xl shadow-md p-6 border border-gray-200 transition hover:shadow-lg">
      <h2
        className="text-xl font-semibold text-gray-800 hover:cursor-pointer"
        onClick={() => onClick(meal.uuid)}
      >
        {meal.mealName}
      </h2>

      <h3 className="mt-2 text-sm font-medium text-gray-500">
        Description
      </h3>

      <div className="bg-gray-100 rounded-xl p-3 border border-gray-300 mb-5">
        <p className="text-sm text-gray-600 line-clamp-4">
          {meal.mealDescription}
        </p>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {meal.ingredients.slice(0, 3).map((ingredient) => (
          <Ingredient
            key={ingredient.ingredientId}
            item={ingredient}
          />
        ))}

        {meal.ingredients.length > 3 && (
          <p className="text-sm text-gray-500">
            + {meal.ingredients.length - 3} more ingredients
          </p>
        )}
      </div>

      {active === "Personal" &&  
        <button
        className="mt-8 bg-blue-500 text-white px-4 py-2 rounded-lg"
        onClick={() => handleDelete(meal.uuid)}
        data-testid={`delete-button-${meal?.uuid}`}
        >
          Delete Meal
        </button>
      }
    </div>
  );
}
