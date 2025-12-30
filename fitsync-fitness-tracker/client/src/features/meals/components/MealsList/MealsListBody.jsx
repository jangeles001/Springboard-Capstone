import { useMealsListContext } from "../../hooks/useMealsListContext";
import Ingredient from "./ingredient";
import Loading from "../../../../components/Loading";
import ThemedButton from "../../../../components/ThemedButton";

export function MealsListBody() {
  
  // Store state
  const { data, isLoading, isError, error, mealClick, deleteMeal } = useMealsListContext();

  if(isLoading) return <Loading  type="skeleton"/>
  if(isError) return <>{console.log(error)}</>

  return (
    <>
      {data?.data?.meals?.length === 0 ? (
        <p className="text-gray-500 mx-auto mt-[50px]">No meals created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto gap-6 min-h-[500px] max-w-md md:max-w-2xl lg:max-w-6xl">
          {data?.data?.meals?.map((meal) => (
            <div
              key={meal.uuid}
              className="flex flex-col bg-white rounded-2xl shadow-md p-6 border border-gray-200"
            >
              <h2
              className="text-xl font-semibold text-gray-800 hover:cursor-pointer"
              onClick={() => mealClick(meal.uuid)}
              >
                {meal.mealName}
              </h2>
              <h3>Description</h3>
              <div className="bg-gray-100 rounded-xl p-3 border border-gray-300 mb-5">
                  <p className="text-sm text-gray-600 line-clamp-4">{meal.mealDescription}</p>
              </div>
              <div className="flex flex-col gap-3 mb-4">
                {meal.ingredients.slice(0,3).map((ingredient) => ( // Add creation date to card.
                  <div key={ingredient.ingredientId}>
                    <Ingredient ingredient={ingredient}/>
                  </div>
                ))}
                {meal.ingredients.length > 3 && (
                  <p key={`meal#${meal.uuid}`} className="text-sm text-gray-500">
                    + {meal.ingredients.length - 3} more ingredients
                  </p>
                )}
              </div>

              <ThemedButton text="Remove Meal" onClick={() => deleteMeal(meal.uuid)} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}