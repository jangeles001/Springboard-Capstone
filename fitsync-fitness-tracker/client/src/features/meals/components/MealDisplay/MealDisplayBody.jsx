import { MealDisplayContext } from "./MealDisplayContext";

export function MealDisplayBody() {
    const { data } = MealDisplayContext();

    return (
        <div>
            {console.log(data)}
        </div>
    )
}