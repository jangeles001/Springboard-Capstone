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

  let groupId;
  let label;

  switch (type) {
    case "daily":
      groupId = {
        day: { $dateToString: { format: "%Y-%m-%d", date: "$executedAt" } },
      };
      label = "$_id.day";
      break;

    case "weekly":
      groupId = {
        isoWeek: { $isoWeek: "$executedAt" },
        year: { $isoWeekYear: "$executedAt" },
      };
      label = {
        $concat: [
          { $toString: "$_id.isoWeek" },
          "-",
          { $toString: "$_id.year" },
        ],
      };
      break;

    case "monthly":
      groupId = {
        month: { $dateToString: { format: "%Y-%m", date: "$executedAt" } },
      };
      label = "$_id.month";
      break;

    default:
      throw new Error(`Unsupported range type: ${type}`);
  }

  return WorkoutLog.aggregate([
    {
      $match: {
        userPublicId,
        executedAt: { $gte: start, $lt: end },
        isDeleted: false,
      },
    },

    // 🔹 Compute per-workout totals FIRST
    {
      $addFields: {
        workoutVolume: {
          $sum: {
            $map: {
              input: "$exercisesSnapshot",
              as: "ex",
              in: {
                $multiply: [
                  { $ifNull: ["$$ex.reps", 0] },
                  { $ifNull: ["$$ex.weight", 0] },
                ],
              },
            },
          },
        },
        workoutReps: {
          $sum: {
            $map: {
              input: "$exercisesSnapshot",
              as: "ex",
              in: { $ifNull: ["$$ex.reps", 0] },
            },
          },
        },
        workoutDuration: {
          $sum: {
            $map: {
              input: "$exercisesSnapshot",
              as: "ex",
              in: { $ifNull: ["$$ex.duration", 0] },
            },
          },
        },
      },
    },

    // 🔹 Group workouts into time buckets
    {
      $group: {
        _id: groupId,
        workoutCount: { $sum: 1 },
        totalVolume: { $sum: "$workoutVolume" },
        totalReps: { $sum: "$workoutReps" },
        totalDuration: { $sum: "$workoutDuration" },
      },
    },

    // 🔹 Shape for charts
    {
      $project: {
        _id: 0,
        label,
        workoutCount: 1,
        totalVolume: 1,
        totalReps: 1,
        totalDuration: 1,
        avgWorkoutVolume: {
          $cond: [
            { $eq: ["$workoutCount", 0] },
            0,
            { $divide: ["$totalVolume", "$workoutCount"] },
          ],
        },
      },
    },

    { $sort: { label: 1 } },
  ]);
}
