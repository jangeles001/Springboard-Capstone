import { createFileRoute } from '@tanstack/react-router'
import MealsForm from '../../features/meals/component/MealsForm'

export const Route = createFileRoute('/dashboard/meals')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <h1>Enter Meal Information</h1>
    <MealsForm />

  </div>
}