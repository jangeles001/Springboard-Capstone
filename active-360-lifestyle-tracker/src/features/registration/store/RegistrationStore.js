import { create } from "zustand";

const initialFormData = {
  firstName: "",
  lastName: "",
  age: "",
  height: "",
  weight: "",
  userName: "",
  password: "",
  email: "",
  promoConsent: false,
  agreeToTerms: false,
};

const validators = {
  firstName: [
    (value) => (!value ? "First name is required" : ""),
    (value) =>
      value?.length < 2 ? "First name must be at least 2 characters" : "",
  ],
  lastName: [(value) => (!value ? "Last name is required" : "")],
  age: [
    (value) => (!value ? "Age is required" : ""),
    (value) => (isNaN(Number(value)) ? "Age must be a number" : ""),
  ],
  height: [(value) => (!value ? "Height is required" : "")],
  weight: [(value) => (!value ? "Weight is required" : "")],
  userName: [
    (value) => (!value ? "Username is required" : ""),
    (value) =>
      value?.length < 3 ? "Username must be at least 3 characters" : "",
  ],
  password: [
    (value) => (!value ? "Password is required" : ""),
    (value) =>
      value?.length < 6 ? "Password must be at least 6 characters" : "",
  ],
  email: [
    (value) => (!value ? "Email is required" : ""),
    (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      return !emailRegex.test(value) ? "Enter a valid email address" : "";
    },
  ],
  agreeToTerms: [
    (value) =>
      value === false ? "Agreement to Terms of Service is required" : "",
  ],
};

export const useRegisterFormStore = create((set, get) => ({
  formData: initialFormData,
  formErrors: null,
  isValid: false,
  setFormField: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    })),
  resetForm: () =>
    set({
      formData: initialFormData,
      formErrors: null,
      isValid: false,
    }),
  validateForm: () => {
    const { formData } = get();
    const formErrors = {};

    for (const [field, rules] of Object.entries(validators)) {
      for (const validate of rules) {
        const error = validate(formData[field]);
        if (error) {
          formErrors[field] = [...(formErrors[field] || []), error];
        }
      }
    }

    const isValid = Object.keys(formErrors)?.length === 0;

    set({ formErrors, isValid });

    return { isValid };
  },
}));
