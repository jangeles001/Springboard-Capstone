import { createFileRoute, Outlet } from '@tanstack/react-router'
import Default_Nav from '../../layout/default_nav';

export const Route = createFileRoute('/dashboard')({
  component: dashboard,
})

function dashboard() {

  const navLinks = [
    { label: "Dashboard", path: "/dashboard/dash" },
    { label: "Exercises", path: "/dashboard/exercises" },
    { label: "Logout", path: "/" },
  ];

  return (
    <>
      <Default_Nav  links={navLinks}/>
    </>
  )
}