import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className='flex flex-col justify-between mx-auto min-h-screen min-w-screen bg-gradient-to-r from-blue-500 to-indigo-600'>
            <Outlet />
        </div>
    )
}