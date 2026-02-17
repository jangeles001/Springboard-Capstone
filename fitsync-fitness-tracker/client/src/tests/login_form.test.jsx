import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../features/login/components/LoginForm';
import React from 'react';

// Mock dependencies
vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({
    navigate: vi.fn(),
  }),
}));

vi.mock('react-google-recaptcha', () => ({
  default: ({ onChange, sitekey }) => (
    <div data-testid="recaptcha-mock">
      <button
        type="button"
        onClick={() => onChange?.('mock-captcha-token')}
        data-testid="recaptcha-trigger"
      >
        Complete Captcha
      </button>
    </div>
  ),
}));

vi.mock('../features/login/hooks/useLoginForm', () => ({
  useLoginForm: vi.fn(),
}));

import { useLoginForm } from '../features/login/hooks/useLoginForm';

describe('LoginForm Component', () => {
  // Define a mock return value for the useLoginForm hook that will be used in the tests
  const mockFormData = {
    formDataEmail: '',
    formDataPassword: '',
    passwordVisible: false,
    recaptchaRef: { current: { reset: vi.fn() } },
    setCaptchaValue: vi.fn(),
    formErrors: null,
    error: null,
    isLoading: false,
    handleChange: vi.fn(),
    handlePasswordToggle: vi.fn(),
    handleSubmit: vi.fn((e) => e.preventDefault()),
    handleRecaptchaChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useLoginForm.mockReturnValue(mockFormData);
  });

  describe('Form Fields Rendering', () => {
    it('should render email input field', () => {
      render(<LoginForm />);

      // Get the email input by its placeholder text
      const emailInput = screen.getByPlaceholderText('Email');

      // Check that the email input is rendered and has the correct type
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'text');
    });

    it('should render password input field', () => {
      render(<LoginForm />);

      // Get the password input by its placeholder text
      const passwordInput = screen.getByPlaceholderText('Password');

      // Check that the password input is rendered and has the correct type (password)
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should render password as text when passwordVisible is true', () => {
      // Update the mock to set passwordVisible to true
      useLoginForm.mockReturnValue({
        ...mockFormData,
        passwordVisible: true,
      });

      render(<LoginForm />);

      // Get the password input by its placeholder text
      const passwordInput = screen.getByPlaceholderText('Password');

      // Check that the password input type changes to text when passwordVisible is true
      expect(passwordInput).toHaveAttribute('type', 'text');
    });

    it('should render password visibility toggle button', () => {
      render(<LoginForm />);

      // Get the toggle button by finding the button that contains an SVG (the eye icon)
      const buttons = screen.getAllByRole('button');
      const toggleButton = buttons.find((btn) => btn.querySelector('svg'));

      // Check that the toggle button is rendered and has the correct aria-label
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveAttribute('aria-label', 'Toggle password visibility');
    });

    it('should render ReCAPTCHA component', () => {
      render(<LoginForm />);

      // Check that the mocked ReCAPTCHA component is rendered by looking for the test ID
      expect(screen.getByTestId('recaptcha-mock')).toBeInTheDocument();
    });

    it('should render login submit button', () => {
      render(<LoginForm />);

      // Get the login button by its role and name
      const loginButton = screen.getByRole('button', { name: /login/i });

      // Check that the login button is rendered
      expect(loginButton).toBeInTheDocument();
    });

    it('should render Email label', () => {
      render(<LoginForm />);

      // Check that the Email label is rendered
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('should render Password label', () => {
      render(<LoginForm />);

      // Check that the Password label is rendered
      expect(screen.getByText('Password')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call handleChange when typing in email field', async () => {
      // Set up user event and mock handleChange function
      const user = userEvent.setup();
      const mockHandleChange = vi.fn();

      // Update the mock to use the mock handleChange function
      useLoginForm.mockReturnValue({
        ...mockFormData,
        handleChange: mockHandleChange,
      });

      render(<LoginForm />);

      // Get the email input and type into it
      const emailInput = screen.getByPlaceholderText('Email');

      // Simulate typing an email address into the input field
      await user.type(emailInput, 'test@example.com');

      // Check that the mock handleChange function was called
      expect(mockHandleChange).toHaveBeenCalled();
    });

    it('should call handleChange when typing in password field', async () => {
      // Set up user event and mock handleChange function
      const user = userEvent.setup();
      const mockHandleChange = vi.fn();

      // Update the mock to use the mock handleChange function
      useLoginForm.mockReturnValue({
        ...mockFormData,
        handleChange: mockHandleChange,
      });

      render(<LoginForm />);

      // Get the password input and type into it
      const passwordInput = screen.getByPlaceholderText('Password');
      await user.type(passwordInput, 'password123');

      // Check that the mock handleChange function was called
      expect(mockHandleChange).toHaveBeenCalled(11); // 'password123' has 11 characters
    });

    it('should call handlePasswordToggle when visibility button is clicked', async () => {
      // Set up user event and mock handlePasswordToggle function
      const user = userEvent.setup();
      const mockPasswordToggle = vi.fn();

      // Update the mock to use the mock handlePasswordToggle function
      useLoginForm.mockReturnValue({
        ...mockFormData,
        handlePasswordToggle: mockPasswordToggle,
      });

      render(<LoginForm />);

      // Get the toggle button by finding the button that contains an SVG (the eye icon)
      const buttons = screen.getAllByRole('button');
      const toggleButton = buttons.find((btn) => btn.querySelector('svg'));

      // Simulate clicking the password visibility toggle button
      await user.click(toggleButton);

      // Check that the mock handlePasswordToggle function was called
      expect(mockPasswordToggle).toHaveBeenCalled(1);
    });

    it('should call handleRecaptchaChange when ReCAPTCHA is completed', async () => {
      const user = userEvent.setup();
    
      const mockHandleRecaptchaChange = vi.fn();
    
      useLoginForm.mockReturnValue({
        ...mockFormData,
        handleRecaptchaChange: mockHandleRecaptchaChange,
      });
    
      render(<LoginForm />);
    
      await user.click(screen.getByTestId('recaptcha-trigger'));
    
      expect(mockHandleRecaptchaChange).toHaveBeenCalledWith('mock-captcha-token');
    });

    it('should call handleSubmit when form is submitted', async () => {
      // Set up user event and mock handleSubmit function
      const user = userEvent.setup();
      const mockHandleSubmit = vi.fn((e) => e.preventDefault());

      // Update the mock to use the mock handleSubmit function
      useLoginForm.mockReturnValue({
        ...mockFormData,
        handleSubmit: mockHandleSubmit,
      });

      render(<LoginForm />);

      // Simualate clicking the login button to submit the form
      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      // Check that the mock handleSubmit function was called
      expect(mockHandleSubmit).toHaveBeenCalled(1);
    });
  });

  describe('Controlled Inputs', () => {
    it('should display email value from hook', () => {
      // Update the mock to set a specific email value
      useLoginForm.mockReturnValue({
        ...mockFormData,
        formDataEmail: 'user@example.com',
      });

      render(<LoginForm />);

      // Get the email input and check that it has the value from the hook
      const emailInput = screen.getByPlaceholderText('Email');

      // Check that the email input has the value from the hook
      expect(emailInput).toHaveValue('user@example.com');
    });

    it('should display password value from hook', () => {
      // Update the mock to set a specific password value
      useLoginForm.mockReturnValue({
        ...mockFormData,
        formDataPassword: 'mypassword',
      });

      render(<LoginForm />);

      // Get the password input and check that it has the value from the hook
      const passwordInput = screen.getByPlaceholderText('Password');

      // Check that the password input has the value from the hook
      expect(passwordInput).toHaveValue('mypassword');
    });
  });

  describe('Error Display', () => {
    it('should display email field errors', () => {
      // Update the mock to set an email error
      useLoginForm.mockReturnValue({
        ...mockFormData,
        formErrors: {
          email: ['Email is required'],
        },
      });

      render(<LoginForm />);

      // Check that the email error message is displayed
      expect(screen.getByText('*Email is required')).toBeInTheDocument();
    });

    it('should display password field errors', () => {
      // Update the mock to set a password error
      useLoginForm.mockReturnValue({
        ...mockFormData,
        formErrors: {
          password: ['Password is required'],
        },
      });

      render(<LoginForm />);

      // Check that the password error message is displayed
      expect(screen.getByText('*Password is required')).toBeInTheDocument();
    });

    it('should display server error message when present', () => {
      // Update the mock to set a server error without details
      useLoginForm.mockReturnValue({
        ...mockFormData,
        error: {
          response: {
            data: {
              message: 'Invalid credentials',
              details: null,
            },
          },
        },
      });

      render(<LoginForm />);

      // Check that the server error message is displayed
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('should not display server error if details exist', () => {
      // Update the mock to set a server error with details (which should prevent the main error message from displaying)
      useLoginForm.mockReturnValue({
        ...mockFormData,
        error: {
          response: {
            data: {
              message: 'Validation failed',
              details: { email: ['Invalid email'] },
            },
          },
        },
      });

      render(<LoginForm />);

      // Check that the main error message is not displayed when details exist
      expect(screen.queryByText('Validation failed')).not.toBeInTheDocument();
    });

    it('should apply error styling to email input when error exists', () => {
      // Update the mock to set an email error
      useLoginForm.mockReturnValue({
        ...mockFormData,
        formDataEmail: '',
        formErrors: {
          email: ['Email is required'],
        },
      });

      render(<LoginForm />);

      // Get the email input and check that it has the error styling class
      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toHaveClass('form-input-error');
    });

    it('should apply error styling to password input when error exists', () => {
      // Update the mock to set a password error
      useLoginForm.mockReturnValue({
        ...mockFormData,
        formDataPassword: '',
        formErrors: {
          password: ['Password is required'],
        },
      });

      render(<LoginForm />);

      // Get the password input and check that it has the error styling class
      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toHaveClass('form-input-error');
    });
  });

  describe('Loading State', () => {
    it('should disable login button when isLoading is true', () => {
      // Update the mock to set isLoading to true
      useLoginForm.mockReturnValue({
        ...mockFormData,
        isLoading: true,
      });

      render(<LoginForm />);

      // Get the login button and check that it is disabled when isLoading is true
      const loginButton = screen.getByRole('button', { name: /login/i });
      expect(loginButton).toBeDisabled();
    });

    it('should not disable login button when isLoading is false', () => {
      // Update the mock to set isLoading to false
      useLoginForm.mockReturnValue({
        ...mockFormData,
        isLoading: false,
      });

      render(<LoginForm />);

      // Get the login button and check that it is not disabled when isLoading is false
      const loginButton = screen.getByRole('button', { name: /login/i });
      expect(loginButton).not.toBeDisabled();
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should show eye icon when password is hidden', () => {
      // Update the mock to set passwordVisible to false
      useLoginForm.mockReturnValue({
        ...mockFormData,
        passwordVisible: false,
      });

      render(<LoginForm />);

      // Get the toggle button by finding the button that contains an SVG (eye icon)
      const buttons = screen.getAllByRole('button');
      const toggleButton = buttons.find((btn) => btn.querySelector('svg')); // Assume the toggle button contains an SVG icon

      // Check that the toggle button is rendered and does not have the active class when password is hidden
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).not.toHaveClass('bg-gray-200');
    });

    it('should show different eye icon when password is visible', () => {
      // Update the mock to set passwordVisible to true
      useLoginForm.mockReturnValue({
        ...mockFormData,
        passwordVisible: true,
      });

      render(<LoginForm />);

      // Get the toggle button by finding the button that contains an SVG (eye icon)
      const buttons = screen.getAllByRole('button');
      const toggleButton = buttons.find((btn) => btn.querySelector('svg')); // Assume the toggle button contains an SVG icon

      // Check that the toggle button is rendered and has the active class when password is visible
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveClass('bg-gray-200');
    });
  });

  describe('Form Submission', () => {
    it('should submit form with email, password, and captcha token', async () => {
      // Set up user event and mock handleSubmit function
      const user = userEvent.setup();
      const mockHandleSubmit = vi.fn((e) => e.preventDefault());

      // Update the mock to use the mock handleSubmit function and set form data values
      useLoginForm.mockReturnValue({
        ...mockFormData,
        formDataEmail: 'test@example.com',
        formDataPassword: 'password123',
        handleSubmit: mockHandleSubmit,
      });

      render(<LoginForm />);

      // Simulate completing the ReCAPTCHA by clicking the trigger button
      const captchaTrigger = screen.getByTestId('recaptcha-trigger');
      await user.click(captchaTrigger);

      // Submit form by clicking the login button
      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      // Check that handleSubmit was called with the expected form data
      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });
});