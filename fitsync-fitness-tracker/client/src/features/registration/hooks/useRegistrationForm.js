import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "../services/registrationService";
import {
  useFormDataField,
  useFormErrors,
  useRegisterFormActions,
} from "../store/RegistrationStore";
export function useRegistrationForm({ onSuccessFunction }) {
  // Store state slices
  const fields = {
    firstName: useFormDataField("firstName"),
    lastName: useFormDataField("lastName"),
    gender: useFormDataField("gender"),
    age: useFormDataField("age"),
    height: useFormDataField("height"),
    weight: useFormDataField("weight"),
    username: useFormDataField("username"),
    password: useFormDataField("password"),
    email: useFormDataField("email"),
    promoConsent: useFormDataField("promoConsent"),
    agreeToTerms: useFormDataField("agreeToTerms"),
  };
  const formErrors = useFormErrors();

  // Store actions slice
  const {
    setFormField,
    setFormErrors,
    resetFormData,
    resetOnValidation,
    validateForm,
  } = useRegisterFormActions();

  // Flag for form submission errors
  const [hasErrors, setHasErrors] = useState(false);

  // Flag to toggle password visibility
  const [passwordType, setPasswordType] = useState("password");

  const registerMutation = useMutation({
    mutationFn: (formData) => register(formData),
  });

  // Updates a specific field in the form store when an input changes
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormField(name, type === "checkbox" ? checked : value);
    if (Object.keys(formErrors).includes(name)) delete formErrors[name];
  };

  // Validates and submit the form then resets the form and errors
  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasErrors(false);
    const { isValid, formErrors: validationErrors } = await validateForm();
    if (!isValid) {
      setHasErrors(true);
      resetFormData(validationErrors);
      return;
    }
    const formData = {
      ...fields,
      age: Number(fields.age),
      weight: Number(fields.weight),
    };
    registerMutation.mutate(formData, {
      onSuccess: () => {
        resetOnValidation();
        onSuccessFunction();
      },
      onError: (error) => {
        if (error.status === 400) {
          const details = error.response?.data?.details;
          if (details) {
            setFormErrors(details);
          }
        }
        setHasErrors(true);
      },
    });
  };

  return {
    ...fields,
    formErrors,
    hasErrors,
    passwordType,
    serverErrorMessage: registerMutation.error?.response?.data?.message,
    mutateError: registerMutation.error,
    setPasswordType,
    handleChange,
    handleSubmit,
  };
}
