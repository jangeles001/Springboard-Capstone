import { GoogleGenerativeAI } from "@google/generative-ai";
import * as workoutLogRepo from "../repositories/workoutLogRepo.js";
import * as userRepo from "../repositories/userRepo.js";
import { getEnv } from "../config/envConfig.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";

// Initializes the Google Generative AI client with the API key from environment variables
const genAI = new GoogleGenerativeAI(getEnv("GEMINI_API_KEY"));

export async function generateAiWorkoutRecommendations(userPublicId) {
  // Gets user profile
  const user = await userRepo.findOneUserByPublicId(userPublicId);
  if (!user) throw new UnauthorizedError("USER");

  if (user.lastAiRecommendationAt) {
    const daysSinceLast =
      (Date.now() - new Date(user.lastAiRecommendationAt).getTime()) /
      (1000 * 60 * 60 * 24);

    if (daysSinceLast < 14) {
      // Only allow new recommendations every 2 weeks
      return user.lastAiRecommendations;
    }
  }

  // Gets last 30 days of workout data
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Fetches workout logs for the user in the past 30 days, including total workouts, average duration, and total volume
  const workoutLogs = await workoutLogRepo.findAllWorkoutLogsByUserPublicId(
    userPublicId,
    {
      start: thirtyDaysAgo,
      end: new Date(),
      type: "daily",
    },
  );

  // Gets muscle distribution for past 4 weeks
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  const muscleDistribution =
    await workoutLogRepo.findWorkoutMuscleDistributionByUserPublicId(
      userPublicId,
      {
        start: fourWeeksAgo,
        end: new Date(),
        type: "weekly",
      },
    );

  // Prepares the data for AI
  const userData = {
    profile: {
      age: user.profile.age,
      gender: user.profile.gender,
      goalType: user.profile.goalType,
      activityLevel: user.profile.activityLevel,
    },
    recentActivity: {
      totalWorkouts: workoutLogs.reduce(
        (sum, log) => sum + (log.workoutCount || 0),
        0,
      ),
      avgDuration: calculateAvgDuration(workoutLogs),
      totalVolume: workoutLogs.reduce(
        (sum, log) => sum + (log.totalVolume || 0),
        0,
      ),
    },
    muscleBalance: aggregateMuscleGroups(muscleDistribution),
  };

  // Creates the prompt for the AI model based on the user's profile and recent activity
  const prompt = createWorkoutPrompt(userData);

  // Calls the AI model to generate recommendations
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  });

  // Generate content using the AI model and extract the JSON response
  const result = await model.generateContent(prompt);
  const rawText = result.response.text();

  const jsonText = extractJson(rawText);

  try {
    const recommendations = JSON.parse(jsonText);

    // Save the recommendations and timestamp to the user record
    await userRepo.updateUserLastAiRecommendationAt(userPublicId, {
      lastAiRecommendations: recommendations,
      lastAiRecommendationAt: new Date(),
    });

    return recommendations;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Failed to generate valid recommendations");
  }
}

// Helper function to calculate average workout duration
function calculateAvgDuration(workoutLogs) {
  if (workoutLogs.length === 0) return 0;
  const totalDuration = workoutLogs.reduce(
    (sum, log) => sum + (log.totalDuration || 0),
    0,
  );
  const totalWorkouts = workoutLogs.reduce(
    (sum, log) => sum + (log.workoutCount || 0),
    0,
  );
  return totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
}

// Aggregate muscle groups from distribution data
function aggregateMuscleGroups(muscleDistribution) {
  const aggregated = {};

  // Sums up the counts for each muscle group across all periods
  muscleDistribution.forEach((period) => {
    Object.entries(period.muscleGroups || {}).forEach(([muscle, count]) => {
      aggregated[muscle] = (aggregated[muscle] || 0) + count;
    });
  });

  return aggregated;
}

// Helper function that creates prompt for AI model
function createWorkoutPrompt(userData) {
  const muscleList =
    Object.entries(userData.muscleBalance)
      .sort((a, b) => b[1] - a[1])
      .map(([muscle, count]) => `${muscle}: ${count} exercises`)
      .join(", ") || "No recent data";

  return `You are a professional fitness coach creating personalized workout recommendations.
  USER PROFILE:
  - Age: ${userData.profile.age}
  - Gender: ${userData.profile.gender}
  - Goal: ${userData.profile.goalType}
  - Activity Level: ${userData.profile.activityLevel}

  RECENT ACTIVITY (Past 30 days):
  - Total Workouts: ${userData.recentActivity.totalWorkouts}
  - Average Duration: ${userData.recentActivity.avgDuration} minutes
  - Total Volume: ${userData.recentActivity.totalVolume} lbs

  MUSCLE GROUP DISTRIBUTION (Past 4 weeks):
  ${muscleList}

  TASK: Generate 2 exercise recommendations for the next 2 weeks that:
  1. Address any muscle imbalances (underworked muscle groups)
  2. Align with the user's ${userData.profile.goalType} goal
  3. Match their ${userData.profile.activityLevel} activity level
  4. Progressive difficulty based on recent performance
  5. Each recommendation should include should be less than 4096 tokens in total when combined
  6. Each exercise should exist in the wqer database and be appropriate for the user's profile and goals

  Return ONLY a JSON object with NO markdown, NO code blocks, and NO explanation.
   
  The response MUST match this schema exactly:


  {
    "recommendations": [
      {
        exerciseName: "string",
        "description": "string (1 sentence summary of the exercise and why it's recommended)",
        "targetMuscles": ["string"],
        "estimatedDuration": number (in minutes),
        "exercise": [
          {
            "sets": number,
            "reps": number,
            "restSeconds": number,
          }
        ],
        "reasoning": "string (explain why this workout addresses their needs and imbalances in 1 sentence)"
      }
    ],
    "insights": {
      "muscleImbalances": ["string describing underworked areas in 1 sentence"],
      "progressionTips": "string with advice for next 2 weeks in 1 sentence"
    }
  }`;
}

// Helper function to extract JSON from AI response text
function extractJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in AI response");
  }
  return text.slice(start, end + 1);
}
