export const getAllWorkouts = (req, res) => {
  const workouts = [
    { id: 1, name: "Push-ups", reps: 20 },
    { id: 2, name: "Squats", reps: 15 },
  ];
  return res.status(200).json(workouts);
};

export const createWorkout = (req, res) => {
  if (req.params.createdWorkout) return res.status(201).json();
};
