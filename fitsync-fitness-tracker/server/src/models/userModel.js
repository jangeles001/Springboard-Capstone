import mongoose from "mongoose";

// Mongoose schema definition
const userSchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true, unique: true },
    publicId: { type: String, required: true, unique: true },
    firstName: { type: String, minlength: 1, required: true, trim: true },
    lastName: { type: String, minlength: 1, required: true, trim: true },
    username: { type: String, minlength: 4, required: true, trim: true },
    passwordHash: { type: String, required: true },
    height: { type: String, minlength: 4, required: true, trim: true },
    age: { type: Number, min: 18, required: true },
    weight: { type: Number, min: 70, required: true },
    gender: { 
      type: String,
      enum: ["male", "female", "prefer_not_to_say"],
      required: true,
      trim: true
      },
    email: {
      type: String,
      minlength: 7,
      required: true,
      unique: true,
      trim: true,
    },
    promoConsent: { type: Boolean, required: true },
    agreeToTerms: { type: Boolean, required: true },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: function (doc, ret, options){
    delete ret._id;
    delete ret.__v;
    delete ret.updatedAt;
    return ret;
  }
})

// Generates Mongoose model
export const User = mongoose.model("User", userSchema);
