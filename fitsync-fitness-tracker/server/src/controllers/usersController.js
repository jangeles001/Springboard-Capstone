import * as userService from "../services/userService.js";

export async function getPublicUserInformationController(req, res) {
  try {
    const userUUID = req.user.sub;
    const publicUserInformation = await userService.getPublicUserInformation(
      userUUID
    );
    return res.status(200).json({ userInfo: publicUserInformation });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getPrivateUserInformationController(req, res) {
  try {
    const userUUID = req.user.sub;
    const privateUserInformation = await userService.getPrivateUserInformation(
      userUUID
    );
    return res.status(200).json({ userInfo: privateUserInformation });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function updatePrivateUserInformationController(req, res) {
  try {
    const userUUID = req.user.sub;
    const updatedFields = req.validatedBody;
    const updatedUserInformation = await updatePrivateUserInformation(
      userUUID,
      updatedFields
    );
    return res.status(200).json({
      message: "Information Updated Successfully!",
      updatedUserInformation,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// TODO
export async function getUserCreatedWorkouts() {}
export async function getUserCreatedMeals() {}
