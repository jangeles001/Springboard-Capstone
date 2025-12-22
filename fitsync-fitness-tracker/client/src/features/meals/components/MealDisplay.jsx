import { MealDisplay } from "./MealDisplay/index.js"

export function MealDisplayPage({ mealId }){ 
    return (
        <>
        <MealDisplay mealId={mealId}>
            <MealDisplay.header />
            <MealDisplay.Body />
            <MealDisplay.Footer />
        </MealDisplay>
        </>
    )
}