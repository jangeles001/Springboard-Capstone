import { useLoginForm } from '../../../hooks/useLoginForm';
import { useRouter } from '@tanstack/react-router';
import ErrorMessages from '../../../components/ErrorMessages';

export default function LoginForm() {
    
    const router = useRouter();
    const { 
        formDataUserName,
        formDataPassword,
        formErrors,
        hasErrors,
        handleChange,
        handleSubmit
    } = useLoginForm({
        onSuccess: () => router.navigate({ to: '/dashboard/'})
    });
    
    return (
        <div className='flex justify-center-safe mx-auto mt-5 mb-auto min-w-full'>
            <div className='flex bg-white justify-center rounded-2xl shadow-xl p-8 w-full max-w-2xl'>
                <form className='grid grid-cols-1 md:grid-cols-1 gap-5' onSubmit={handleSubmit}>
                    <div className="flex flex-col col-span-1 md:col-span-1">
                        <label htmlFor="userName" className={`form-label ${formErrors?.userName && !formDataUserName && 'form-label-error'}`}>Username:</label>
                        <input
                        className={`form-input ${formErrors?.userName && !formDataUserName && 'form-input-error'}`}
                        type='text'
                        name='userName'
                        value={formDataUserName}
                        onChange={handleChange}
                        placeholder='Username'
                        />
                    </div>
                    <div className='flex flex-col col-span-1 md:col-span-1'>   
                        <label htmlFor="password" className={`form-label ${formErrors?.password && !formDataPassword && 'form-label-error'}`}>Password:</label>
                        <input
                        className={`form-input ${formErrors?.password && !formDataPassword && 'form-input-error'}`}
                        type='text'
                        name='password'
                        value={formDataPassword}
                        onChange={handleChange}
                        placeholder='Password'
                        />
                        {hasErrors &&
                            <div className='col-span-1 md:col-span-1 '>
                                <ErrorMessages errors={formErrors} />
                            </div> 
                        }
                    </div> 
                    <div className="col-span-1 md:col-span-1 flex justify-center max-h-20">
                        <button type='submit' className='border-1 border rounded-lg w-50 hover:bg-blue-100'>Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}