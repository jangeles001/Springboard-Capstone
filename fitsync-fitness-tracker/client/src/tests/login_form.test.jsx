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

      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'text');
    });

    it('should render password input field', () => {
      render(<LoginForm />);

      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should render password as text when passwordVisible is true', () => {
      useLoginForm.mockReturnValue({
        ...mockFormData,
        passwordVisible: true,
      });

      render(<LoginForm />);

      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toHaveAttribute('type', 'text');
    });

    it('should render password visibility toggle button', () => {
      render(<LoginForm />);

      const buttons = screen.getAllByRole('button');
      const toggleButton = buttons.find(btn => btn.querySelector('svg'));

      expect(toggleButton).toBeInTheDocument();
    });

    it('should render ReCAPTCHA component', () => {
      render(<LoginForm />);

      expect(screen.getByTestId('recaptcha-mock')).toBeInTheDocument();
    });

    it('should render login submit button', () => {
      render(<LoginForm />);

      const loginButton = screen.getByRole('button', { name: /login/i });
      expect(loginButton).toBeInTheDocument();
    });

    it('should render Email label', () => {
      render(<LoginForm />);

      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('should render Password label', () => {
      render(<LoginForm />);

      expect(screen.getByText('Password')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call handleChange when typing in email field', async () => {
      const user = userEvent.setup();
      const mockHandleChange = vi.fn();

      useLoginForm.mockReturnValue({
        ...mockFormData,
        handleChange: mockHandleChange,
      });

      render(<LoginForm />);

      const emailInput = screen.getByPlaceholderText('Email');
      await user.type(emailInput, 'test@example.com');

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