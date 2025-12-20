import { z } from "zod";
import { mealIngredientSchema } from "./mealIngredientZodSchema.js";
import { mealMacrosZodSchema } from "./mealMacrosZodSchema.js";

    export const newMealZodSchema = z.object({
        creatorPublicId: z
        .string({
            required_error: "Creator Public Id is required!",
            invalid_type_error: "Creator public id must be a string!"
        }),
        mealName: z
        .string({
            required_error: "Meal name is required!"
        }),
        mealDescription: z
        .string({
            required_error: "Meal description is required!"
        }),
        ingredients: z
        .array(mealIngredientSchema,{ 
            required_error: "Ingredients are required!",
            invalid_type_error: "Ingredients must be an array!"
        })
        .min(1," At least one ingredient is required!"),
        mealMacros: mealMacrosZodSchema
        .optional()
        .refine(
            val => val !== undefined,
                { message: "Macros are required!" },
        )
    });
