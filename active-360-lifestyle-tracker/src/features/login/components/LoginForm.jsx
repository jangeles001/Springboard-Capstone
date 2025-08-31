import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useLoginFormStore } from '../store/LoginStore'

export default function LoginForm() {
    
    const { formData, formErrors, setFormField, resetForm, validateForm } = useLoginFormStore();
    const [ hasErrors, setHasErrors ] = useState(false);
    const router = useRouter();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormField(name, value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        validateForm();
        if(formErrors){
            setHasErrors(true);
        }else{
            //TODO: Submit information to database
            resetForm();
            router.navigate({ to: '/dashboard/'})
        }
    }
    
    return (
        <div className='flex justify-center-safe mx-auto mt-5 mb-auto min-w-md'>
            <div className='flex bg-white justify-center rounded-2xl shadow-xl p-8 w-full max-w-2xl'>
                <form className='grid grid-cols-1 md:grid-cols-1 gap-5' onSubmit={handleSubmit}>
                    <div className="flex flex-col col-span-1 md:col-span-1">
                        <label htmlFor="userName" className='form-label'>Username:</label>
                        <input
                        className='form-input'
                        type='text'
                        name='userName'
                        value={formData.userName}
                        onChange={handleChange}
                        placeholder='Username'
                        />
                    </div>
                    <div className='flex flex-col col-span-1 md:col-span-1'>   
                        <label htmlFor="password" className='form-label'>Password:</label>
                        <input
                        className='form-input'
                        type='text'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        placeholder='Password'
                        />
                    </div>
                    <div className="col-span-1 md:col-span-1 flex justify-center max-h-20">
                        <button type='submit' className='border-1 border rounded-lg w-50'>Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}