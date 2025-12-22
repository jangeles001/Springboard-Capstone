import { createFileRoute } from '@tanstack/react-router'
import DefaultNav from '../../layout/DefaultNav';

export const Route = createFileRoute('/dashboard')({
  component: dashboard,
})

function dashboard() {

  const navLinks = [
    { label: "Dashboard", path: "/dashboard/dash" },
    { label: "Workout Creator", path: "/dashboard/workoutCreator" },
    { label: "Workouts", path: "/dashboard/workouts"},
    { label: "Record a Meal", path: "/dashboard/mealCreator"},
    { label: "Meals", path: "/dashboard/meals"},
  ];

  return (
    <>
      <DefaultNav  links={navLinks}/>
    </>
  )
}