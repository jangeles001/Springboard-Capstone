import { createFileRoute } from '@tanstack/react-router'
import MealsCreator from '../../features/meals/components/MealsCreator'

export const Route = createFileRoute('/dashboard/mealCreator')({
  component: RouteComponent,
})

function RouteComponent() {
  return ( 
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-screen min-h-min">
        <h1 className='flex text-white justify-center text-4xl pt-10 pb-10'>Enter Meal Information</h1>
        <MealsCreator />
    </div>
  )
}