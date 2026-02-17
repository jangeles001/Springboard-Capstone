import { create } from "zustand";

const initialFormData = {
  firstName: "",
  lastName: "",
  gender: "",
  age: "",
  height: "",
  weight: "",
  activity_level: "",
  goal: "",
  username: "",
  password: "",
  email: "",
  promoConsent: false,
  agreeToTerms: false,
};

// Validation cases
const validators = {
  firstName: [
    (value) => (!value ? "First name is required!" : ""),
    (value) =>
      value?.length < 2 ? "First name must be at least 2 characters!" : "",
  ],
  lastName: [(value) => (!value ? "Last name is required!" : "")],
  gender: [
    (value) => {
      //
      const validOptions = {
        male: "male",
        female: "female",
        perfer_not_to_say: "prefer_not_to_say",
      };
      return !Object.values(validOptions).includes(value)
        ? "Gender is required!"
        : "";
    },
  ],
  age: [
    (value) => (!value ? "Age is required!" : ""),
    (value) => (isNaN(Number(value)) ? "Age must be a number!" : ""),
  ],
  height: [(value) => (!value ? "Height is required!" : "")],
  weight: [(value) => (!value ? "Weight is required!" : "")],
  activity_level: [
    (value) => {
      //
      const validOptions = {
        sedentary: "sedentary",
        light: "light",
        moderate: "moderate",
        active: "active",
        very_active: "very_active",
      };
      return !Object.values(validOptions).includes(value)
        ? "Activity Level is required!"
        : "";
    },
  ],
  goal: [
    (value) => {
      //
      const validOptions = {
        cut: "cut",
        maintain: "maintain",
        bulk: "bulk",
      };
      return !Object.values(validOptions).includes(value)
        ? "Goal is required!"
        : "";
    },
  ],
  username: [
    (value) => (!value ? "Username is required!" : ""),
    (value) =>
      value?.length < 3 ? "Username must be at least 3 characters!" : "",
  ],
  password: [
    (value) => (!value ? "Password is required!" : ""),
    (value) =>
      value?.length < 6 ? "Password must be at least 6 characters!" : "",
  ],
  email: [
    (value) => (!value ? "Email is required!" : ""),
    (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      return !emailRegex.test(value) ? "Enter a valid email address!" : "";
    },
  ],
  agreeToTerms: [
    (value) =>
      value === false ? "Agreement to our Terms of Service is required!" : "",
  ],
};

const useRegisterFormStore = create((set, get) => ({
  formData: initialFormData,
  formErrors: {},
  isValid: false,
  actions: {
    // Updates a single form field
    setFormField: (field, value) =>
      set((state) => ({
        formData: {
          ...state.formData,
          [field]: value,
        },
      })),
    // Sets formErrors state via updater function or direct value
    setFormErrors: (updater) =>
      set((state) => ({
        formErrors:
          typeof updater === "function" ? updater(state.formErrors) : updater
    })),
    // Resets fields in the form that contains errors
    resetFormData: (formErrors) => {
      set((state) => {
        const newFormData = { ...state.formData };
        for (const field of Object.keys(formErrors)) {
          newFormData[field] =
            typeof state.formData[field] === "boolean" ? false : "";
        }
        return { formData: newFormData };
      });
    },
    // Resets form data, valid state, and errors
    resetOnValidation: () =>
      set({
        formData: initialFormData,
        formErrors: {},
        isValid: false,
      }),
    // Runs initial validations on the form data
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

      return { isValid, formErrors };
    },
  },
}));

// State selectors
export const useFormData = () =>
  useRegisterFormStore((state) => state.formData);
export const useFormDataField = (field) =>
  useRegisterFormStore((state) => state.formData[field]);
export const useFormErrors = () =>
  useRegisterFormStore((state) => state.formErrors);
export const useIsValid = () => useRegisterFormStore((state) => state.isValid);

// Actions selector
export const useRegisterFormActions = () =>
  useRegisterFormStore((state) => state.actions);
