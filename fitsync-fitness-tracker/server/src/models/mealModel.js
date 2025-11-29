import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const mealSchema = new mongoose.Schema(
    {
        mealId: { type: String, default: uuidv4, required: true, unique: true},
        mealName: { type: String, required: true },
        description: { type: String, required: true },
        protein: {type: Number, required: true },
        fat: { type: Number, required: true },
        carbs: { type: Number, required: true },
        fiber: { type: Number, required: true },
        netCarbs: { type: Number, required: true },
        calories: { type: Number, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("Meal", mealSchema);