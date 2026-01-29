import Ingredient from "./ingredient";
import ThemedButton from "../../../components/ThemedButton";

export function MealDisplayCard({ data, publicId, onDelete }) {
  if (!data) return null;

  const isOwner = data?.data?.creatorPublicId === publicId;

  return (
    <div className="max-w-4xl min-w-min mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      
      <h2 className="text-3xl font-bold mb-2">
        {data?.data?.mealName}
      </h2>

      <p className="text-gray-500 mb-6">
        Description: {data?.data?.mealDescription}
      </p>

      {/* Ingredients */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Ingredients</h3>
        <div className="flex flex-col gap-2">
          {data?.data?.ingredients.map((ingredient) => (
            <Ingredient
              key={ingredient.ingredientId}
              item={ingredient}
              getIngredientField={() => ingredient.quantity} // read-only for display
              handleRemoveClick={() => {}}
              handleIngredientQuantityChange={() => {}}
              formErrors={{}}
            />
          ))}
        </div>
      </div>

      {/* Macros */}
      <div className="mb-6 grid grid-cols-3 gap-4 text-center">
        {Object.entries(data?.data?.mealMacros).map(([macro, value]) => (
          <div key={macro} className="bg-gray-100 rounded-xl p-3">
            <p className="font-semibold text-gray-700 capitalize">{macro}</p>
            <p className="text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      {isOwner && onDelete && (
        <div className="flex justify-end">
          <ThemedButton
            text="Delete Meal"
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
          />
        </div>
      )}
    </div>
  );
}