import { optional, z } from "zod";

export const exerciseZodSchema = z.object({
  exerciseId: z.string({
    invalid_type_error: "An exercise Id must be a string!",
    required_error: "An exercise Id is required!",
  }),
  exerciseName: z.string({
    invalid_type_error: "The exercise name must be a string!",
    required_error: "The name of the exercise is required!",
  }),
  muscles: z.array({
    invalid_type_error: "Muscles must be an array of strings!",
    required_error: "Muscles array is needed for AI functionality!" 
  }),
  description: z.string({
    invalid_type_error: "The description must be a string!",
    required_error: "A exercise description is required!",
  }),
  difficultyAtCreation: z.number({
    invalid_type_error: "The difficulty at creation must be a number!",
    required_error: "The difficulty at creationg is required!",
  }), // snapshot of difficulty at workout creation
  reps: z
    .number({
      invalid_type_error: "Reps must be a number!",
      required_error: "Number of reps is required!",
    })
    .min(0, "Reps cannot be a negative number!"),
  weight: z
    .number({
      invalid_type_error: "Weight must be a number!",
    })
    .min(0, "Weight cannot be a negative number!")
    .optional(),
  duration: z
    .number({
      invalid_type_error: "Duration must be a number!",
    })
    .min(0, "Duration cannot be a negative number!")
    .optional(),
});
