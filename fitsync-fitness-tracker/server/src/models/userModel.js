import mongoose from "mongoose";

const ACTIVITY_LEVELS = [
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
];
const GOAL_TYPES = ["cut", "maintain", "bulk"];

// Mongoose schema definition
const userSchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true, unique: true },
    publicId: { type: String, required: true, unique: true },
    firstName: { type: String, minlength: 1, required: true, trim: true },
    lastName: { type: String, minlength: 1, required: true, trim: true },
    username: { type: String, minlength: 4, required: true, trim: true },
    passwordHash: { type: String, required: true },
    email: {
      type: String,
      minlength: 7,
      required: true,
      unique: true,
      trim: true,
    },
    promoConsent: { type: Boolean, required: true },
    agreeToTerms: { type: Boolean, required: true },

    // Structured profile inputs
    profile: {
      heightInches: { type: Number, required: true }, //inches
      weightLbs: { type: Number, required: true }, // lbs
      age: { type: Number, min: 18, required: true },
      gender: {
        type: String,
        enum: ["male", "female", "prefer_not_to_say"],
        required: true,
      },
      activityLevel: { type: String, enum: ACTIVITY_LEVELS, required: true },
      goalType: { type: String, enum: GOAL_TYPES, required: true },
    },

    // Calculated nutrition goals (read-only from frontend)
    nutritionGoals: {
      calories: { type: Number, required: true },
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fats: { type: Number, required: true },
      calculatedAt: { type: Date, required: true },
      formulaVersion: { type: String, required: true },
    },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    delete ret.updatedAt;
    return ret;
  },
});

// Generates Mongoose model
export const User = mongoose.models.User || mongoose.model("User", userSchema);
