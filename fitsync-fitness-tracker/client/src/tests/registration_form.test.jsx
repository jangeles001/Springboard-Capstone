import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useCookiesStore } from '../features/cookies/store/CookiesStore';
import { useRegistrationForm } from '../features/registration/hooks/useRegistrationForm';
import Cookies from 'js-cookie';
import userEvent from '@testing-library/user-event';
import CookiesNotification from '../features/cookies/component/CookiesNotification';
import RegistrationForm from '../features/registration/components/RegistrationForm';

// Mock dependencies
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useRouter: () => ({
    navigate: vi.fn(),
  }),
}));

vi.mock('../features/cookies/store/CookiesStore', () => ({
  useCookiesStore: vi.fn(),
}));

vi.mock('../features/registration/hooks/useRegistrationForm', () => ({
  useRegistrationForm: vi.fn(),
}));

vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

describe('CookiesNotification Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock navigator.cookieEnabled
    Object.defineProperty(navigator, 'cookieEnabled', {
      writable: true,
      value: true,
    });
  });

  it('should render when cookies are enabled and no consent given', () => {
    useCookiesStore.mockReturnValue({
      consent: null,
      setConsent: vi.fn(),
    });

    render(<CookiesNotification />);

    expect(screen.getByText(/This website uses cookies/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Allow all cookies/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Allow only essential cookies/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Decline all cookies/i)).toBeInTheDocument();
  });

  it('should not render if consent already given', () => {
    useCookiesStore.mockReturnValue({
      consent: 'All',
      setConsent: vi.fn(),
    });

    const { container } = render(<CookiesNotification />);

    expect(container.firstChild).toBeNull();
  });

  it('should not render if cookies are disabled', () => {
    Object.defineProperty(navigator, 'cookieEnabled', {
      writable: true,
      value: false,
    });

    useCookiesStore.mockReturnValue({
      consent: null,
      setConsent: vi.fn(),
    });

    const { container } = render(<CookiesNotification />);

    expect(container.firstChild).toBeNull();
  });

  it('should call setConsent when form is submitted with "All"', async () => {
    const user = userEvent.setup();
    const mockSetConsent = vi.fn();

    useCookiesStore.mockReturnValue({
      consent: null,
      setConsent: mockSetConsent,
    });

    render(<CookiesNotification />);

    // Select "Allow all cookies"
    const allRadio = screen.getByLabelText(/Allow all cookies/i);
    await user.click(allRadio);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /continue/i });
    await user.click(submitButton);

    expect(mockSetConsent).toHaveBeenCalledWith('All');
  });

  it('should call setConsent when form is submitted with "Essential"', async () => {
    const user = userEvent.setup();
    const mockSetConsent = vi.fn();

    useCookiesStore.mockReturnValue({
      consent: null,
      setConsent: mockSetConsent,
    });

    render(<CookiesNotification />);

    // Select "Allow only essential cookies"
    const essentialRadio = screen.getByLabelText(/Allow only essential cookies/i);
    await user.click(essentialRadio);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /continue/i });
    await user.click(submitButton);

    expect(mockSetConsent).toHaveBeenCalledWith('Essential');
  });

  it('should call setConsent when form is submitted with "Decline"', async () => {
    const user = userEvent.setup();
    const mockSetConsent = vi.fn();

    useCookiesStore.mockReturnValue({
      consent: null,
      setConsent: mockSetConsent,
    });

    render(<CookiesNotification />);

    // Select "Decline all cookies"
    const declineRadio = screen.getByLabelText(/Decline all cookies/i);
    await user.click(declineRadio);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /continue/i });
    await user.click(submitButton);

    expect(mockSetConsent).toHaveBeenCalledWith('Decline');
  });

  it('should render Privacy Policy link', () => {
    useCookiesStore.mockReturnValue({
      consent: null,
      setConsent: vi.fn(),
    });

    render(<CookiesNotification />);

    const privacyLink = screen.getByText(/Privacy Policy/i).closest('a');
    expect(privacyLink).toHaveAttribute('href', '/legal/privacy');
  });

  it('should render all three radio options', () => {
    useCookiesStore.mockReturnValue({
      consent: null,
      setConsent: vi.fn(),
    });

    render(<CookiesNotification />);

    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(3);
  });
});

describe('RegistrationForm Component', () => {
  const mockFormData = {
    firstName: '',
    lastName: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    activity_level: '',
    goal: '',
    username: '',
    password: '',
    email: '',
    promoConsent: false,
    agreeToTerms: false,
    formErrors: {},
    hasErrors: false,
    serverErrorMessage: null,
    passwordVisible: false,
    handlePasswordToggle: vi.fn(),
    handleChange: vi.fn(),
    handleSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useRegistrationForm.mockReturnValue(mockFormData);
  });

  describe('Form Fields Rendering', () => {
    it('should render all input fields', () => {
      render(<RegistrationForm />);

      expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Age')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Height')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Weight')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    });

    it('should render all select dropdowns', () => {
      render(<RegistrationForm />);

      expect(screen.getByText('--Please Select A Gender--')).toBeInTheDocument();
      expect(screen.getByText('--Please Select An Activity Level--')).toBeInTheDocument();
      expect(screen.getByText('--Please Select A Goal--')).toBeInTheDocument();
    });

    it('should render gender options', () => {
      render(<RegistrationForm />);

      expect(screen.getByText('Male')).toBeInTheDocument();
      expect(screen.getByText('Female')).toBeInTheDocument();
      expect(screen.getByText('Prefer Not To Say')).toBeInTheDocument();
    });

    it('should render activity level options', () => {
      render(<RegistrationForm />);

      expect(screen.getByText('Sedentary')).toBeInTheDocument();
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Moderate')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Very Active')).toBeInTheDocument();
    });

    it('should render goal options', () => {
      render(<RegistrationForm />);

      expect(screen.getByText('Cut')).toBeInTheDocument();
      expect(screen.getByText('Maintain')).toBeInTheDocument();
      expect(screen.getByText('Bulk')).toBeInTheDocument();
    });

    it('should render checkboxes', () => {
      render(<RegistrationForm />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(2); // promoConsent and agreeToTerms
    });

    it('should render Terms of Service link', () => {
      render(<RegistrationForm />);

      const termsLink = screen.getByText(/Terms of Service/i).closest('a');
      expect(termsLink).toHaveAttribute('href', '/legal/terms');
    });

    it('should render submit button', () => {
      render(<RegistrationForm />);

      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call handleChange when typing in first name', async () => {
      const user = userEvent.setup();
      const mockHandleChange = vi.fn();
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        handleChange: mockHandleChange,
      });

      render(<RegistrationForm />);

      const firstNameInput = screen.getByPlaceholderText('First Name');
      await user.type(firstNameInput, 'John');

      expect(mockHandleChange).toHaveBeenCalled();
    });

    it('should call handleChange when selecting gender', async () => {
      const user = userEvent.setup();
      const mockHandleChange = vi.fn();
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        handleChange: mockHandleChange,
      });

      render(<RegistrationForm />);

      const genderSelect = screen.getByLabelText('gender');
      await user.selectOptions(genderSelect, 'male');

      expect(mockHandleChange).toHaveBeenCalled();
    });

    it('should call handlePasswordToggle when eye icon is clicked', async () => {
      const user = userEvent.setup();
      const mockPasswordToggle = vi.fn();
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        handlePasswordToggle: mockPasswordToggle,
      });

      render(<RegistrationForm />);

      // Find the password visibility toggle button (next to password input)
      const buttons = screen.getAllByRole('button');
      const toggleButton = buttons.find(btn => btn.querySelector('svg'));

      await user.click(toggleButton);

      expect(mockPasswordToggle).toHaveBeenCalled();
    });

    it('should change password input type when passwordVisible changes', () => {
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        passwordVisible: true,
      });

      render(<RegistrationForm />);

      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toHaveAttribute('type', 'text');
    });

    it('should show password as hidden by default', () => {
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        passwordVisible: false,
      });

      render(<RegistrationForm />);

      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should call handleSubmit when form is submitted', async () => {
      const user = userEvent.setup();
      const mockHandleSubmit = vi.fn((e) => e.preventDefault());
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        handleSubmit: mockHandleSubmit,
      });

      render(<RegistrationForm />);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it('should check promoConsent checkbox when clicked', async () => {
      const user = userEvent.setup();
      const mockHandleChange = vi.fn();
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        handleChange: mockHandleChange,
      });

      render(<RegistrationForm />);

      const promoCheckbox = screen.getByLabelText(/promoConsent/i);
      await user.click(promoCheckbox);

      expect(mockHandleChange).toHaveBeenCalled();
    });

    it('should check agreeToTerms checkbox when clicked', async () => {
      const user = userEvent.setup();
      const mockHandleChange = vi.fn();
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        handleChange: mockHandleChange,
      });

      render(<RegistrationForm />);

      const termsCheckbox = screen.getByLabelText(/agreeToTerms/i);
      await user.click(termsCheckbox);

      expect(mockHandleChange).toHaveBeenCalled();
    });
  });

  describe('Form Validation Display', () => {
    it('should display server error message when present', () => {
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        serverErrorMessage: 'Email already exists',
      });

      render(<RegistrationForm />);

      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });

    it('should display field errors when hasErrors is true', () => {
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        hasErrors: true,
        formErrors: {
          firstName: ['First name is required!'],
        },
      });

      render(<RegistrationForm />);

      expect(screen.getByText('*First name is required!')).toBeInTheDocument();
    });

    it('should display multiple field errors', () => {
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        hasErrors: true,
        formErrors: {
          firstName: ['First name is required!'],
          email: ['Email is required!', 'Enter a valid email address!'],
        },
      });

      render(<RegistrationForm />);

      expect(screen.getByText('*First name is required!')).toBeInTheDocument();
      expect(screen.getByText('*Email is required!')).toBeInTheDocument();
      expect(screen.getByText('*Enter a valid email address!')).toBeInTheDocument();
    });

    it('should apply error styling to inputs with errors', () => {
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        formErrors: {
          firstName: ['First name is required!'],
        },
        firstName: '', // Empty value triggers error styling
      });

      render(<RegistrationForm />);

      const firstNameInput = screen.getByPlaceholderText('First Name');
      expect(firstNameInput).toHaveClass('form-input-error');
    });

    it('should apply error styling to checkboxes with errors', () => {
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        hasErrors: true,
        formErrors: {
          agreeToTerms: ['Agreement to our Terms of Service is required!'],
        },
        agreeToTerms: false,
      });

      render(<RegistrationForm />);

      const termsCheckbox = screen.getByLabelText(/agreeToTerms/i);
      expect(termsCheckbox).toHaveClass('border-red-700');
    });
  });

  describe('Controlled Inputs', () => {
    it('should display current firstName value', () => {
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        firstName: 'John',
      });

      render(<RegistrationForm />);

      const firstNameInput = screen.getByPlaceholderText('First Name');
      expect(firstNameInput).toHaveValue('John');
    });

    it('should display current email value', () => {
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        email: 'john@example.com',
      });

      render(<RegistrationForm />);

      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toHaveValue('john@example.com');
    });

    it('should display checked state for promoConsent', () => {
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        promoConsent: true,
      });

      render(<RegistrationForm />);

      const promoCheckbox = screen.getByLabelText(/promoConsent/i);
      expect(promoCheckbox).toBeChecked();
    });

    it('should display checked state for agreeToTerms', () => {
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        agreeToTerms: true,
      });

      render(<RegistrationForm />);

      const termsCheckbox = screen.getByLabelText(/agreeToTerms/i);
      expect(termsCheckbox).toBeChecked();
    });
  });
});