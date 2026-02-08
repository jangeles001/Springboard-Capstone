import { User } from "../models/userModel.js";

export async function createNewUser(userData) {
  const newUser = await User.create(userData);
  return newUser.toJSON();
}

export async function findOneUserByEmail(userEmail) {
  return await User.findOne({ email: userEmail });
}

export async function findOneUserByUUID(userUUID) {
  return await User.findOne({ uuid: userUUID });
}

export async function findOneUserByPublicId(publicId) {
  const user = await User.findOne({ publicId });
  if (!user) return null;
  return user.toJSON();
}

export async function updateMultipleUserFieldsByUUID(userUUID, updatedFields) {
  return await User.findOneAndUpdate(
    { uuid: userUUID },
    { $set: updatedFields },
    { new: true, runValidators: true },
  );
}

export async function updatePasswordHashByUUID(){
  return await User.findOneAndUpdate(
    { uuid: userUUID },
    { $set: { passwordHash: newPasswordHash } },
    { new: true, runValidators: true },
  );
}

export async function updateUserLastAiRecommendationAt(userPublicId, updatedFields) {
  return await User.findOneAndUpdate(
    { publicId: userPublicId },
    { $set: updatedFields },
    { new: true },
  );
}
