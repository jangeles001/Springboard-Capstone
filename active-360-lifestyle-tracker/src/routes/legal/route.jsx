import { createFileRoute} from '@tanstack/react-router'
import Default_Nav from '../../layout/default_nav'

export const Route = createFileRoute('/legal')({
    component: RouteComponent
})

function RouteComponent() {

    const navLinks = [
    { label: "Home", path: "/" },
    { label: "Privacy Policy", path: "/legal/privacy" },
    { label: "Terms", path: "/legal/terms" },
  ];


    return (
        <>
            <Default_Nav links={navLinks} />
        </>
    )
}