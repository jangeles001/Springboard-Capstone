import { useState } from "react";
import { Link } from "@tanstack/react-router";

export default function PrivacyNotification() {

    const [ visible, setVisible ] = useState(true);

    if(!visible) return null;

    return (
        <div className='fixed invisible bottom-0 w-full z-999 bg-black text-white text-md p-4 shadow-lg opacity-75 animate-slideUp hover:opacity-100 transition-opacity duration-500'>
            <div className='flex flex-col items-center'>
                <button className='border-2 p-1 ml-auto hover:border-blue-800' onClick={() => setVisible(false)}>X</button>
                <div className='max-w-4xl mx-auto text-center flex flex-col gap-4'>
                    <section>To generate personalized workout recommendations, we process the information you enter (e.g., age, height, weight, goals). This data stays private, is used only to deliver recommendations and improve accuracy, and can be deleted anytime in Settings. See our <Link className='hover:underline'>Privacy Policy.</Link></section>
                    <section>California residents: You may have the right to know, delete, correct, and opt out of sale/sharing of personal information. We do not sell personal information for money. To exercise your rights, use Privacy Requests or email complaints@active.360</section>
                </div>
            </div>
        </div>
    )
}
