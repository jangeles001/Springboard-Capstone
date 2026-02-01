import { z } from "zod";
import { exerciseZodSchema } from "./exerciseZodSchema.js";

export const newWorkoutZodSchema = z.object({
  creatorPublicId: z.string({
    invalid_type_error: "Creator public Id must be a string!",
    required_error: "A creator public Id must be provided!",
  }),
  workoutName: z
    .string({
      invalid_type_error: "Workout name must be a string!",
      required_error: "Your workout must have a name!",
    })
    .min(1, "Workout name must be at least one character long!")
    .max(60, "A workout name can only be up to 60 characters long!"),
  workoutDuration: z.number({
    invalid_type_error: "Duration must be a number!",
    required_error: "Your workout must have a duration!",
  }),
  exercises: z.array(exerciseZodSchema, {
    invalid_type_error: "Exercises must be an array!",
    required_error: "A workout must have at least one exercise!",
  }),
});
