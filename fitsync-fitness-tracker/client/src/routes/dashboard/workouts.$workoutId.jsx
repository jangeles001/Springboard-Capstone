import { createFileRoute } from "@tanstack/react-router";
import { WorkoutDisplayPage } from "../../features/workouts/pages/WorkoutDisplayPage";

export const Route = createFileRoute('/dashboard/workouts/$workoutId')({
    component: WorkoutDisplayPage,
});