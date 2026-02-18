import { useMealsFormContext } from '../../hooks/useMealsFormContext'
import { FormField } from '../../../../components/FormField';
import { FormInput } from '../../../../components/FormInput';

export function MealsFormHeader() {
    const { mealName, handleChange, formErrors } = useMealsFormContext();

    return (
        <div className="border-b pb-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Meal Details
            </h2>

            <FormField
            name="mealName"
            label="Meal Name"
            formError={formErrors?.mealName}
            >
                <FormInput
                name="mealName"
                type="text"
                inputValue={mealName}
                inputErrors={formErrors?.mealName}
                handleChange={handleChange}
                placeholder="Chicken bowl, protein shake..."
                data-testid="meal-name-input"
                />
            </FormField>
        </div>
    );
}