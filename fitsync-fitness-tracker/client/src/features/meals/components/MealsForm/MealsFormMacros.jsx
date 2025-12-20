import { useMealsFormContext } from "../../hooks/useMealsFormContext";

export function MealsFormMacros() {
    const { mealMacros } = useMealsFormContext();

    return (
        <div className="flex flex-col">
            <label htmlFor="macros" className="form-label">Macros:</label>
            <span className="flex flex-row justify-center gap-10">
                {Object?.entries(mealMacros || {})?.map(([key, value]) => (
                    <div 
                    className="flex flex-row" 
                    key={key}
                    >
                        <p>{key.toUpperCase()}: {value}</p>
                    </div>
                ))}
            </span>
        </div>
    )
}