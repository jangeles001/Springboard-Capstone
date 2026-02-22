import { useLoginForm } from '../hooks/useLoginForm';
import { useRouter } from '@tanstack/react-router';
import { FormField } from "../../../components/FormField"
import { FormInput } from "../../../components/FormInput"
import ReCAPTCHA from "react-google-recaptcha"

export default function LoginForm() {
    
    const router = useRouter();
    const { 
        formDataEmail,
        formDataPassword,
        passwordVisible,
        recaptchaRef,
        formErrors,
        error,
        isLoading,
        handleChange,
        handlePasswordToggle,
        handleRecaptchaChange,
        handleSubmit
    } = useLoginForm({
        onSuccessFunction: () => router.navigate({ to: '/dashboard/'})
    });
    
    return (
        <div className='flex justify-center-safe mx-auto min-w-full'>
            <div className='flex bg-white justify-center rounded-2xl shadow-xl p-8 w-full max-w-2xl'>
                <form className='grid grid-cols-1 md:grid-cols-1 gap-3' onSubmit={handleSubmit}>
                    <div className="flex flex-col col-span-1 md:col-span-1">
                        <FormField name="email" label="Email" formError={formErrors?.email}>
                            <FormInput
                            name="email"
                            inputType="text"
                            inputValue={formDataEmail}
                            inputErrors={formErrors?.email}
                            handleChange={handleChange}
                            placeholder="Email"
                            ></FormInput>
                        </FormField>
                    </div>
                    <div className='flex flex-col col-span-1 md:col-span-1'>
                        <FormField name="password" label="Password" formError={formErrors?.password}>
                            <div className='flex flex-row gap-2'>
                                <FormInput
                                name="password"
                                inputType={passwordVisible ? 'text' : 'password'}
                                inputValue={formDataPassword}
                                inputErrors={formErrors?.password}
                                handleChange={handleChange}
                                placeholder="Password"
                                ></FormInput>
                                <button 
                                type='button'
                                onClick={handlePasswordToggle} 
                                className={passwordVisible ? 
                                    `bg-gray-200 border h-min mt-auto rounded-md shadow-sm hover:opacity-90 transition p-2` : 
                                    `border rounded-md h-min mt-auto shadow-sm p-2 hover:bg-gray-200 hover:opacity-90 transition`}
                                aria-label="Toggle password visibility"
                                >
                                    <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    >
                                        { passwordVisible === false ? 
                                            <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M2 12 s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"
                                            /> :
                                            <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M2 12 s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z M3 3 l18 18"
                                            />
                                        }
                                        <circle
                                        cx="12"
                                        cy="12"
                                        r="3"
                                        strokeWidth={1.5}
                                        />
                                    </svg>
                                </button>
                            </div>
                        </FormField>
                        { error && 
                            !error.response.data.details &&
                                <p className='text-red-700 text-sm mt-5 ml-11'>
                                    {error.response.data.message}
                                </p>
                        }
                        { formErrors?.reCaptchaError &&
                            <p className='text-red-700 text-sm mt-5'>
                                {formErrors.reCaptchaError}
                            </p>
                        }
                    </div>
                    <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    ref={recaptchaRef}
                    onChange={(value) => handleRecaptchaChange(value)}
                    className='mt-[10px]'
                    />
                    <div className="col-span-1 md:col-span-1 flex justify-center mt-5 max-h-20">
                        <button type='submit' className='border-1 border rounded-lg w-50 hover:bg-blue-100' disabled={isLoading}>Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}