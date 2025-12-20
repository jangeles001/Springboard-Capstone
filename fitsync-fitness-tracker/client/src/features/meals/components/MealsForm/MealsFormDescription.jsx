import { FormField } from '../../../../components/formField';
import { useMealsFormContext } from '../../hooks/useMealsFormContext'

export function MealsFormDescription() {
    const { mealDescription, formErrors, handleChange } = useMealsFormContext();

    return (
        <div className="flex flex-col">
            <FormField name="mealDescription" label="Meal Description" formError={formErrors.mealDescription}>
                <textarea
                className={` ${formErrors.mealDescription ? 'form-input-error' : 'form-input'} flex border rounded max-w-[575px] min-h-[100px] pl-3 resize-none`}
                type='text'
                name='mealDescription'
                value={mealDescription}
                maxLength={430}
                onChange={handleChange}
                id="mealDescription"
                placeholder="Enter meal description here...." />
            </FormField>
        </div>
    );
}