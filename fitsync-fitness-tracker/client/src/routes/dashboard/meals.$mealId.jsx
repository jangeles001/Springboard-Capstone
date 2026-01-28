import { createFileRoute } from "@tanstack/react-router"
import { DisplayPage } from "../../components/DisplayPage/DisplayPage";

export const Route = createFileRoute('/dashboard/meals/$mealId')({
    component: MealDisplayRoute,
});

function MealDisplayRoute() {
  const { mealId } = Route.useParams();

  const { data, isLoading, isError, error } = useMeal(mealId);
  const { mutate: deleteMeal } = useDeleteMeal();

    return (
        <DisplayPage
        data={data}
        isLoading={isLoading}
        isError={isError}
        error={error}
        publicId={mealId}
        onDelete={() => deleteMeal(mealId)}
        CardComponent={MealDisplayCard}
        />
    );
}