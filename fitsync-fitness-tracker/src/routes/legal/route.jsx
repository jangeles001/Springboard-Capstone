import { createFileRoute} from '@tanstack/react-router'
import DefaultNav from '../../layout/Default_Nav'

export const Route = createFileRoute('/legal')({
    component: RouteComponent
})

function RouteComponent() {

    const navLinks = [
    { label: "Home", path: "/landing" },
    { label: "Privacy Policy", path: "/legal/privacy" },
    { label: "Terms", path: "/legal/terms" },
  ];

    return (
        <>
            <DefaultNav links={navLinks} />
        </>
    )
}