import { createFileRoute, useParams } from "@tanstack/react-router";
import { DisplayPage } from "../../components/DisplayPage/DisplayPage";
import { MealDisplayCard } from "../../features/meals/components/MealDisplayCard";
import { useMealId } from "../../features/meals/hooks/useMealId";

export const Route = createFileRoute('/dashboard/meals/$mealId')({
    component: MealDisplayRoute,
});

function MealDisplayRoute() {
    const { mealId } = useParams({ from: Route.id });
    return (
        <DisplayPage
        hook={useMealId}
        CardComponent={MealDisplayCard}
        ResourceId={mealId}
        type={"Meal"}
        />
    );
}