import { createFileRoute } from '@tanstack/react-router'
import { WorkoutsCreatorForm } from '../../features/workouts/components/WorkoutsCreatorForm'
import { useExercises } from '../../hooks/useExercises';
import ExerciseList from '../../components/ExerciseList'

export const Route = createFileRoute('/dashboard/workoutCreator')({
  component: RouteComponent,
})

function RouteComponent() {
  const { error } = useExercises();

  if(error) return <div className="p-4 text-red-600">Error: {error.message}</div>;;

  return (
      <div className='flex flex-col md:flex-row md:items-start bg-gradient-to-r from-blue-500 to-indigo-600 gap-10 min-w-sm'>
        <WorkoutsCreatorForm />
        <ExerciseList />
      </div>
  ) 
}
