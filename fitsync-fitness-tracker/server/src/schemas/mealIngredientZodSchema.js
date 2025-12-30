import { z } from "zod";
import { mealMacrosZodSchema } from "./mealMacrosZodSchema.js";

export const mealIngredientZodSchema = z.object({
  ingredientId: z.string({
    required_error: "Ingredient id is required!",
    invalid_type_error: "Ingredient id must be a string!",
  }),
  ingredientName: z
    .string({
      required_error: "Ingredient name is required!",
      invalid_type_error: "Ingredient name must be a string!",
    })
    .min(1, "Ingredient name is required"),
  quantity: z
    .number({
      required_error: "Quantity is required!",
      invalid_type_error: "Quantity must be a number!",
    })
    .positive("Amount must be greater than 0"),

  macros: mealMacrosZodSchema
    .optional()
    .refine((val) => val !== undefined, { message: "Macros are required!" }),
  caloriesPer100G: z
    .number({
      required_error: "Calories per 100 grams is required!",
      invalid_type_error: "Caloires per 100 grams must be a number",
    })
    .positive("Calories per 100 grams cannot be negative!"),
  macrosPer100G: mealMacrosZodSchema
    .optional()
    .refine((val) => val !== undefined, { message: "Macros are required!" }),
});
