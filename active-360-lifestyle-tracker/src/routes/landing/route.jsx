import { createFileRoute } from '@tanstack/react-router'
import Default_Nav from '../../layout/default_nav';

export const Route = createFileRoute('/landing')({
  component: RouteComponent,
})

function RouteComponent() {
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/landing/about" },
    { label: "Dashboard", path: "/dashboard" },
  ];

  return (
    <>
      <Default_Nav links={navLinks} />
    </>
  )
}

