import { Link } from '@tanstack/react-router'
import { useCookiesStore } from '../store/CookiesStore'


export default function CookiesNotification() {
    
    const { consent, setConsent } = useCookiesStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const choice = formData.get("consent");
        setConsent(choice);
    }

    if(!navigator.cookieEnabled || consent) return null;

    return (
        <div className='fixed bottom-0 w-full z-50 bg-black text-white text-md p-4 shadow-lg opacity-75 animate-slideUp hover:opacity-100 transition-opacity duration-500'>
            <div className='flex flex-col items-center'>
                This website uses cookies to ensure you get the best experience. Some cookies are essential, while others help us improve your experience.
                <section> You may accept or reject non-essential cookies. See our <Link className='hover:underline' to='/legal/privacy'>Privacy Policy↗</Link> for more details.</section>
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <br></br>
                    <label htmlFor='All'>
                        <input 
                        type='radio'
                        className='form-radio text-blue w-4 h-4'
                        id='All'
                        name='consent'
                        value='All' />
                        Allow all cookies
                    </label>
                    <label htmlFor='Essential'>
                        <input 
                        type='radio'
                        className='form-radio text-blue w-4 h-4'
                        id='Essential'
                        name='consent'
                        value='Essential' />
                        Allow only essential cookies
                    </label>
                    <label htmlFor='Decline'>
                        <input 
                        type='radio'
                        className='form-radio text-blue w-4 h-4'
                        id='Decline'
                        name='consent'
                        value='Decline' />
                        Decline all cookies
                    </label><br></br>
                    <button className="border-2 hover:border-blue-800" type='submit'>Continue</button>
                </form>
            </div>
        </div>
    )
}