import { MealsList } from "../components/MealsList/index"

export function MealsListDisplay(){
    return (
        <MealsList>
            <MealsList.Body />
            <MealsList.Footer />
        </MealsList>
    )
}