import { createFileRoute } from '@tanstack/react-router'
import MealsBuilderPage from '../../features/meals/pages/MealsBuilderPage'

export const Route = createFileRoute('/dashboard/mealBuilder')({
  component: MealsBuilderPage,
})