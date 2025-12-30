import { createFileRoute } from '@tanstack/react-router'
import DefaultNav from '../../layout/DefaultNav';

export const Route = createFileRoute('/landing')({
  component: RouteComponent,
})

function RouteComponent() {
  const navLinks = [
    { label: "Home", path: "/landing" },
    { label: "About", path: "/landing/about" },
    { label: "Terms of Service", path: "/legal/terms" },
  ];

  return (
    <>
      <DefaultNav links={navLinks} queryEnabled={false}/>
    </>
  )
}

