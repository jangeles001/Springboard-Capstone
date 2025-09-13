import { useState } from "react";
import { useRegisterFormStore } from "../features/registration/store/RegistrationStore";

export function useRegistrationForm({ onSuccess }) {
  const {
    formData,
    formErrors,
    setFormField,
    resetFormData,
    resetOnValidation,
    validateForm,
  } = useRegisterFormStore();

  const [hasErrors, setHasErrors] = useState(false);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormField(name, type === "checkbox" ? checked : value);
  };

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
