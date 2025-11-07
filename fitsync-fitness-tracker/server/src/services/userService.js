import * as userRepo  from "../repositories/userRepo.js"
import jwt from "jsonwebtoken"
import { generateSalt, hashPassword, verifyPassword } from "../utils/hash.js"
import { getEnv } from "../validators/validateConfig.js"

export async function registerNewUser(userData){
    // Checks if a user has already registered with the provided email
    const user = await userRepo.findOneUserByEmail(userData.email);
    if(user) throw new Error("EMAIL_ALREADY_REGISTERED");

    // Password Encryption
    const salt = await generateSalt();
    const passwordHash = await hashPassword(userData.password, salt);
    
    delete userData.password; // Removes the unhashed password from the userData object
    userData = { ...userData, passwordHash } // Adds the hashed password to the userData object

    // Creates newUser object with passwordHash and salt
    const newUser = await userRepo.createNewUser(userData);

    // Creates JWT payload and token signed with server JWT_SECRET. Tokens will expire after an hour.
    const payload = { sub: newUser.uuid.toString(), username: newUser.username };
    const token = jwt.sign(payload, getEnv("JWT_SECRET"), { expiresIn: "1h" });


    return { username: newUser.username, uuid: newUser.uuid, token };
}

export async function validateCredentials(email, password){
    // Checks if user email has been registered
    const user = await userRepo.findOneUserByEmail(email);
    if(!user) throw new Error("INVALID_CREDENTIALS");

    // Verifies password is correct
    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) throw new Error("INVALID_CREDENTIALS");

    // Creates JWT payload and token signed with server JWT_SECRET. Tokens will expire after an hour.
    const payload = { sub: user.uuid.toString(), username: user.username };
    const token = jwt.sign(payload, getEnv("JWT_SECRET"), { expiresIn: "1h" });

    return { username: user.username, uuid: user.uuid, token }
}