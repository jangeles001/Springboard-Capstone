import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useRegisterFormStore } from '../store/RegistrationStore'

export default function RegistrationForm() {
    
    const { formData, formErrors, setFormField, resetForm, validateForm } = useRegisterFormStore();
    const [ hasErrors, setHasErrors ] = useState(false);
    const router = useRouter();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormField(name, value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        validateForm();
        console.log(formErrors)
        if(formErrors){
            setHasErrors(true);
        }else{
            //TODO: Submit information to database
            resetForm();
            router.navigate({ to: '/dashboard/'})
        }
    }
    
    return (
        <div className='flex justify-center-safe mt-5 mb-auto min-h-[600px] max-h-[1050px] min-w-[600px]'>
            <div className='flex bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl'>
                <form className='grid grid-cols-1 md:grid-cols-4 gap-5' onSubmit={handleSubmit}>
                    <div className="flex flex-col col-span-1 md:col-span-2">
                        <label htmlFor="firstName" className='form-label'>First Name:</label>
                        <input
                        className={`form-input`}
                        type='text'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder='First Name'
                        />
                    </div>
                    <div className='flex flex-col col-span-1 md:col-span-2'>   
                        <label htmlFor="lastName" className='form-label'>Last Name:</label>
                        <input
                        className='form-input'
                        type='text'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder='Last Name'
                        />
                    </div>
                    <div className="col-span-1 grid grid-cols-3 col-start-1 min-w-[600px] md:col-span-4 grid-cols-2 gap-5">
                        <div className='flex flex-col col-span-1'>  
                            <label htmlFor="age" className='form-label'>Age:</label>
                            <input
                            className='form-input'
                            type='text'
                            name='age'
                            value={formData.age}
                            onChange={handleChange}
                            placeholder='Age'
                            />
                        </div>
                        <div className='flex flex-col col-span-1 md:col-span-2'>     
                            <label htmlFor="height" className='form-label'>Height:</label>
                            <input 
                            className='form-input'
                            type='text'
                            name='height'
                            value={formData.height}
                            onChange={handleChange}
                            placeholder='Height'
                            />
                        </div>
                        <div className='flex flex-col col-span-1'> 
                            <label htmlFor="weight" className='form-label'>Weight:</label>
                            <input 
                            className='form-input'
                            type='text'
                            name='weight'
                            value={formData.weight}
                            onChange={handleChange}
                            placeholder='Weight'
                            />
                        </div>
                        <div className="col-span-4 grid grid-cols-1 md:grid-cols-1 gap-5">
                            <div className='flex flex-col col-span-2 md:col-span-2'> 
                                <label htmlFor="userName" className='form-label'>User Name:</label>
                                <input 
                                className='form-input'
                                type='text'
                                name='userName'
                                value={formData.userName}
                                onChange={handleChange}
                                placeholder='User Name'
                                />
                            </div>
                        </div>
                        <div className='flex flex-col col-span-4'> 
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
                    </div>
                    <div className="col-span-4 md:col-span-4 flex justify-center max-h-20">
                        <button type='submit' className='border-1 border rounded-lg w-50'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}