import { createFileRoute } from '@tanstack/react-router'
import { WorkoutsCreatorForm } from '../../features/workouts/components/WorkoutsCreatorForm'
import { useExercises } from '../../hooks/useExercises';
import ExerciseList from '../../features/workouts/components/WorkoutsCreator/ExerciseList'

export const Route = createFileRoute('/dashboard/workoutCreator')({
  component: RouteComponent,
})

function RouteComponent() {
  const { error } = useExercises();

  if(error) return <div className="p-4 text-red-600">Error: {error.message}</div>;

  return (
      <div className='  flex flex-col lg:flex-row w-full max-w-7xl mx-auto gap-8 px-6 py-10'>
        <div className="flex-1 lg:flex-[1.2]">
          <WorkoutsCreatorForm />
        </div>
        <div className="flex-1 lg:flex-[1.8]">
          <ExerciseList />
        </div>
      </div>
  ) 
}
