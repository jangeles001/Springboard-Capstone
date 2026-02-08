import { ExerciseLibrary } from "../components/ExerciseLibrary";
import { WorkoutsBuilderForm } from "../components/WorkoutsBuilderForm";
import { useExercises } from "../hooks/useExercises";

export function WorkoutBuilderPage() {
  const { error } = useExercises();

  if(error) return <div className="p-4 text-red-600">Error: {error.message}</div>;

  return (
      <div className='  flex flex-col lg:flex-row w-full max-w-7xl mx-auto gap-8 px-6 py-10'>
        <div className="flex-1 lg:flex-[1.2]">
          <WorkoutsBuilderForm />
        </div>
        <div className="flex-1 lg:flex-[1.8]">
          <ExerciseLibrary />
        </div>
      </div>
  ) 
}