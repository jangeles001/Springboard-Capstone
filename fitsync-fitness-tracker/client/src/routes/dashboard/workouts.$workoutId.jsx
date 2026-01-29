import { createFileRoute, useParams } from "@tanstack/react-router";
import { DisplayPage } from "../../components/DisplayPage/DisplayPage";
import { WorkoutDisplayCard } from "../../features/workouts/components/WorkoutDisplayCard";
import { useWorkoutId } from "../../features/workouts/hooks/useWorkoutId";

export const Route = createFileRoute('/dashboard/workouts/$workoutId')({
    component: WorkoutDisplayRoute,
});

function WorkoutDisplayRoute() {
    const { workoutId } = useParams({ from: Route.id });
    return (
        <DisplayPage
        hook={useWorkoutId}
        CardComponent={WorkoutDisplayCard}
        ResourceId={workoutId}
        type="Workout"
        />
    );
}