import { createFileRoute, useParams } from "@tanstack/react-router";
import { DisplayPage } from "../../components/DisplayPage/DisplayPage";
import { WorkoutCard } from "../../features/workouts/components/WorkoutCard";
import { useWorkoutDisplay } from "../../features/workouts/hooks/useWorkoutDisplay";

export const Route = createFileRoute('/dashboard/workouts/$workoutId')({
    component: MealDisplayRoute,
});

function MealDisplayRoute() {
    const { workoutId } = useParams({ from: Route.id });
    return (
        <DisplayPage
        hook={useWorkoutDisplay}
        CardComponent={WorkoutCard}
        ResourceId={workoutId}
        />
    );
}