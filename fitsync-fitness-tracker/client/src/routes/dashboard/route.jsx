import { createFileRoute } from '@tanstack/react-router'
import LoggedInNav from '../../layout/LoggedInNav';

export const Route = createFileRoute('/dashboard')({
  component: dashboard,
})

function dashboard() {

  const navLinks = [
    { label: "Dashboard", path: "/dashboard/dash" },
    { label: "Workout Creator", path: "/dashboard/workoutCreator" },
    { label: "Workouts", path: "/dashboard/workouts"},
    { label: "Record a Meal", path: "/dashboard/meals"},
  ];

  return (
    <>
      <LoggedInNav  links={navLinks}/>
    </>
  )
}