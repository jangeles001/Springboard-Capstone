import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  useFormDataPassword,
  useFormDataEmail,
  useFormErrors,
  useLoginActions,
} from "../store/LoginStore";
import { login } from "../services/loginService";

// Custom hook to manage login form state and behavior
export function useLoginForm({ onSuccessFunction }) {
  // Login store state slices
  const formDataEmail = useFormDataEmail();
  const formDataPassword = useFormDataPassword();
  const recaptchaRef = useRef(null);
  const [captchaValue, setCaptchaValue] = useState(null);
  const formErrors = useFormErrors();

  // Login store actions slice
  const { setFormField, setFormErrors, resetForm, validateForm } =
    useLoginActions();

  // Local State
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [hasErrors, setHasErrors] = useState(false); // Holds value for both client and mutation errors.

  // Mutation hook for handling login API call
  const loginMutation = useMutation({
    mutationFn: (userCredentials) => login(userCredentials),
  });

  // Updates a specific field in the form store when an input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormField(name, value);
    if (formErrors)
      if (Object.keys(formErrors).includes(name)) delete formErrors[name];
  };

  // Handles password visibility toggle
  const handlePasswordToggle = (e) => {
    e.preventDefault();
    setPasswordVisible((state) => !state);
  };

  // Validates and submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasErrors(false);

    // Runs validation logic from the store
    const { isValid } = await validateForm();

    if (!isValid) {
      setHasErrors(true);
      return;
    }

    if (!captchaValue) {
      setFormErrors((prev) => ({
        ...prev,
        reCaptchaError: "Please complete the reCAPTCHA verification.",
      }));
      setHasErrors(true);
      return;
    }

    loginMutation.mutate(
      // Calls query mutation function with the data from the login form
      {
        email: formDataEmail,
        password: formDataPassword,
        reCaptchaToken: captchaValue,
      },
      {
        onSuccess: () => {
          recaptchaRef.current?.reset();
          resetForm();
          onSuccessFunction();
        },
        onError: (error) => {
          recaptchaRef.current?.reset();
          if (error.status === 400) {
            const details = error.response?.data?.details;
            if (details) {
              setFormErrors(details);
            }
          }
          setHasErrors(true);
        },
      },
    );
  };

  return {
    formDataEmail,
    formDataPassword,
    passwordVisible,
    recaptchaRef,
    setCaptchaValue,
    formErrors,
    error: loginMutation.error,
    isLoading: loginMutation.isLoading,
    hasErrors,
    handleChange,
    handlePasswordToggle,
    handleSubmit,
  };
}
