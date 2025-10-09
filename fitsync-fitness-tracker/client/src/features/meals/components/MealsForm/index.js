import { MealsFormComposer as MealsForm } from "./MealsFormComposer";
import { MealsFormHeader } from "./MealsFormHeader";
import { MealsFormIngredientSearch } from "./MealsFormIngredientSearch";
import { MealsFormIngredients } from "./MealsFormIngredients";
import { MealsFormMacros } from "./MealsFormMacros";

// Attaching subcomponents to the main form component
MealsForm.Header = MealsFormHeader;
MealsForm.IngredientSearch = MealsFormIngredientSearch;
MealsForm.Ingredients = MealsFormIngredients;
MealsForm.Macros = MealsFormMacros;

export { MealsForm };
