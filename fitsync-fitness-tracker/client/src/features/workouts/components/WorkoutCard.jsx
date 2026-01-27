import Exercise  from './WorkoutsList/exercise';

export function WorkoutCard({ item, publicId, onDelete, onClick }) {
  console.log(publicId);
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-md p-6 border">

      <h2
        className="text-xl font-semibold hover:cursor-pointer"
        onClick={() => onClick(item.uuid)}
      >
        {item.workoutName}
      </h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {item.muscleGroups?.slice(0, 4).map((muscleGroup) => (
          <span
            key={muscleGroup}
            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
          >
            {muscleGroup}
          </span>
        ))}
      </div>

      <div className="flex flex-col min-w-md max-w-md gap-3 mb-4">
        {item.exercises.slice(0,3).map((exercise) => (
          <div key={exercise.exerciseId}>
            <Exercise exercise={exercise}/>
          </div>
        ))}
        {item.exercises.length > 3 && (
          <p key={`workout${item.uuid}`} className="text-sm text-gray-500">
            + {item.exercises.length - 3} more exercises
          </p>
        )}
      </div>

      {item.creatorPublicId === publicId && (
        <button
          onClick={() => onDelete(item.uuid)}
          className="mt-auto bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Remove Workout
        </button>
      )}
    </div>
  );
}