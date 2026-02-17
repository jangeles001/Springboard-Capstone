import { useState } from "react";
import { MealsForm } from '../components/MealsForm/index'

export default function MealsBuilderPage() {

  const [ isOpen, setIsOpen ] = useState(false); // State for dropdown

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">


      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Create Meal
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Add ingredients and automatically calculate nutrition macros.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <MealsForm>
          <MealsForm.Header />
          <MealsForm.Description />
          <MealsForm.IngredientSearch
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
          <MealsForm.Ingredients />
          <MealsForm.Macros />
          <MealsForm.Footer />
        </MealsForm>
      </div>
    </div>
  );
}