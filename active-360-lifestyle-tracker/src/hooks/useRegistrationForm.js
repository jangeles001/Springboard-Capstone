import { useState } from 'react'
import { useRegisterFormStore }  from '../features/registration/store/RegistrationStore';

export function useRegistrationForm({ onSuccess }){
    const { formData, formErrors, setFormField, resetForm, validateForm } = useRegisterFormStore();
    const [ hasErrors, setHasErrors ] = useState(false);
        
    const handleChange = (e) => {
            const { name, type, value, checked } = e.target;
            setFormField(name, type === 'checkbox' ? checked : value);
        }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasErrors(false);
        const { isValid } = validateForm();

        if(!isValid){
            setHasErrors(true);
            return;
        }

        //TODO: Submit to DB using service/server component.

        resetForm();
        if (onSuccess) onSuccess();
        
        }

        return {
            formData,
            formErrors,
            hasErrors,
            handleChange,
            handleSubmit,
        };
    }