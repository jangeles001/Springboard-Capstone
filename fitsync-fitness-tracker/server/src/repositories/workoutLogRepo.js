import { WorkoutLog } from "../models/workoutLogModel.js";

const PRIVATE_FIELDS_EXCLUSIONS = "-_id -createdAt -updatedAt";

export async function createOneWorkoutLogEntry(workoutLogData) {
  await WorkoutLog.create(workoutLogData);
  return;
}

export async function updateOneWorkoutLogEntryByUUID(workoutUUID, logId) {
  await WorkoutLog.findOneAndUpdate(
    { workoutUUID },
    { $set: { isDeleted: true, correctedFromLogId: logId } },
  );
  return;
}

export async function findOneWorkoutLogByWorkoutId(workoutId) {
  return WorkoutLog.findOne({ sourceWorkoutUUID: workoutId });
}

export async function findAllWorkoutLogsByUserPublicId(userPublicId, range) {
  const { start, end, type } = range;

  let truncUnit;

  switch (type) {
    case "daily":
      truncUnit = "day";
      break;
    case "weekly":
      truncUnit = "week";
      break;
    case "monthly":
      truncUnit = "month";
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

    // Normalize to bucket date
    {
      $addFields: {
        periodStart: {
          $dateTrunc: {
            date: "$executedAt",
            unit: truncUnit,
            timezone: "UTC",
          },
        },
      },
    },

    // Per-workout calculations
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
        muscleVolumePairs: {
          $filter: {
            input: {
              $map: {
                input: "$exercisesSnapshot",
                as: "ex",
                in: {
                  k: {
                    $cond: [
                      {
                        $gt: [{ $size: { $ifNull: ["$$ex.muscles", []] } }, 0],
                      },
                      { $arrayElemAt: ["$$ex.muscles", 0] },
                      null,
                    ],
                  },
                  v: {
                    $multiply: [
                      { $ifNull: ["$$ex.reps", 0] },
                      { $ifNull: ["$$ex.weight", 0] },
                    ],
                  },
                },
              },
            },
            as: "pair",
            cond: { $ne: ["$$pair.k", null] },
          },
        },
      },
    },

    // Group per period
    {
      $group: {
        _id: "$periodStart",
        workoutCount: { $sum: 1 },
        totalVolume: { $sum: "$workoutVolume" },
        totalReps: { $sum: "$workoutReps" },
        totalDuration: { $sum: "$workoutDuration" },
        muscleVolume: { $push: "$muscleVolumePairs" },
      },
    },

    // Merge muscle maps
    {
      $addFields: {
        muscleVolume: {
          $reduce: {
            input: "$muscleVolume",
            initialValue: {},
            in: {
              $mergeObjects: [
                "$$value",
                {
                  $arrayToObject: {
                    $map: {
                      input: "$$this",
                      as: "m",
                      in: [
                        "$$m.k",
                        {
                          $add: [
                            "$$m.v",
                            {
                              $ifNull: [
                                {
                                  $getField: {
                                    field: "$$m.k",
                                    input: "$$value",
                                  },
                                },
                                0,
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },

        avgVolumePerMinute: {
          $cond: [
            { $eq: ["$totalDuration", 0] },
            0,
            { $divide: ["$totalVolume", "$totalDuration"] },
          ],
        },
      },
    },

    // Final projection
    {
      $project: {
        _id: 0,
        periodStart: "$_id",
        label: {
          $dateToString: {
            date: "$_id",
            format:
              type === "daily"
                ? "%Y-%m-%d"
                : type === "weekly"
                  ? "%Y-'W'%V"
                  : "%Y-%m",
          },
        },

        workoutCount: 1,
        totalVolume: 1,
        totalReps: 1,
        totalDuration: 1,
        avgVolumePerMinute: 1,
        muscleVolume: 1,
      },
    },

    { $sort: { periodStart: 1 } },
  ]);
}

export async function findWorkoutMuscleDistributionByUserPublicId(
  userPublicId,
  range,
) {
  const { start, end, type } = range;

  let periodGroup;
  let labelFormat;

  switch (type) {
    case "weekly":
      periodGroup = {
        $dateTrunc: { date: "$executedAt", unit: "week", timezone: "UTC" },
      };
      labelFormat = { $dateToString: { format: "%Y-'W'%V", date: "$_id" } };
      break;
    case "monthly":
      periodGroup = {
        $dateTrunc: { date: "$executedAt", unit: "month", timezone: "UTC" },
      };
      labelFormat = { $dateToString: { format: "%Y-%m", date: "$_id" } };
      break;
    default:
      throw new Error(
        "Only weekly and monthly ranges are supported for AI insights.",
      );
  }

  return WorkoutLog.aggregate([
    {
      $match: {
        creatorPublicId: userPublicId,
        executedAt: { $gte: start, $lt: end },
        isDeleted: false,
      },
    },

    { $unwind: "$exercisesSnapshot" },

    // Each muscle listed contributes individually
    { $unwind: "$exercisesSnapshot.muscles" },

    // Ignore unknown
    // { $match: { "exercisesSnapshot.muscles": { $ne: "unknown" } } },

    {
      $group: {
        _id: { period: periodGroup, muscle: "$exercisesSnapshot.muscles" },
        exerciseCount: { $sum: 1 },
      },
    },

    {
      $group: {
        _id: "$_id.period",
        muscleGroups: { $push: { k: "$_id.muscle", v: "$exerciseCount" } },
        totalExercises: { $sum: "$exerciseCount" },
      },
    },

    {
      $project: {
        _id: 0,
        label: labelFormat,
        totalExercises: 1,
        muscleGroups: { $arrayToObject: "$muscleGroups" },
      },
    },

    { $sort: { label: 1 } },
  ]);
}

export async function updateDeletedWorkoutLogStatus(
  sourceWorkoutUUID,
  isDeleted,
) {
  await WorkoutLog.updateMany({ sourceWorkoutUUID }, { $set: { isDeleted } });
5
  return;
}
