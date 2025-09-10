import { create } from 'zustand'

const initialFormData = {
    userName: '',
    password: '',
}

const initialFormErrors = {
    userName: null,
    password: null,
}

export const useLoginFormStore = create((set) => ({
    formData: initialFormData,
    formErrors: initialFormErrors,
    setFormField: (field, value) => set((state) => ({
        formData: {
            ...state.formData,
            [field]: value,
        },
    })),
    validateForm: (formData) => {
        const formErrors = {};
        Object.entries(formData).forEach(([key,value]) => {
            switch(key){
                case "userName":
                    if(!value) formErrors[key] = "Username required"
                    break;
                case"password":
                if(!value) formErrors[key] = "Password required"
                break;
            }   
        })
        set({ formErrors })
    },
}));