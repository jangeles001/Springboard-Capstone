import * as userService from "../services/userService.js";

export async function getPublicUserInformationController(req, res) {
  try {
    const { userPublicId } = req.params;
    const publicUserInformation = await userService.getPublicUserInformation(
      userPublicId
    );
    return res.status(200).json({ userInfo: publicUserInformation });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND")
      return res.status(404).json({ error: error.message });
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
    const updatedUserInformation =
      await userService.updatePrivateUserInformation(userUUID, updatedFields);
    return res.status(200).json({
      message: "Information Updated Successfully!",
      userInfo: updatedUserInformation,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getUserWorkoutsController(req, res) {
  try {
    const { userPublicId } = req.params;
    const userWorkouts = await userService.getUserWorkouts(userPublicId);
    return res.status(200).json({ userWorkouts });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND")
      return res.status(404).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
}

export async function getUserMealsController(req, res) {
  try {
    const { userPublicId } = req.params;
    const userMeals = await userService.getUserMeals(userPublicId);
    return res.status(200).json({ userMeals });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND")
      return res.status(404).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
}
