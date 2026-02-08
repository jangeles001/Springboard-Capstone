import { useRouter, useParams } from "@tanstack/react-router";
import { DisplayPage } from "../../../components/DisplayPage/DisplayPage";
import { MealDisplayCard } from "../components/MealDisplayCard";
import { useMealId } from "../hooks/useMealId";

export function MealDisplayPage(){
    const router = useRouter();
    const { mealId } = useParams({from: router.id});
    return (
        // Generic display page component that takes in a hook, a card component, and a resource id to display the details of a specific meal
        <DisplayPage
        hook={useMealId}
        CardComponent={MealDisplayCard}
        ResourceId={mealId}
        type={"Meal"}
        />
    );
}