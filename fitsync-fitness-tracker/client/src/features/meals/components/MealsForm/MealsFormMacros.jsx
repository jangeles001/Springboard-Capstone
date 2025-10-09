import { useMealsFormContext } from "../../hooks/useMealsFormContext";

export function MealsFormMacros() {
    const { macros } = useMealsFormContext();

    return (
        <div className="flex flex-col">
            <label htmlFor="macros" className="font-bold">Macros:</label>
            <span className="flex flex-row justify-center gap-10">
                {Object?.entries(macros || {})?.map(([key, value]) => (
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