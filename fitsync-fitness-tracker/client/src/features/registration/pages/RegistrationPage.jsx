import RegistrationForm from '../components/RegistrationForm';
import { Link } from '@tanstack/react-router';
import PrivacyNotification from '../../../components/PrivacyNotification';

export function RegistrationPage() {
    return (
        <div className="flex flex-col justify-between items-center h-full w-full max-w-auto">
        <section className='text-3xl text-white mt-[5%] mb-[2%]'><h1>Welcome to the first step towards a better fitness journey!</h1></section>
        <RegistrationForm />
        <div className='flex flex-row'>
            <section className='pb-40'><Link to='/landing/' className='text-white hover:underline'>&lt; Back to home page</Link></section>
            <section className='pb-40 pl-80'><Link to='/auth/login/' className='text-white hover:underline'>Already have an account?</Link></section>
        </div>
        <PrivacyNotification />
    </div>
  )
}