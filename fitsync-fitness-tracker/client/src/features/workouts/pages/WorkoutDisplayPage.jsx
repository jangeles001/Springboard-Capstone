import { useRouter, useParams } from "@tanstack/react-router";
import { DisplayPage } from "../../../components/DisplayPage/DisplayPage";
import { WorkoutDisplayCard } from "../components/WorkoutDisplayCard";
import { useWorkoutId } from "../hooks/useWorkoutId";

export function WorkoutDisplayPage() {
    const router = useRouter();
    const { workoutId } = useParams({ from: router.id });
    return (
        <DisplayPage
        hook={useWorkoutId}
        CardComponent={WorkoutDisplayCard}
        ResourceId={workoutId}
        type="Workout"  
        />
    );
}