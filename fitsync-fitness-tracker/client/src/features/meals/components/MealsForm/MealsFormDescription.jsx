import { useMealsFormContext } from '../../hooks/useMealsFormContext'

export function MealsFormDescription() {
    const { mealDescription, handleChange } = useMealsFormContext();

    return (
        <div className="flex flex-col">
            <label htmlFor="mealDescription" className="font-bold">Enter meal description:</label>
            <textarea
            className="flex border rounded max-w-[575px] min-h-[100px] pl-3 resize-none"
            type='text'
            name='mealDescription'
            value={mealDescription}
            maxLength={430}
            onChange={handleChange}
            id="mealDescription"
            placeholder="Enter meal description here...." />
        </div>
    );
}