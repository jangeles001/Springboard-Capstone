import * as userRepo  from "../repositories/userRepo.js"

export async function registerNewUser(userData){
    // Checks if a user has already registered with the provided email
    let newUser = userRepo.findOneUserByEmail(userData.email);
    if(user) throw new Error("EMAIL_ALREADY_REGISTERED");

    // Password Encryption
    const salt = await generateSalt();
    const passwordHash = await hashPassword(userData.password, salt);
    
    delete userData.password; // Removes the unhashed password from the userData object
    userData = { ...userData, passwordHash } // Adds the hashed password to the userData object

    // Creates newUser object with passwordHash and salt
    newUser = await userRepo.createNewUser(userData);

     // Creates JWT payload and token signed with server JWT_SECRET. Tokens will expire after an hour.
    const payload = { sub: newUser.uuid.toString(), username: newUser.username };
    const token = jwt.sign(payload, getENV(JWT_SECRET), { expiresIn: "1h" });


    return { newUser, token };
}