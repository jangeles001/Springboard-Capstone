import { create } from "zustand";

const initialFormData = {
  userName: null,
  password: null,
};

const validators = {
  userName: [(value) => (!value ? "Username is required" : "")],
  password: [(value) => (!value ? "password is required" : "")],
};

const useLoginFormStore = create((set, get) => ({
  formData: initialFormData,
  formErrors: null,
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
    // Resets form data and errors
    resetForm: () => {
      set({
        formData: initialFormData,
        formErrors: null,
        isValid: false,
      });
    },
    // Validates fields and update error messages
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
  },
}));

//state selectors
export const useFormDataUserName = () =>
  useLoginFormStore((state) => state.formData.userName);
export const useFormDataPassword = () =>
  useLoginFormStore((state) => state.formData.password);
export const useFormData = () => useLoginFormStore((state) => state.formData);
export const useFormErrors = () =>
  useLoginFormStore((state) => state.formErrors);
export const useIsValid = () => useLoginFormStore((state) => state.isValid);

//actions selector
export const useLoginActions = () =>
  useLoginFormStore((state) => state.actions);
