export const getAllWorkouts = (req, res) => {
  const workouts = [
    { id: 1, name: "Push-ups", reps: 20 },
    { id: 2, name: "Squats", reps: 15 },
  ];
  res.json(workouts);  
};