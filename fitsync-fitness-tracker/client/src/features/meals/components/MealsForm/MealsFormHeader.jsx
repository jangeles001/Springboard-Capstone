import { useMealsFormContext } from '../../hooks/useMealsFormContext'
import { FormField } from '../../../../components/formField';
import { FormInput } from '../../../../components/formInput';

export function MealsFormHeader() {
    const { mealName, handleChange, formErrors } = useMealsFormContext();

    return (
        <div className="flex flex-col">
            <FormField name="mealName" label="Meal Name" formError={formErrors.mealName}>
                <FormInput
                name="mealName"
                type="text"
                inputValue={mealName}
                inputErrors={formErrors.mealName}
                handleChange={handleChange}
                placeholder="Enter a meal name..."
                 />
            </FormField >
        </div>
    );
}