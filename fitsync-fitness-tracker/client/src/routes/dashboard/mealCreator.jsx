import { createFileRoute } from '@tanstack/react-router'
import MealsCreator from '../../features/meals/components/MealsCreator'

export const Route = createFileRoute('/dashboard/mealCreator')({
  component: MealsCreator,
})