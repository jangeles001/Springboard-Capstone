import { MealDisplayContext } from "./MealDisplayContext";

export function MealDisplayHeader() {
    const { data } = MealDisplayContext();

    return (
        <div className="flex flex-col">
            <h1 className="font-size-xl">{data.data.mealName}</h1>
        </div>
    )
}