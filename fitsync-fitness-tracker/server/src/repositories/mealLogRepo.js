import { MealLog } from "../models/mealLogModel.js";

const PRIVATE_FIELDS_EXCLUSIONS = "-_id -createdAt -updatedAt";

export async function createOneMealLogEntry(mealLogData) {
  await MealLog.create(mealLogData);
  return;
}

export async function updateOneMealLogEntryByUUID(mealUUID, logId) {
  await MealLog.findOneAndUpdate(
    { mealUUID },
    { $set: { isDeleted: true, correctedFromLogId: logId } }
  );
  return;
}

export async function findAllMealLogsByCreatorPublicId(userPublicId) {
  const mealLogs = await MealLog.find({ userPublicId })
    .select(PRIVATE_FIELDS_EXCLUSIONS)
    .lean();
  const totalCount = MealLog.countDocuments({ userPublicId });

  return { mealLogs, totalCount };
}
