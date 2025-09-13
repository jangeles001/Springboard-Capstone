import { create } from "zustand";

const initialFormData = {
  userName: null,
  password: null,
};

const validators = {
  userName: [(value) => (!value ? "Username is required" : "")],
  password: [(value) => (!value ? "password is required" : "")],
};

export const useLoginFormStore = create((set, get) => ({
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
  resetForm: () => {
    set({
      formData: initialFormData,
      formErrors: null,
      isValid: false,
    });
  },
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
