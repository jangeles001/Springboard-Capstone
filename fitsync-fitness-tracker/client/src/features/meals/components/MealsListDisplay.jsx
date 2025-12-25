import { MealsList } from "../components/MealsList/index"

export function MealsListDisplay(){
    return (
        <MealsList>
            <MealsList.Header />
            <MealsList.Body />
            <MealsList.Footer />
        </MealsList>
    )
}