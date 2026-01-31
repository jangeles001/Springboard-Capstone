import { WorkoutLog } from "../models/workoutLogModel.js";

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
          weekStart: {
            $dateTrunc: {
              date: "$executedAt",
              unit: "week",
              binSize: 1,
              timezone: "UTC",
            },
          },
        };
        label = {
          $dateToString: {
            format: "%Y-'W'%V",
            date: "$_id.weekStart",
          },
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
          creatorPublicId: userPublicId,
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
          workoutDuration: "$workoutDuration",
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

export async function findWorkoutMuscleDistributionByUserPublicId(userPublicId, range) {
  const { start, end, type } = range;

  let periodGroup;
  let labelFormat;

  switch (type) {
    case "weekly":
      periodGroup = { $dateTrunc: { date: "$executedAt", unit: "week", timezone: "UTC" } };
      labelFormat = { $dateToString: { format: "%Y-'W'%V", date: "$_id" } };
      break;
    case "monthly":
      periodGroup = { $dateTrunc: { date: "$executedAt", unit: "month", timezone: "UTC" } };
      labelFormat = { $dateToString: { format: "%Y-%m", date: "$_id" } };
      break;
    default:
      throw new Error("Only weekly and monthly ranges are supported for AI insights.");
  }

  return WorkoutLog.aggregate([
    { $match: { creatorPublicId: userPublicId, executedAt: { $gte: start, $lt: end }, isDeleted: false } },

    { $unwind: "$exercisesSnapshot" },

    // Each muscle listed contributes individually
    { $unwind: "$exercisesSnapshot.muscles" },

    // Optional: ignore unknown
    // { $match: { "exercisesSnapshot.muscles": { $ne: "unknown" } } },

    { $group: {
        _id: { period: periodGroup, muscle: "$exercisesSnapshot.muscles" },
        exerciseCount: { $sum: 1 },
    }},

    { $group: {
        _id: "$_id.period",
        muscleGroups: { $push: { k: "$_id.muscle", v: "$exerciseCount" } },
        totalExercises: { $sum: "$exerciseCount" },
    }},

    { $project: { _id: 0, label: labelFormat, totalExercises: 1, muscleGroups: { $arrayToObject: "$muscleGroups" } } },

    { $sort: { label: 1 } }
  ]);
}

export async function updateUserDeletedWorkoutLogStatus(publicId, workoutUUID, isDeleted) {
  await WorkoutLog.updateOne(
    { creatorPublicId: publicId, workoutUUID },
    { $set: { isDeleted } }
  );

  return;
}