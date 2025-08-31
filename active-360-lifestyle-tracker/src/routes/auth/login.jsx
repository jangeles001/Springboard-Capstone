import { createFileRoute, Link } from '@tanstack/react-router'
import LoginForm from '../../features/login/components/LoginForm'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col justify-between items-center h-full w-full max-w-md mx-auto">
      <section className='text-3xl text-white pt-[40%]'><h1>Welcome Back!</h1></section>
      <LoginForm />
      <div className='flex flex-row justify-between w-full mb-5'>
        <section className=''><Link to='/landing/' className='text-white hover:underline'>&lt; Back to landing page</Link></section>
        <section className=''><Link to='/auth/signup/' className='text-white hover:underline'>Don't have an account?</Link></section>
      </div>
    </div>
  )
}
