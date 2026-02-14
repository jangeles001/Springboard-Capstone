import { Link } from '@tanstack/react-router'
import LoginForm from '../components/LoginForm'

export function LoginPage() {
  return (
    <div className="flex flex-col items-center h-full w-full max-w-md mx-auto my-auto">
      <section className='text-3xl text-white mb-10'><h1 aria-label="welcome">Welcome Back!</h1></section>
      <LoginForm />
      <div className='flex flex-row justify-between w-full min-w-full'>
        <section className='' aria-label='backToHomePage'><Link to='/landing/' className='text-white hover:underline'>&lt; Back to home page</Link></section>
        <section className='' aria-label='forgotPassword'><Link to='/auth/forgot-password/' className='ml-auto text-white hover:underline'>Forgot Password?</Link></section>
      </div>
      <Link to='/auth/signup/' className='ml-auto text-white hover:underline' aria-label='dontHaveAnAccount'>Don't have an account?</Link>
    </div>
  )
}