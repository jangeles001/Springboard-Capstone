import { useState } from "react";
// import { useMealsForm } from "../../../hooks/useMealsForm"
// import useSearch from "../../../hooks/useSearch";
// import IngredientItem from "./IngredientItem";
// import ResultItem from "./ResultItem";
import { MealsForm } from '../components/MealsForm/index'

export default function MealsCreator() {

    const [ isOpen, setIsOpen ] = useState(false); // State for dropdown

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 h-screen min-w-screen">
        <MealsForm>
            <MealsForm.Header />
            <MealsForm.IngredientSearch isOpen={isOpen} setIsOpen={setIsOpen} />
            <MealsForm.Ingredients />
            <MealsForm.Macros />
        </MealsForm>
        </div>
        )
}