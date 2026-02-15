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
      const toggleButton = buttons.find(btn => btn.querySelector('svg'));

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
      const user = userEvent.setup();
      const mockHandleChange = vi.fn();

      useLoginForm.mockReturnValue({
        ...mockFormData,
        handleChange: mockHandleChange,
      });

      render(<LoginForm />);

      const passwordInput = screen.getByPlaceholderText('Password');
      await user.type(passwordInput, 'password123');

      expect(mockHandleChange).toHaveBeenCalled();
    });

    it('should call handlePasswordToggle when visibility button is clicked', async () => {
      const user = userEvent.setup();
      const mockPasswordToggle = vi.fn();

      useLoginForm.mockReturnValue({
        ...mockFormData,
        handlePasswordToggle: mockPasswordToggle,
      });

      render(<LoginForm />);

      const buttons = screen.getAllByRole('button');
      const toggleButton = buttons.find(btn => btn.querySelector('svg'));

      await user.click(toggleButton);

      expect(mockPasswordToggle).toHaveBeenCalled();
    });

    it('should call setCaptchaValue when ReCAPTCHA is completed', async () => {
      const user = userEvent.setup();
      const mockSetCaptchaValue = vi.fn();

      useLoginForm.mockReturnValue({
        ...mockFormData,
        setCaptchaValue: mockSetCaptchaValue,
      });

      render(<LoginForm />);

      const captchaTrigger = screen.getByTestId('recaptcha-trigger');
      await user.click(captchaTrigger);

      expect(mockSetCaptchaValue).toHaveBeenCalledWith('mock-captcha-token');
    });

    it('should call handleSubmit when form is submitted', async () => {
      const user = userEvent.setup();
      const mockHandleSubmit = vi.fn((e) => e.preventDefault());

      useLoginForm.mockReturnValue({
        ...mockFormData,
        handleSubmit: mockHandleSubmit,
      });

      render(<LoginForm />);

      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });

  describe('Controlled Inputs', () => {
    it('should display email value from hook', () => {
      useLoginForm.mockReturnValue({
        ...mockFormData,
        formDataEmail: 'user@example.com',
      });

      render(<LoginForm />);

      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toHaveValue('user@example.com');
    });

    it('should display password value from hook', () => {
      useLoginForm.mockReturnValue({
        ...mockFormData,
        formDataPassword: 'mypassword',
      });

      render(<LoginForm />);

      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toHaveValue('mypassword');
    });
  });

  describe('Error Display', () => {
    it('should display email field errors', () => {
      useLoginForm.mockReturnValue({
        ...mockFormData,
        formErrors: {
          email: ['Email is required'],
        },
      });

      render(<LoginForm />);

      expect(screen.getByText('*Email is required')).toBeInTheDocument();
    });

    it('should display password field errors', () => {
      useLoginForm.mockReturnValue({
        ...mockFormData,
        formErrors: {
          password: ['Password is required'],
        },
      });

      render(<LoginForm />);

      expect(screen.getByText('*Password is required')).toBeInTheDocument();
    });

    it('should display server error message when present', () => {
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

      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('should not display server error if details exist', () => {
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

      expect(screen.queryByText('Validation failed')).not.toBeInTheDocument();
    });

    it('should apply error styling to email input when error exists', () => {
      useLoginForm.mockReturnValue({
        ...mockFormData,
        formDataEmail: '',
        formErrors: {
          email: ['Email is required'],
        },
      });

      render(<LoginForm />);

      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toHaveClass('form-input-error');
    });

    it('should apply error styling to password input when error exists', () => {
      useLoginForm.mockReturnValue({
        ...mockFormData,
        formDataPassword: '',
        formErrors: {
          password: ['Password is required'],
        },
      });

      render(<LoginForm />);

      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toHaveClass('form-input-error');
    });
  });

  describe('Loading State', () => {
    it('should disable login button when isLoading is true', () => {
      useLoginForm.mockReturnValue({
        ...mockFormData,
        isLoading: true,
      });

      render(<LoginForm />);

      const loginButton = screen.getByRole('button', { name: /login/i });
      expect(loginButton).toBeDisabled();
    });

    it('should not disable login button when isLoading is false', () => {
      useLoginForm.mockReturnValue({
        ...mockFormData,
        isLoading: false,
      });

      render(<LoginForm />);

      const loginButton = screen.getByRole('button', { name: /login/i });
      expect(loginButton).not.toBeDisabled();
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should show eye icon when password is hidden', () => {
      useLoginForm.mockReturnValue({
        ...mockFormData,
        passwordVisible: false,
      });

      render(<LoginForm />);

      const buttons = screen.getAllByRole('button');
      const toggleButton = buttons.find(btn => btn.querySelector('svg'));

      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).not.toHaveClass('bg-gray-200');
    });

    it('should show different eye icon when password is visible', () => {
      useLoginForm.mockReturnValue({
        ...mockFormData,
        passwordVisible: true,
      });

      render(<LoginForm />);

      const buttons = screen.getAllByRole('button');
      const toggleButton = buttons.find(btn => btn.querySelector('svg'));

      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveClass('bg-gray-200');
    });
  });

  describe('Form Submission', () => {
    it('should submit form with email, password, and captcha token', async () => {
      const user = userEvent.setup();
      const mockHandleSubmit = vi.fn((e) => e.preventDefault());

      useLoginForm.mockReturnValue({
        ...mockFormData,
        formDataEmail: 'test@example.com',
        formDataPassword: 'password123',
        handleSubmit: mockHandleSubmit,
      });

      render(<LoginForm />);

      // Complete captcha
      const captchaTrigger = screen.getByTestId('recaptcha-trigger');
      await user.click(captchaTrigger);

      // Submit form
      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });
});