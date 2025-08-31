import { createFileRoute, Link } from '@tanstack/react-router'
import RegistrationForm from '../../features/registration/components/RegistrationForm'

export const Route = createFileRoute('/auth/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col justify-between items-center h-full w-full max-w-auto">
    <section className='text-3xl text-white mt-[5%] mb-[5%]'><h1>Welcome to the first step towards a better fitness journey!</h1></section>
    <RegistrationForm />
        <div className='flex flex-row'>
            <section className='pb-40'><Link to='/landing/' className='text-white hover:underline'>&lt; Back to landing page</Link></section>
            <section className='pb-40 pl-80'><Link to='/auth/login/' className='text-white hover:underline'>Already have an account?</Link></section>
        </div>
    </div>
  )
}
