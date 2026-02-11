import { MealLog } from "../models/mealLogModel.js";

export async function createOneMealLogEntry(mealLogData) {
  await MealLog.create(mealLogData);
  return;
}

export async function updateOneMealLogEntryByUUID(mealUUID, logId) {
  await MealLog.findOneAndUpdate(
    { mealUUID },
    { $set: { isDeleted: true, correctedFromLogId: logId } },
  );
  return;
}

export async function findOneMealLogByMealId(mealId) {
  return MealLog.findOne({ sourceMealUUID: mealId });
}

export async function findAllMealLogsByUserPublicId(userPublicId, range) {
  const { start, end, type } = range;

  // Determine group _id by range
  let groupId;
  switch (type) {
    case "daily":
      groupId = {
        day: { $dateToString: { format: "%Y-%m-%d", date: "$consumedAt" } },
      };
      break;
    case "weekly":
      groupId = {
        isoWeek: { $isoWeek: "$consumedAt" },
        year: { $isoWeekYear: "$consumedAt" },
      };
      break;
    case "monthly":
      groupId = {
        month: { $dateToString: { format: "%Y-%m", date: "$consumedAt" } },
      };
      break;
    default:
      throw new Error(`Unsupported range type: ${type}`);
  }

  const mealLogs = await MealLog.aggregate([
    {
      $match: {
        creatorPublicId: userPublicId,
        consumedAt: { $gte: start, $lt: end },
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: groupId,
        calories: { $sum: "$macrosSnapshot.calories" },
        protein: { $sum: "$macrosSnapshot.protein" },
        carbs: { $sum: "$macrosSnapshot.carbs" },
        fat: { $sum: "$macrosSnapshot.fat" },
      },
    },
    {
      $project: {
        label:
          type === "daily"
            ? "$_id.day"
            : type === "monthly"
              ? "$_id.month"
              : {
                  $concat: [
                    { $toString: "$_id.isoWeek" },
                    "-",
                    { $toString: "$_id.year" },
                  ],
                },
        calories: 1,
        protein: 1,
        carbs: 1,
        fat: 1,
        _id: 0,
      },
    },
    { $sort: {  "_id.year": 1, "_id.isoWeek": 1 } },
  ]);

  return mealLogs;
}

export async function updateDeletedMealLogStatus(
  sourceMealUUID,
  isDeleted,
) {
  await MealLog.updateMany(
    { sourceMealUUID },
    { $set: { isDeleted } },
  );

  return;
}
