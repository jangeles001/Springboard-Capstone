import { z } from "zod"

export const envConfigZodSchema = z.object({ 
    CLIENT_ORIGIN: z.string(),
    PORT: z.string().regex(/^\d+$/).transform(Number),
    JWT_SECRET: z.string().min(8, "JWT_SECRET needs to be at minimum 8 characters")
});