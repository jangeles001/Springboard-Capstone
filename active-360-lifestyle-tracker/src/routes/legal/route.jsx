import { createFileRoute} from '@tanstack/react-router'
import Default_Nav from '../../layout/default_nav'

export const Route = createFileRoute('/legal')({
    component: RouteComponent
})

function RouteComponent() {

    const navLinks = [
    { label: "Home", path: "/" },
    { label: "Terms", path: "/legal/terms" },
    { label: "Privacy Policy", path: "/legal/privacy" },
  ];


    return (
        <>
            <Default_Nav links={navLinks} />
        </>
    )
}