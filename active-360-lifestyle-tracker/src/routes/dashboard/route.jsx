import { createFileRoute, Outlet } from '@tanstack/react-router'
import Default_Nav from '../../layout/default_nav';

export const Route = createFileRoute('/dashboard')({
  component: dashboard,
})

function dashboard() {

  const navLinks = [
    { label: "Home", path: "/dashboard" },
    { label: "Workouts", path: "/dashboard/workouts" },
    { label: "Logout", path: "/" },
  ];

  return (
    <>
      <Default_Nav  links={navLinks}/>
    </>
  )
}