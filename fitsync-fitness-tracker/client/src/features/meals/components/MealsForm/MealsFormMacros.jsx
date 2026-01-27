import { useMealsFormContext } from "../../hooks/useMealsFormContext";

export function MealsFormMacros() {
    const { mealMacros } = useMealsFormContext();

    return (
        <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
                Estimated Macros
            </h3>
            <div className="flex flex-wrap gap-3">
                {Object.entries(mealMacros || {}).map(([key, value]) => (
                    <span
                    key={key}
                    className="
                    rounded-full bg-blue-50 px-4 py-1
                    text-sm font-medium text-blue-400
                    "
                    >
                        {key.toUpperCase()}: {value}
                    </span>
                ))}
            </div>
        </div>
    )
}