import { createFileRoute } from '@tanstack/react-router'
import MealsBuilder from '../../features/meals/components/MealsBuilder'

export const Route = createFileRoute('/dashboard/mealBuilder')({
  component: MealsBuilder,
})