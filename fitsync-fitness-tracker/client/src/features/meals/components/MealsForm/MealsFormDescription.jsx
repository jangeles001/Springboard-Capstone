import { FormField } from '../../../../components/FormField';
import { useMealsFormContext } from '../../hooks/useMealsFormContext'

export function MealsFormDescription() {
    const { mealDescription, formErrors, handleChange } = useMealsFormContext();

    return (
        <div className="flex flex-col">
            <FormField name="mealDescription" label="Meal Description" formError={formErrors?.mealDescription}>
                <textarea
                className={` ${formErrors?.mealDescription ? 'form-input-error' : 'form-input'} 
                flex border rounded resize-none min-h-[120px] w-full`}
                type='text'
                name='mealDescription'
                value={mealDescription}
                maxLength={430}
                onChange={handleChange}
                id="mealDescription"
                placeholder="Enter meal description...." 
                data-testid="meal-description-input"
                />
            </FormField>
        </div>
    );
}