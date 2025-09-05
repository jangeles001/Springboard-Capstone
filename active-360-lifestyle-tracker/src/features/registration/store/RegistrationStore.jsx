import { create } from 'zustand'

const initialFormData = {
  firstName: '',
  lastName: '',
  age: '',
  height: '',
  weight: '',
  username: '',
  password: '',
};

const initialErrors ={
  firstName: null,
  lastName: null,
  age: null,
  height: null,
  weight: null,
  userName: null,
  password: null,
};

export const useRegisterFormStore = create((set, get) => ({
    formData: initialFormData,
    formErrors: initialErrors,
    setFormField: (field, value) => set((state) => ({ 
        formData: {
            ...state.formData,
            [field]: value,
        },
    })),
    validateForm: () => {
        const { formData } = get();
        const formErrors = {};
        Object.entries(formData).forEach(([key,value]) => {
            switch(key){
                case "firstName":
                    if (!value) formErrors[key] = "First name is required";
                    else if (value.length < 2) formErrors[key] = "Must be at least 2 characters";
                    break;
                case "lastName":
                    if (!value) formErrors[key] = "Last name is required";
                    break;
                case "age":
                    if(!value) formErrors[key] = "Age is required"
                    break;
                case "height":
                    if(!value) formErrors[key] = "Height is required"
                    break;
                case "weight":
                    if(!value) formErrors[key] = "Height is required"
                    break;
                case "userName":
                    if(!value) formErrors[key] = "Height is required"
                    break;
                case "password":
                    if(!value) formErrors[key] = "Password is required"
                    break;
            }
        })
        set({ formErrors })
    },
    resetForm: () => set({
        formData: initialFormData,
        errors: initialErrors,
    }),
}));