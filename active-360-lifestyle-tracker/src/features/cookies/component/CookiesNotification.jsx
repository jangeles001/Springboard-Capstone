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

    if(consent) return null;

    return (
        <div className='fixed bottom-0 w-full z-999 bg-black text-white p-4 shadow-lg'>
            <div className='flex flex-col'>
                This website uses cookies to ensure you get the best experience. Some cookies are essential, while others help us improve your experience. You may accept or reject non-essential cookies.
                <section className='mt-5'>See our <Link className='hover: underline' to='/legal/privacy'>Privacy Policy</Link> for more details.</section>
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <br></br>
                    <label htmlFor='All'>
                        <input 
                        type='radio'
                        id='All'
                        name='consent'
                        value='All' />
                        Allow all cookies
                    </label>
                    <label htmlFor='Essential'>
                        <input 
                        type='radio'
                        id='Essential'
                        name='consent'
                        value='Essential' />
                        Allow only essential cookies
                    </label>
                    <label htmlFor='Decline'>
                        <input 
                        type='radio'
                        id='Decline'
                        name='consent'
                        value='Decline' />
                        Decline all cookies
                    </label><br></br>
                    <button className="border-2 max-w-[10%]" type='submit'>Continue</button>
                </form>
            </div>

        </div>
    )
}