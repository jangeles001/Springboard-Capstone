import { useState } from "react";
import { MealsForm } from '../components/MealsForm/index'

export default function MealsCreator() {

    const [ isOpen, setIsOpen ] = useState(false); // State for dropdown

    return (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-screen min-h-min">
            <h1 className='flex text-white justify-center text-4xl pt-10 pb-10'>Enter Meal Information</h1>
            <div className="flex flex-col items-center justify-center bg-gray-100 max-h-min min-w-screen">
                <MealsForm>
                    <MealsForm.Header />
                    <MealsForm.Description />
                    <MealsForm.IngredientSearch isOpen={isOpen} setIsOpen={setIsOpen} />
                    <MealsForm.Ingredients />
                    <MealsForm.Macros />
                    <MealsForm.Footer />
                </MealsForm>
            </div>
        </div>
    )
}