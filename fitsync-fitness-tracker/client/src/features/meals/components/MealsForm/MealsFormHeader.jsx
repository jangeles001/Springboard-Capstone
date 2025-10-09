import { useMealsFormContext } from '../../hooks/useMealsFormContext'

export function MealsFormHeader() {
    const { mealName, handleChange } = useMealsFormContext();

    return (
        <div className="flex flex-col">
            <label htmlFor="mealName" className="font-bold">Enter meal name:</label>
            <input
            className="flex border rounded max-w-[575px] pl-3"
            type='text'
            name='mealName'
            value={mealName}
            maxLength={70}
            onChange={handleChange}
            id="mealnName"
            placeholder="Meal Name" />
        </div>
    );
}