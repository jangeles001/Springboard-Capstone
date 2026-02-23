import { useRouter, Link } from '@tanstack/react-router';
import { useRegistrationForm } from '../hooks/useRegistrationForm'
import FieldErrorMessages from '../../../components/FieldErrorMessages';
import { FormField } from '../../../components/FormField';
import { FormInput } from '../../../components/FormInput'
import Loading from "../../../components/Loading"

export default function RegistrationForm() {
    const router = useRouter();
    const {
        firstName,
        lastName,
        gender,
        age,
        height,
        weight,
        activity_level,
        goal,
        username,
        password,
        passwordVisible,
        email,
        promoConsent,
        agreeToTerms,
        formErrors,
        hasErrors,
        isPending,
        serverErrorMessage,
        handlePasswordToggle,
        handleChange,
        handleSubmit,
    } = useRegistrationForm({ 
            onSuccessFunction: () => router.navigate({ to: "/dashboard/" })
        });

    if(isPending) return <Loading type="overlay" />
    
    return (
        <div className='flex justify-center-safe mt-5 mb-auto  md:h-full min-w-[600px]'>
            <div className='flex bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl'>
                <form className='grid grid-cols-1 md:grid-cols-4 gap-5' onSubmit={handleSubmit}>
                    <div className="flex flex-col col-span-1 md:col-span-2">
                        <FormField name="firstName" label="First Name" formError={formErrors.firstName}>
                            <FormInput
                            name="firstName"
                            inputType="text"
                            inputValue={firstName}
                            inputErrors={formErrors.firstName}
                            handleChange={handleChange}
                            placeholder="First Name"
                            ></FormInput>
                        </FormField>
                    </div>
                    <div className='flex flex-col col-span-1 md:col-span-2'>   
                        <FormField name="lastName" label="Last Name" formError={formErrors.lastName}>
                            <FormInput
                            name="lastName"
                            inputType="text"
                            inputValue={lastName}
                            inputErrors={formErrors.lastName}
                            handleChange={handleChange}
                            placeholder="Last Name"
                            ></FormInput>
                        </FormField>
                    </div>
                    <div className="col-span-1 grid grid-cols-4 col-start-1 min-w-[600px] md:col-span-5 grid-cols-2 gap-5">
                        <div className='flex flex-col col-span-1'>  
                            <FormField name="age" label="Age" formError={formErrors.age}>
                                <FormInput
                                name="age"
                                inputType="number"
                                inputValue={age}
                                inputErrors={formErrors.age}
                                handleChange={handleChange}
                                placeholder="Age"
                                ></FormInput>
                        </FormField>
                        </div>
                        <div className='flex flex-col col-span-1'>     
                            <FormField name="height" label="Height(inches)" formError={formErrors.height}>
                                <FormInput
                                name="height"
                                inputType="number"
                                inputValue={height}
                                inputErrors={formErrors.height}
                                handleChange={handleChange}
                                placeholder={"Height"}
                                ></FormInput>
                            </FormField>
                        </div>
                        <div className='flex flex-col col-span-1'> 
                            <FormField name="weight" label="Weight(lbs)" formError={formErrors.weight}>
                                <FormInput
                                name="weight"
                                inputType="number"
                                inputValue={weight}
                                inputErrors={formErrors.weight}
                                handleChange={handleChange}
                                placeholder="Weight"
                                ></FormInput>
                            </FormField>
                        </div>
                        <div className='flex flex-col col-span-1'> 
                            <FormField name="gender" label="Gender" formError={formErrors.gender}>
                                <select
                                className={`form-input ${formErrors?.gender && !gender && 'form-input-error'}`}
                                name='gender'
                                value={gender}
                                onChange={handleChange}
                                aria-label='gender'
                                >
                                    <option value="">--Please Select A Gender--</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="prefer_not_to_say">Prefer Not To Say</option>
                                </select>
                            </FormField>
                        </div>
                        <div className='flex flex-col col-span-2'> 
                            <FormField name="activity_level" label="Activity Level" formError={formErrors.activity_level}>
                                <select
                                className={`form-input ${formErrors?.activity_level && !activity_level && 'form-input-error'} placeholder: pl-5`}
                                name='activity_level'
                                value={activity_level}
                                onChange={handleChange}
                                >
                                    <option value="">--Please Select An Activity Level--</option>
                                    <option value="sedentary">Sedentary</option>
                                    <option value="light">Light</option>
                                    <option value="moderate">Moderate</option>
                                    <option value="active">Active</option>
                                    <option value="very_active">Very Active</option>
                                </select>
                            </FormField>
                        </div>
                            <div className='flex flex-col col-span-2'> 
                            <FormField name="goal" label="Goal" formError={formErrors.goal}>
                                <select
                                className={`form-input ${formErrors?.goal && !goal && 'form-input-error'} placeholder: pl-5`}
                                name='goal'
                                value={goal}
                                onChange={handleChange}
                                >
                                    <option value="">--Please Select A Goal--</option>
                                    <option value="cut">Cut</option>
                                    <option value="maintain">Maintain</option>
                                    <option value="bulk">Bulk</option>
                                </select>
                            </FormField>
                        </div>
                        <div className="col-span-4 grid grid-cols-1 md:grid-cols-1 gap-5">
                            <div className='flex flex-col col-span-1 md:col-span-1'> 
                                <FormField name="username" label="Username" formError={formErrors.username}>
                                    <FormInput
                                    name="username"
                                    inputType="text"
                                    inputValue={username}
                                    inputErrors={formErrors.username}
                                    handleChange={handleChange}
                                    placeholder="Username"
                                    ></FormInput>
                                </FormField>
                            </div>
                        </div>
                        <div className='flex flex-col col-span-4'> 
                            <FormField name="password" label="Password" formError={formErrors.password}>
                                <span className='flex flex-row gap-3'>    
                                    <FormInput
                                    name="password"
                                    inputType={passwordVisible ? "text" : "password"}
                                    inputValue={password}
                                    inputErrors={formErrors.password}
                                    handleChange={handleChange}
                                    placeholder="Password"
                                    ></FormInput>
                                    <button 
                                    type="button" 
                                    className={passwordVisible === true ? 'border rounded-md p-1 bg-gray-100 hover:bg-gray-100 ' : 'border rounded-md p-1 hover:bg-gray-100'}
                                    onClick={handlePasswordToggle}
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
                                                d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"
                                                /> :
                                                <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z M3 3l18 18"
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
                                </span>
                            </FormField>
                        </div>
                        <div className='flex flex-col col-span-4'> 
                            <FormField name="email" label="Email" formError={formErrors.email}>
                                    <FormInput
                                    name="email"
                                    inputType="email"
                                    inputValue={email}
                                    inputErrors={formErrors.email}
                                    handleChange={handleChange}
                                    placeholder="Email"
                                    ></FormInput>
                            </FormField>
                        </div>
                        <div className='flex flex-row col-span-4 gap-3'> 
                            <input 
                            className=''
                            type='checkbox'
                            name='promoConsent'
                            checked={promoConsent}
                            onChange={handleChange}
                            aria-label='promoConsent'
                            />
                            <label htmlFor="promoConsent" className={`form-label`}>Agree to receive occasional promotional emails</label>
                        </div>
                        <div className='flex flex-row col-span-4 gap-3'>
                            <input 
                            className={`${formErrors?.agreeToTerms && !agreeToTerms && 'border-red-700'}`}
                            type='checkbox'
                            name='agreeToTerms'
                            checked={agreeToTerms}
                            onChange={handleChange}
                            aria-label='agreeToTerms'
                            />
                            <label htmlFor="agreeToTerms" className={`form-label ${formErrors?.agreeToTerms && !agreeToTerms && 'text-red-700'}`}>Agree to our <Link to="/legal/terms" className='hover:underline'>Terms of Service&#129133;</Link></label>
                            {hasErrors && formErrors.agreeToTerms &&
                                <div className='col-span-1 md:col-span-3'>
                                    <FieldErrorMessages field="agreeToTerms" error={formErrors.agreeToTerms} />
                                </div> 
                            }
                        </div>
                    </div>
                    <div className="flex-col col-span-1 md:col-span-4 flex items-center max-h-20 gap-5">
                        <span className='col-span-1 text-red-500'>
                            {serverErrorMessage && <p>{serverErrorMessage}</p>}
                        </span>
                        <button type='submit' className='border-1 border rounded-lg w-50 hover:bg-blue-100 hover:cursor-pointer' disabled={isPending}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}