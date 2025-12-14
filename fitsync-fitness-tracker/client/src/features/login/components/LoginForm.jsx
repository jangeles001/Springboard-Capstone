import { useLoginForm } from '../hooks/useLoginForm';
import { useRouter } from '@tanstack/react-router';
import FieldErrorMessages from '../../../components/FieldErrorMessages';

export default function LoginForm() {
    
    const router = useRouter();
    const { 
        formDataEmail,
        formDataPassword,
        passwordVisible,
        formErrors,
        error,
        isLoading,
        hasErrors,
        handleChange,
        handlePasswordToggle,
        handleSubmit
    } = useLoginForm({
        onSuccessFunction: () => router.navigate({ to: '/dashboard/'})
    });

    console.log(formErrors);

    return (
        <div className='flex justify-center-safe mx-auto mt-5 mb-auto min-w-full'>
            <div className='flex bg-white justify-center rounded-2xl shadow-xl p-8 w-full max-w-2xl'>
                <form className='grid grid-cols-1 md:grid-cols-1 gap-3' onSubmit={handleSubmit}>
                    <div className="flex flex-col col-span-1 md:col-span-1">
                        <label htmlFor="email" className={`form-label ${formErrors?.email && !formDataEmail && 'form-label-error'}`}>Email:</label>
                        <input
                        className={`form-input ${formErrors?.email && !formDataEmail && 'form-input-error'}`}
                        type='text'
                        name='email'
                        value={formDataEmail}
                        onChange={handleChange}
                        placeholder='Email'
                        /> 
                        {hasErrors && formErrors.email &&
                            <div className='col-span-1 md:col-span-1 '>
                                <FieldErrorMessages field="email" error={formErrors.email} />
                            </div> 
                        }
                    </div>
                    <div>
                    </div>
                    <div className='flex flex-col col-span-1 md:col-span-1'>   
                        <label htmlFor="password" className={`form-label ${formErrors?.password && !formDataPassword && 'form-label-error'}`}>Password:</label>
                        <span className='flex flex-row gap-2'>
                            <input
                            className={`form-input ${formErrors?.password && !formDataPassword && 'form-input-error'}`}
                            type={passwordVisible ? `text` : `password`}
                            name='password'
                            value={formDataPassword}
                            onChange={handleChange}
                            placeholder='Password'
                            />
                            <button 
                            type='button'
                            onClick={handlePasswordToggle} 
                            className={passwordVisible ? `bg-gray-200 border rounded-md shadow-sm hover:opacity-90 transition p-2` : `border rounded-md shadow-sm p-2 hover:bg-gray-200 hover:opacity-90 transition`}>👁</button>
                        </span>
                        {hasErrors && formErrors.password &&
                            <div className='col-span-1 md:col-span-1 '>
                                <FieldErrorMessages field="password" error={formErrors.password} />
                            </div> 
                        }
                        { error && !error.response.data.details && <p className='text-red-700 text-sm mt-5 ml-11'>{error.response.data.message}</p>

                        }
                    </div> 
                    <div className="col-span-1 md:col-span-1 flex justify-center mt-5 max-h-20">
                        <button type='submit' className='border-1 border rounded-lg w-50 hover:bg-blue-100' disabled={isLoading}>Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}