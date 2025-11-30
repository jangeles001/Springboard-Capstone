import { useRouter, Link } from '@tanstack/react-router';
import { useRegistrationForm } from '../hooks/useRegistrationForm'
import ErrorMessages from '../../../components/ErrorMessages';

export default function RegistrationForm() {
    const router = useRouter();
    const {
        firstName,
        lastName,
        age,
        height,
        weight,
        username,
        password,
        email,
        promoConsent,
        agreeToTerms,
        formErrors,
        hasErrors,
        handleChange,
        handleSubmit,
    } = useRegistrationForm({ 
            onSuccess: () => router.navigate({ to: "/dashboard/" })
        });
    
    return (
        <div className='flex justify-center-safe mt-5 mb-auto  md:h-full min-w-[600px]'>
            <div className='flex bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl'>
                <form className='grid grid-cols-1 md:grid-cols-4 gap-5' onSubmit={handleSubmit}>
                    <div className="flex flex-col col-span-1 md:col-span-2">
                        <label htmlFor="firstName" className={`form-label ${formErrors?.firstName && !firstName && 'form-label-error'}`}>First Name:</label>
                        <input
                        className={`form-input ${formErrors?.firstName && !firstName && 'form-input-error'}`}
                        type='text'
                        name='firstName'
                        value={firstName}
                        onChange={handleChange}
                        placeholder='First Name'
                        />
                    </div>
                    <div className='flex flex-col col-span-1 md:col-span-2'>   
                        <label htmlFor="lastName" className={`form-label ${formErrors?.lastName && !lastName && 'form-label-error'}`}>Last Name:</label>
                        <input
                        className={`form-input ${formErrors?.lastName && !lastName && 'form-input-error'}`}
                        type='text'
                        name='lastName'
                        value={lastName}
                        onChange={handleChange}
                        placeholder='Last Name'
                        />
                    </div>
                    <div className="col-span-1 grid grid-cols-3 col-start-1 min-w-[600px] md:col-span-4 grid-cols-2 gap-5">
                        <div className='flex flex-col col-span-1'>  
                            <label htmlFor="age" className={`form-label ${formErrors?.age && !age && 'form-label-error'}`}>Age:</label>
                            <input
                            className={`form-input ${formErrors?.age && !age && 'form-input-error'}`}
                            type='text'
                            name='age'
                            value={age}
                            onChange={handleChange}
                            placeholder='Age'
                            />
                        </div>
                        <div className='flex flex-col col-span-1 md:col-span-2'>     
                            <label htmlFor="height" className={`form-label ${formErrors?.height && !height && 'form-label-error'}`}>Height:</label>
                            <input 
                            className={`form-input ${formErrors?.height && !height && 'form-input-error'}`}
                            type='text'
                            name='height'
                            value={height}
                            onChange={handleChange}
                            placeholder='Height'
                            />
                        </div>
                        <div className='flex flex-col col-span-1'> 
                            <label htmlFor="weight" className={`form-label ${formErrors?.weight && !weight && 'form-label-error'}`}>Weight:</label>
                            <input 
                            className={`form-input ${formErrors?.weight && !weight && 'form-input-error'}`}
                            type='text'
                            name='weight'
                            value={weight}
                            onChange={handleChange}
                            placeholder='Weight'
                            />
                        </div>
                        <div className="col-span-4 grid grid-cols-1 md:grid-cols-1 gap-5">
                            <div className='flex flex-col col-span-2 md:col-span-2'> 
                                <label htmlFor="username" className={`form-label ${formErrors?.username && !username && 'form-label-error'}`}>Username:</label>
                                <input 
                                className={`form-input ${formErrors?.username && !username && 'form-input-error'}`}
                                type='text'
                                name='username'
                                value={username}
                                onChange={handleChange}
                                placeholder='Username'
                                />
                            </div>
                        </div>
                        <div className='flex flex-col col-span-4'> 
                            <label htmlFor="password" className={`form-label ${formErrors?.password && !password && 'form-label-error'}`}>Password:</label>
                            <input 
                            className={`form-input ${formErrors?.password && !password && 'form-input-error'}`}
                            type='text'
                            name='password'
                            value={password}
                            onChange={handleChange}
                            placeholder='Password'
                            />
                        </div>
                        <div className='flex flex-col col-span-4'> 
                            <label htmlFor="email" className={`form-label ${formErrors?.email && !email &&'form-label-error'}`}>Email:</label>
                            <input 
                            className={`form-input ${formErrors?.email && !email && 'form-input-error'}`}
                            type='text'
                            name='email'
                            value={email}
                            onChange={handleChange}
                            placeholder='user@example.com'
                            />
                        </div>
                        <div className='flex flex-row col-span-4 gap-3'> 
                            <input 
                            className=''
                            type='checkbox'
                            name='promoConsent'
                            checked={promoConsent}
                            onChange={handleChange}
                            />
                            <label htmlFor="email" className={`form-label`}>Agree to receive occasional promotional emails</label>
                        </div>
                        <div className='flex flex-row col-span-4 gap-3'>
                            <input 
                            className={`${formErrors?.agreeToTerms && !agreeToTerms && 'border-red-700'}`}
                            type='checkbox'
                            name='agreeToTerms'
                            checked={agreeToTerms}
                            onChange={handleChange}
                            />
                            <label htmlFor="email" className={`form-label ${formErrors?.agreeToTerms && !agreeToTerms && 'text-red-700'}`}>Agree to our <Link to="/legal/terms" className='hover:underline'>Terms of Service&#129133;</Link></label>
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