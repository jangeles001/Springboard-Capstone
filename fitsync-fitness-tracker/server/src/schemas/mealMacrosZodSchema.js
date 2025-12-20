import { z } from "zod";

export const mealMacrosZodSchema = z.object({
    protein: z
    .number({
        required_error: "Protein is required!",
        invalid_type_error: "Protein value must be a number!"
    })
    .min(0,"Protein value cannot be negative!"),
    fat: z
    .number({
        required_error: "Fat is required!",
        invalid_type_error: "Fat value must be a number!"
    })
    .min(0,"Fat value cannot be negative!"),
    carbs: z
    .number({
        required_error: "Carbs is required!",
        invalid_type_error: "Carbs value must be a number!"
    })
    .min(0,"Carbs value cannot be negative!"),
    fiber: z
    .number({
        required_error: "Fiber is required!",
        invalid_type_error: "Fiber value must be a number!"
    })
    .min(0,"Fiber value cannot be negative!"),
    netCarbs: z
    .number({
        required_error: "Net carbs is required!",
        invalid_type_error: "Carbs value must be a number!"
    })
    .min(0,"Net carbs value cannot be negative!"),
    calories: z
    .number({
        required_error: "Calories is required!",
        invalid_type_error: "Calories value must be a number!"
    })
    .min(0,"Calories value cannot be negative!"),
})