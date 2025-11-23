import userService from "../services/userService.js"

export async function getPrivateUserInformation(req, res) {
    try{
        const userUUID  = req.user.sub; 
        const privateUserInformation = await userService.getPrivateUserInformation(userUUID);
        return res.status(200).json({ userInfo: privateUserInformation });

    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

export async function updatePrivateUserInformationController(req, res){
    try{
        const userUUID = req.user.sub;
        const updatedFields = req.validatedBody;
        const updatedUserInformation = await updatePrivateUserInformation(userUUID, updatedFields);
        return res.status(200).json({ message: "Information Updated Successfully!", updatedUserInformation});
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

// TODO
export async function getUserCreatedWorkouts(){};
export async function getUserCreatedMeals(){};