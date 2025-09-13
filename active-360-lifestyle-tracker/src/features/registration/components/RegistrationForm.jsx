import { useRouter, Link } from '@tanstack/react-router';
import { useRegistrationForm } from '../../../hooks/useRegistrationForm'
import ErrorMessages from '../../../components/ErrorMessages';

export default function RegistrationForm() {
    const router = useRouter();
    const {
        formData,
        formErrors,
        hasErrors,
        handleChange,
        handleSubmit,
    } = useRegistrationForm({ 
            onSuccess: () => router.navigate({ to: "/dashboard/" })
        });
    
    return (
        <div className='flex justify-center-safe mt-5 mb-auto  md:h-full min-w-[600px]'>
            {console.log(formData.firstName)}
            <div className='flex bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl'>
                <form className='grid grid-cols-1 md:grid-cols-4 gap-5' onSubmit={handleSubmit}>
                    <div className="flex flex-col col-span-1 md:col-span-2">
                        <label htmlFor="firstName" className={`form-label ${formErrors?.firstName && !formData.firstName && 'form-label-error'}`}>First Name:</label>
                        <input
                        className={`form-input ${formErrors?.firstName && !formData.firstName && 'form-input-error'}`}
                        type='text'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder='First Name'
                        />
                    </div>
                    <div className='flex flex-col col-span-1 md:col-span-2'>   
                        <label htmlFor="lastName" className={`form-label ${formErrors?.lastName && !formData.lastName && 'form-label-error'}`}>Last Name:</label>
                        <input
                        className={`form-input ${formErrors?.lastName && !formData.lastName && 'form-input-error'}`}
                        type='text'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder='Last Name'
                        />
                    </div>
                    <div className="col-span-1 grid grid-cols-3 col-start-1 min-w-[600px] md:col-span-4 grid-cols-2 gap-5">
                        <div className='flex flex-col col-span-1'>  
                            <label htmlFor="age" className={`form-label ${formErrors?.age && !formData.age && 'form-label-error'}`}>Age:</label>
                            <input
                            className={`form-input ${formErrors?.age && !formData.age && 'form-input-error'}`}
                            type='text'
                            name='age'
                            value={formData.age}
                            onChange={handleChange}
                            placeholder='Age'
                            />
                        </div>
                        <div className='flex flex-col col-span-1 md:col-span-2'>     
                            <label htmlFor="height" className={`form-label ${formErrors?.height && !formData.height && 'form-label-error'}`}>Height:</label>
                            <input 
                            className={`form-input ${formErrors?.height && !formData.height && 'form-input-error'}`}
                            type='text'
                            name='height'
                            value={formData.height}
                            onChange={handleChange}
                            placeholder='Height'
                            />
                        </div>
                        <div className='flex flex-col col-span-1'> 
                            <label htmlFor="weight" className={`form-label ${formErrors?.weight && !formData.weight && 'form-label-error'}`}>Weight:</label>
                            <input 
                            className={`form-input ${formErrors?.weight && !formData.weight && 'form-input-error'}`}
                            type='text'
                            name='weight'
                            value={formData.weight}
                            onChange={handleChange}
                            placeholder='Weight'
                            />
                        </div>
                        <div className="col-span-4 grid grid-cols-1 md:grid-cols-1 gap-5">
                            <div className='flex flex-col col-span-2 md:col-span-2'> 
                                <label htmlFor="userName" className={`form-label ${formErrors?.userName && !formData.userName && 'form-label-error'}`}>Username:</label>
                                <input 
                                className={`form-input ${formErrors?.userName && !formData.userName && 'form-input-error'}`}
                                type='text'
                                name='userName'
                                value={formData.userName}
                                onChange={handleChange}
                                placeholder='Username'
                                />
                            </div>
                        </div>
                        <div className='flex flex-col col-span-4'> 
                            <label htmlFor="password" className={`form-label ${formErrors?.password && !formData.password && 'form-label-error'}`}>Password:</label>
                            <input 
                            className={`form-input ${formErrors?.password && !formData.password && 'form-input-error'}`}
                            type='text'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            placeholder='Password'
                            />
                        </div>
                        <div className='flex flex-col col-span-4'> 
                            <label htmlFor="email" className={`form-label ${formErrors?.email && !formData.email &&'form-label-error'}`}>Email:</label>
                            <input 
                            className={`form-input ${formErrors?.email && !formData.email && 'form-input-error'}`}
                            type='text'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='user@example.com'
                            />
                        </div>
                        <div className='flex flex-row col-span-4 gap-3'> 
                            <input 
                            className=''
                            type='checkbox'
                            name='promoConsent'
                            checked={formData.promoConsent}
                            onChange={handleChange}
                            />
                            <label htmlFor="email" className={`form-label`}>Agree to receive occasional promotional emails</label>
                        </div>
                        <div className='flex flex-row col-span-4 gap-3'>
                            <input 
                            className={`${formErrors?.agreeToTerms && !formData.agreeToTerms && 'border-red-700'}`}
                            type='checkbox'
                            name='agreeToTerms'
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            />
                            <label htmlFor="email" className={`form-label ${formErrors?.agreeToTerms && !formData.agreeToTerms && 'text-red-700'}`}>Agree to our <Link to="/legal/terms" className='hover:underline'>Terms of Service&#129133;</Link></label>
                        </div>
                    </div>
                        {hasErrors &&
                        <div className='col-span-1 md:col-span-3'>
                            <ErrorMessages errors={formErrors} />
                        </div> 
                        }
                    <div className="col-span-1 md:col-span-4 flex justify-center max-h-20">
                        <button type='submit' className='border-1 border rounded-lg w-50 hover:bg-blue-100'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}