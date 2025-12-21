import { MealDisplayContext } from "./MealDisplayContext";

export function MealDisplayBody() {
    const { data } = MealDisplayContext();

    return (
        <div>
            <p>{data.data.description}</p>
        </div>
    )
}