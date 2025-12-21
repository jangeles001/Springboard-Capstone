import { createFileRoute } from "@tanstack/react-router"
import { MealDisplay } from "../../features/meals/components/MealDisplay";

export const Route = createFileRoute('/dashboard/meals/$mealId')({
    component: RouteComponent,
});

function RouteComponent(){
    return (
        <div className="bg-gray-200">
    
        </div>
    )
}