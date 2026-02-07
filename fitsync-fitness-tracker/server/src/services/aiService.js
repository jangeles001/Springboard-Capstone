import { GoogleGenerativeAI } from '@google/generative-ai';
import * as workoutLogRepo from '../repositories/workoutLogRepo.js';
import * as userRepo from '../repositories/userRepo.js';
import { getEnv } from '../config/envConfig.js';

const genAI = new GoogleGenerativeAI(getEnv('GEMINI_API_KEY'));

export async function generateAiWorkoutRecommendations(userPublicId) {
  // ✅ Get user profile first
  const user = await userRepo.findOneUserByPublicId(userPublicId);
  if (!user) throw new Error('User not found');

  if(user.lastAiRecommendationAt) {
    const daysSinceLast = (Date.now() - new Date(user.lastAiRecommendationAt).getTime()) / (1000 * 60 * 60 * 24);
    
    if(daysSinceLast < 14) { // Only allow new recommendations every 2 weeks
      return user.lastAiRecommendations;
    }
  }

  // Get last 30 days of workout data
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // ✅ Fixed: was thirtyDaysAgo.now()

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
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  });

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  
  // Clean and parse AI response
  const cleanedText = responseText
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
  
  try {
    const recommendations = JSON.parse(cleanedText);
    
    // Save the recommendations and timestamp to the user record
    await userRepo.updateUserByPublicId(userPublicId, {
      lastAiRecommendations: recommendations,
      lastAiRecommendationAt: new Date(),
    });

    return recommendations;
  } catch (error) {
    console.error('Failed to parse AI response:', responseText);
    throw new Error('Failed to generate valid recommendations');
  }
}

function calculateAvgDuration(workoutLogs) {
  if (workoutLogs.length === 0) return 0;
  const totalDuration = workoutLogs.reduce((sum, log) => sum + (log.totalDuration || 0), 0);
  const totalWorkouts = workoutLogs.reduce((sum, log) => sum + (log.workoutCount || 0), 0);
  return totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
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

// Create prompt for AI model
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

TASK: Generate 2 exercise recommendations for the next 2 weeks that:
1. Address any muscle imbalances (underworked muscle groups)
2. Align with the user's ${userData.profile.goalType} goal
3. Match their ${userData.profile.activityLevel} activity level
4. Progressive difficulty based on recent performance

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
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