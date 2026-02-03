import { GoogleGenerativeAI } from '@google/generative-ai';
import * as workoutLogRepo from '../repositories/workoutLogRepo.js';
import { getEnv } from '../config/envConfig.js';

const genAI = new GoogleGenerativeAI(getEnv('GEMINI_API_KEY'));

export async function generateAiWorkoutRecommendations(userPublicId) {
  // Get last 30 days of workout data
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.now() - 30);

  await userService.updateUserLastAiRecommendationAt(userPublicId);

  const workoutLogs = await workoutLogRepo.findAllWorkoutLogsByUserPublicId(
    userPublicId,
    {
      start: thirtyDaysAgo,
      end: new Date(),
      type: 'daily',
    }
  );

  // Get muscle distribution for past 4 weeks
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  const muscleDistribution = await workoutLogRepo.findWorkoutMuscleDistributionByUserPublicId(
    userPublicId,
    {
      start: fourWeeksAgo,
      end: new Date(),
      type: 'weekly',
    }
  );

  // Prepare the data for AI
  const userData = {
    profile: {
      age: user.profile.age,
      gender: user.profile.gender,
      goalType: user.profile.goalType,
      activityLevel: user.profile.activityLevel,
    },
    recentActivity: {
      totalWorkouts: workoutLogs.reduce((sum, log) => sum + (log.workoutCount || 0), 0),
      avgDuration: calculateAvgDuration(workoutLogs),
      totalVolume: workoutLogs.reduce((sum, log) => sum + (log.totalVolume || 0), 0),
    },
    muscleBalance: aggregateMuscleGroups(muscleDistribution),
  };

  const prompt = createWorkoutPrompt(userData);
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  
  // Clean and parse Ai response
  const cleanedText = responseText
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
  
  try {
    const recommendations = JSON.parse(cleanedText);
    return recommendations;
  } catch (error) {
    console.error('Failed to parse AI response:', responseText);
    throw new Error('Failed to generate valid recommendations');
  }
}

// Helper function to fetch user data
async function getUserWorkoutData(userPublicId) {
  // Need to implement functions to get recent workouts and user profile
  const recentWorkouts = await getRecentWorkouts(userPublicId, 10);
  const userProfile = await getUserProfile(userPublicId);
  
  return {
    recentWorkouts: recentWorkouts.map(workout => ({
      name: workout.workoutName,
      exercises: workout.exercises.map(e => e.exerciseName),
      duration: workout.workoutDuration,
    })),
    goals: userProfile.goals || 'general fitness',
    experienceLevel: determineExperienceLevel(recentWorkouts),
  };
}

function calculateAvgDuration(workoutLogs) {
  if (workoutLogs.length === 0) return 0;
  const totalDuration = workoutLogs.reduce((sum, log) => sum + (log.totalDuration || 0), 0);
  const totalWorkouts = workoutLogs.reduce((sum, log) => sum + (log.workoutCount || 0), 0);
  return totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
}

//Determine user experience level based on number of workouts
function determineExperienceLevel(workouts) {
  if (workouts.length < 5) return 'beginner';
  if (workouts.length < 20) return 'intermediate';
  return 'advanced';
}

// Aggregate muscle groups from distribution data
function aggregateMuscleGroups(muscleDistribution) {
  const aggregated = {};
  
  muscleDistribution.forEach(period => {
    Object.entries(period.muscleGroups || {}).forEach(([muscle, count]) => {
      aggregated[muscle] = (aggregated[muscle] || 0) + count;
    });
  });

  return aggregated;
}

// Create prompt for Ai model
function createWorkoutPrompt(userData) {
  const muscleList = Object.entries(userData.muscleBalance)
    .sort((a, b) => b[1] - a[1])
    .map(([muscle, count]) => `${muscle}: ${count} exercises`)
    .join(', ') || 'No recent data';

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

    TASK: Generate 3 personalized workout recommendations for the next 2 weeks that:
    1. Address any muscle imbalances (underworked muscle groups)
    2. Align with the user's ${userData.profile.goalType} goal
    3. Match their ${userData.profile.activityLevel} activity level
    4. Progressive difficulty based on recent performance

    Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
    {
    "recommendations": [
        {
        "workoutName": "string",
        "description": "string (1-2 sentences)",
        "targetMuscles": ["string"],
        "difficulty": "beginner|intermediate|advanced",
        "estimatedDuration": number (in minutes),
        "exercises": [
            {
            "exerciseName": "string",
            "sets": number,
            "reps": number,
            "restSeconds": number,
            "notes": "string (optional form cues)"
            }
        ],
        "reasoning": "string (explain why this workout addresses their needs and imbalances)"
        }
    ],
    "insights": {
        "muscleImbalances": ["string describing underworked areas"],
        "progressionTips": "string with advice for next 2 weeks"
    }
    }`;
}