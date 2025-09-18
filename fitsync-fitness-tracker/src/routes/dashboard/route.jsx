import { createFileRoute } from '@tanstack/react-router'
import DefaultNav from '../../layout/DefaultNav';

export const Route = createFileRoute('/dashboard')({
  component: dashboard,
})

function dashboard() {

  const navLinks = [
    { label: "Dashboard", path: "/dashboard/dash" },
    { label: "Exercises", path: "/dashboard/exercises" },
    { label: "Workouts", path: "/dashboard/workouts"},
    { label: "Record a Meal", path: "/dashboard/meals"},
    { label: "Logout", path: "/" },
  ];

  return (
    <>
      <DefaultNav  links={navLinks}/>
    </>
  )
}