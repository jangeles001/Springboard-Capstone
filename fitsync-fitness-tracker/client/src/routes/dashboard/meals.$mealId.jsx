import { createFileRoute } from "@tanstack/react-router";
import { MealDisplayPage } from "../../features/meals/pages/MealDisplayPage";

export const Route = createFileRoute('/dashboard/meals/$mealId')({
    component: MealDisplayPage,
});