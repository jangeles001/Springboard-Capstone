import Exercise  from './WorkoutsList/exercise';

export function WorkoutCard({ item: workout, onClick, handleDelete, active, isPending }) {

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-md p-6 border">

      <h2
        className="text-xl font-semibold hover:cursor-pointer"
        onClick={() => onClick(workout?.uuid)}
      >
        {workout?.workoutName}
      </h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {workout?.muscleGroups?.slice(0, 4).map((muscleGroup) => (
          <span
            key={muscleGroup}
            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
          >
            {muscleGroup}
          </span>
        ))}
      </div>

      <div className="flex flex-col min-w-md max-w-md gap-3 mb-4">
        {workout?.exercises?.slice(0,3).map((exercise) => (
          <div key={exercise?.exerciseId}>
            <Exercise exercise={exercise}/>
          </div>
        ))}
        {workout?.exercises?.length > 3 && (
          <p key={`workout${workout?.uuid}`} className="text-sm text-gray-500">
            + {workout?.exercises?.length - 3} more exercises
          </p>
        )}
      </div>

      {active === "Personal" && (
        <button
          onClick={() => handleDelete(workout?.uuid)}
          className="mt-auto bg-blue-500 text-white px-4 py-2 rounded-lg"
          disabled={isPending}
        >
          Delete Workout
        </button>
      )}
    </div>
  );
}