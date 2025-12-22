import { useMealsListContext } from "../../hooks/useMealsListContext";
import { MealsListRemoveButton } from "./MealsListRemoveButton";
import Ingredient from "./ingredient";
import Loading from "../../../../components/Loading";

export function MealsListBody() {
  
  // Store state
  const { data, isLoading, isError, error, deleteMeal } = useMealsListContext();

  if(isLoading) return <Loading  type="skeleton"/>
  if(isError) return <>{console.log(error)}</>

  return (
    <>
      {data?.data?.length === 0 ? (
        <p className="text-gray-200">No meals created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto gap-6 h-min w-full max-w-6xl ">
          {data?.data?.map((meal) => (
            <div
              key={meal.uuid}
              className="flex flex-col bg-white rounded-2xl shadow-md p-6 border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {meal.mealName}
              </h2>

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

              <MealsListRemoveButton workoutUUID={meal.uuid} removeFunction={deleteMeal}/>
            </div>
          ))}
        </div>
      )}
    </>
  );
}