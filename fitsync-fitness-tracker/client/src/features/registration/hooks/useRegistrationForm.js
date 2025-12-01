import { useState } from "react";
import { register } from "../services/registrationService";
import {
  useFormDataField,
  useFormErrors,
  useRegisterFormActions,
} from "../store/RegistrationStore";
import { useUserActions } from "../../../store/UserStore.js";
export function useRegistrationForm({ onSuccess }) {
  // Store state slices
  const fields = {
    firstName: useFormDataField("firstName"),
    lastName: useFormDataField("lastName"),
    age: Number(useFormDataField("age")),
    height: useFormDataField("height"),
    weight: Number(useFormDataField("weight")),
    username: useFormDataField("username"),
    password: useFormDataField("password"),
    email: useFormDataField("email"),
    promoConsent: useFormDataField("promoConsent"),
    agreeToTerms: useFormDataField("agreeToTerms"),
  };
  const formErrors = useFormErrors();
  const { setUsername, setPublicId } = useUserActions();

  // Store actions slice
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
    const { isValid, formErrors: validationErrors } = await validateForm();
    if (!isValid) {
      setHasErrors(true);
      resetFormData(validationErrors);
      return;
    }
    // Submit to DB using registration service
    try {
      const { username, publicId } = await register(fields);
      resetOnValidation();
      setUsername(username);
      setPublicId(publicId);
      if (onSuccess) onSuccess();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {
    ...fields,
    formErrors,
    hasErrors,
    handleChange,
    handleSubmit,
  };
}
