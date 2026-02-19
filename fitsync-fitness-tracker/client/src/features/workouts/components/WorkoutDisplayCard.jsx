export function WorkoutDisplayCard({ data, isPersonal, handleDelete }) {
  return (
    <div className="min-w-xl bg-white rounded-2xl shadow-md p-6 border">
      <h2 className="text-3xl font-bold mb-2">
        {data?.data?.workoutName}
      </h2>

      <p className="text-gray-500 mb-6">
        Duration: {data?.data?.workoutDuration} minutes
      </p>

      <div className="space-y-4">
        {data?.data?.exercises?.map((exercise) => (
          <div
          key={exercise?.exerciseId}
          className="border rounded-xl p-4"
          >
            <h3 className="font-semibold">
              {exercise?.exerciseName}
            </h3>

            <p className="text-sm text-gray-600 mb-2">
              {exercise.description}
            </p>

            <div className="flex flex-wrap gap-2 text-xs">
              {exercise?.muscles?.map((m) => (
                <span
                  key={m}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                >
                  {m}
                </span>
              ))}
            </div>

            <div className="text-sm text-gray-500 mt-2">
              Reps: {exercise.reps}
              {exercise.weight && ` • Weight: ${exercise.weight}`}
              {exercise.duration && ` • Duration: ${exercise.duration}s`}
            </div>
          </div>
        ))}
        {/* Delete Button */}
        <div className="w-max mx-auto">
          { isPersonal && 
            <button
            className="mt-8 bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={() => handleDelete(data?.data?.uuid)}
            >
              Delete Workout
            </button>
          }
        </div>
      </div>
    </div>
  );
}