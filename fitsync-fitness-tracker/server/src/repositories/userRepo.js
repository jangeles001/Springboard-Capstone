import { User } from "../models/userModel.js"

export async function findOneUserByEmail(userEmail){
    return await User.findOne({ email: userEmail});
}

export async function findOneUserByUUID(userUUID){
    return await User.findOne({ uuid: userUUID })
}

export async function createNewUser(userData){
    return await User.create(userData);
}