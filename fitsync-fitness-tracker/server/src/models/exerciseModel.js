import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    exerciseId: { type: String, required: true, unique: true }, // wger ID (UUID)
    name: { type: String, required: true },
    description: { type: String, default: "No description available" }, // normalized description
    category: { type: String }, // ex., strength, cardio, plyometric
    muscles: { type: [String], default: [] }, // primary and secondary muscles
    difficulty: { type: Number, default: 1 }, // AI-computed difficulty score
    met: { type: Number, default: 0 }, // MET value from wger
    equipment: { type: [String], default: ["none (bodyweight exercise)"] },
    aiFeatures: { type: Object, default: {} }, // future AI features
  },
  { timestamps: true }
);

export const Exercise = mongoose.model("Exercise", exerciseSchema);
