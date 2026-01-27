import { createFileRoute } from '@tanstack/react-router'
import { WorkoutsBuilderForm } from '../../features/workouts/components/WorkoutsBuilderForm'
import { useExercises } from '../../features/workouts/hooks/useExercises';
import ExerciseLibrary from '../../features/workouts/components/WorkoutsBuilder/ExerciseLibrary'

export const Route = createFileRoute('/dashboard/workoutBuilder')({
  component: RouteComponent,
})

function RouteComponent() {
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
