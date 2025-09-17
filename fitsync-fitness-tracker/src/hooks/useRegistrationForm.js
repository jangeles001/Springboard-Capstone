import { useState } from "react";
import {
  useFormData,
  useFormErrors,
  useRegisterFormActions,
} from "../features/registration/store/RegistrationStore";

export function useRegistrationForm({ onSuccess }) {
  // Store state slices
  const formData = useFormData();
  const formErrors = useFormErrors();
  const { setFormField, resetFormData, resetOnValidation, validateForm } =
    useRegisterFormActions();

  // Flag for form submission errors
  const [hasErrors, setHasErrors] = useState(false);

  // Updates a specific field in the form store when an input changes
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormField(name, type === "checkbox" ? checked : value);
  };

  // Validates and submit the form then resets the form and errors
  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasErrors(false);
    const { isValid, formErrors } = await validateForm();
    if (!isValid) {
      setHasErrors(true);
      resetFormData(formErrors);
      return;
    }

    //TODO: Submit to DB using service/server component.
    resetOnValidation();
    if (onSuccess) onSuccess();
  };

  return {
    formData,
    formErrors,
    hasErrors,
    handleChange,
    handleSubmit,
  };
}
