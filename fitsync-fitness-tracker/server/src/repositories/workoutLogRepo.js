import { WorkoutLog } from "../models/WorkoutLogModel.js";

const PRIVATE_FIELDS_EXCLUSIONS = "-_id -createdAt -updatedAt";

export async function createOneWorkoutLogEntry(workoutLogData) {
  await WorkoutLog.create(workoutLogData);
  return;
}

export async function updateOneWorkoutLogEntryByUUID(workoutUUID, logId) {
  await WorkoutLog.findOneAndUpdate(
    { workoutUUID },
    { $set: { isDeleted: true, correctedFromLogId: logId } }
  );
  return;
}

export async function findAllWorkoutLogsByUserPublicId(userPublicId, range) {
  const { start, end, type } = range;

  // Determine group _id by range
  let groupId;
  switch (type) {
    case "daily":
      groupId = {
        day: { $dateToString: { format: "%Y-%m-%d", date: "$executedAt" } },
      };
      break;
    case "weekly":
      groupId = {
        isoWeek: { $isoWeek: "$executedAt" },
        year: { $isoWeekYear: "$executedAt" },
      };
      break;
    case "monthly":
      groupId = {
        month: { $dateToString: { format: "%Y-%m", date: "$executedAt" } },
      };
      break;
    default:
      throw new Error(`Unsupported range type: ${type}`);
  }

  const workoutLogs = await WorkoutLog.aggregate([
    {
      $match: {
        userPublicId,
        executedAt: { $gte: start, $lt: end },
        isDeleted: false,
      },
    },
    { $unwind: "$exercisesSnapshot" }, // each exercise is counted individually
    {
      $group: {
        _id: groupId,
        totalVolume: {
          $sum: {
            $multiply: [
              { $ifNull: ["$exercisesSnapshot.reps", 0] },
              { $ifNull: ["$exercisesSnapshot.weight", 0] },
            ],
          },
        },
        totalDuration: {
          $sum: { $ifNull: ["$exercisesSnapshot.duration", 0] },
        },
        totalReps: { $sum: { $ifNull: ["$exercisesSnapshot.reps", 0] } },
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
        totalVolume: 1,
        totalDuration: 1,
        totalReps: 1,
        _id: 0,
      },
    },
    { $sort: { label: 1 } },
  ]);

  return { workoutLogs };
}
