import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useCookiesStore } from '../features/cookies/store/CookiesStore';
import { useRegistrationForm } from '../features/registration/hooks/useRegistrationForm';
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
    // Mock useCookiesStore to return null consent
    useCookiesStore.mockReturnValue({
      consent: null,
      setConsent: vi.fn(),
    });

    render(<CookiesNotification />);

    // Check for main notification text and radio options    
    expect(screen.getByText(/This website uses cookies/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/allCookies/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/essentialCookies/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/declineCookies/i)).toBeInTheDocument();
  });

  it('should not render if consent already given', () => {
    useCookiesStore.mockReturnValue({
      consent: 'All',
      setConsent: vi.fn(),
    });

    const { container } = render(<CookiesNotification />);

    // If consent is given, the component should return null and not render anything
    expect(container.firstChild).toBeNull();
  });

  it('should not render if cookies are disabled', () => {
    // Mock navigator.cookieEnabled to false
    Object.defineProperty(navigator, 'cookieEnabled', {
      writable: true,
      value: false,
    });

    useCookiesStore.mockReturnValue({
      consent: null,
      setConsent: vi.fn(),
    });

    // If cookies are disabled, the component should return null and not render anything
    const { container } = render(<CookiesNotification />);

    // Since the component returns null when cookies are disabled, the container's first child should be null
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
    const allRadio = screen.getByLabelText(/allCookies/i);
    await user.click(allRadio);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /continue/i });
    await user.click(submitButton);

    // Expect setConsent to have been called with 'All'
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

    // Check for Privacy Policy link
    const privacyLink = screen.getByText(/Privacy Policy/i).closest('a');
    expect(privacyLink).toHaveAttribute('href', '/legal/privacy');
  });

  it('should render all three radio options', () => {
    useCookiesStore.mockReturnValue({
      consent: null,
      setConsent: vi.fn(),
    });

    render(<CookiesNotification />);

    // Check that all three radio options are rendered
    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(3);
  });
});

describe('RegistrationForm Component', () => {
  // Mock form data and handlers
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
    // Clear all mocks before each test and set default mock return values
    vi.clearAllMocks();
    useRegistrationForm.mockReturnValue(mockFormData);
  });

  describe('Form Fields Rendering', () => {
    it('should render all input fields', () => {
      render(<RegistrationForm />);

      // Check for presence of all input fields by their placeholder text
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

      // Check for presence of select dropdowns by their text 
      expect(screen.getByText('--Please Select A Gender--')).toBeInTheDocument();
      expect(screen.getByText('--Please Select An Activity Level--')).toBeInTheDocument();
      expect(screen.getByText('--Please Select A Goal--')).toBeInTheDocument();
    });

    it('should render gender options', () => {
      render(<RegistrationForm />);

      // Check for presence of gender options by their text
      expect(screen.getByText('Male')).toBeInTheDocument();
      expect(screen.getByText('Female')).toBeInTheDocument();
      expect(screen.getByText('Prefer Not To Say')).toBeInTheDocument();
    });

    it('should render activity level options', () => {
      render(<RegistrationForm />);

      // Check for presence of activity level options by their text
      expect(screen.getByText('Sedentary')).toBeInTheDocument();
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Moderate')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Very Active')).toBeInTheDocument();
    });

    it('should render goal options', () => {
      render(<RegistrationForm />);

      // Check for presence of goal options by their text
      expect(screen.getByText('Cut')).toBeInTheDocument();
      expect(screen.getByText('Maintain')).toBeInTheDocument();
      expect(screen.getByText('Bulk')).toBeInTheDocument();
    });

    it('should render checkboxes', () => {
      render(<RegistrationForm />);

      // Check for presence of checkboxes by their role
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(2); // promoConsent and agreeToTerms
    });

    it('should render Terms of Service link', () => {
      render(<RegistrationForm />);

      // Check for Terms of Service link
      const termsLink = screen.getByText(/Terms of Service/i).closest('a');
      expect(termsLink).toHaveAttribute('href', '/legal/terms');
    });

    it('should render submit button', () => {
      render(<RegistrationForm />);

      // Check for submit button by its role and name
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

      // Type into first name input
      const firstNameInput = screen.getByPlaceholderText('First Name');
      await user.type(firstNameInput, 'John');

      // Expect handleChange to have been called for each character typed
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

      // Select a gender option
      const genderSelect = screen.getByLabelText('gender');
      await user.selectOptions(genderSelect, 'male');

      // Expect handleChange to have been called when selecting an option
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

      // Find the password visibility toggle button
      const buttons = screen.getAllByRole('button');
      const toggleButton = buttons.find(btn => btn.querySelector('svg')); // Assuming the eye icon is an SVG inside the button

      // Click the toggle button
      await user.click(toggleButton);

      // Expect handlePasswordToggle to have been called when the eye icon is clicked
      expect(mockPasswordToggle).toHaveBeenCalled();
    });

    it('should change password input type when passwordVisible changes', () => {
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        passwordVisible: true,
      });

      render(<RegistrationForm />);

      // Check that the password input type changes to text when passwordVisible is true
      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toHaveAttribute('type', 'text');
    });

    it('should show password as hidden by default', () => {
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        passwordVisible: false,
      });

      render(<RegistrationForm />);

      // Check that the password input type is password when passwordVisible is false
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

      // Click the submit button
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      // Expect handleSubmit to have been called when the form is submitted
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

      // Click the promoConsent checkbox
      const promoCheckbox = screen.getByLabelText(/promoConsent/i);
      await user.click(promoCheckbox);

      // Expect handleChange to have been called when the promoConsent checkbox is clicked
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

      // Click the agreeToTerms checkbox
      const termsCheckbox = screen.getByLabelText(/agreeToTerms/i);
      await user.click(termsCheckbox);

      // Expect handleChange to have been called
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

      // Check that the server error message is displayed when present
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

      // Check that the field error message is displayed when hasErrors is true
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

      // Check that all field error messages are displayed when hasErrors is true
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

      // Check that the input with an error has the error styling class applied
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

      // Check that the checkbox with an error has the error styling class applied
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

      // Check that the first name input displays the current value from the form state
      const firstNameInput = screen.getByPlaceholderText('First Name');
      expect(firstNameInput).toHaveValue('John');
    });

    it('should display current email value', () => {
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        email: 'john@example.com',
      });

      render(<RegistrationForm />);

      // Check that the email input displays the current value from the form state
      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toHaveValue('john@example.com');
    });

    it('should display checked state for promoConsent', () => {
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        promoConsent: true,
      });

      render(<RegistrationForm />);

      // Check that the promoConsent checkbox is checked when the value in the form state is true
      const promoCheckbox = screen.getByLabelText(/promoConsent/i);
      expect(promoCheckbox).toBeChecked();
    });

    it('should display checked state for agreeToTerms', () => {
      useRegistrationForm.mockReturnValue({
        ...mockFormData,
        agreeToTerms: true,
      });

      render(<RegistrationForm />);

      // Check that the agreeToTerms checkbox is checked when the value in the form state is true
      const termsCheckbox = screen.getByLabelText(/agreeToTerms/i);
      expect(termsCheckbox).toBeChecked();
    });
  });
});