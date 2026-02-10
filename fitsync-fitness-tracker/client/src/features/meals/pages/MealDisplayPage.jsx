import { useRouter, useParams } from "@tanstack/react-router";
import { DisplayPage } from "../../../components/DisplayPage/DisplayPage";
import { MealDisplayCard } from "../components/MealDisplayCard";
import { useMealId } from "../hooks/useMealId";

export function MealDisplayPage(){
    const router = useRouter();
    const { mealId } = useParams({from: router.id});
    return (
        
        <DisplayPage
        hook={useMealId}
        CardComponent={MealDisplayCard}
        ResourceId={mealId}
        type={"Meal"}
        />
    );
}