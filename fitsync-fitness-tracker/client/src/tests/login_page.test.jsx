import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoginPage } from '../features/login/pages/LoginPage';

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

// Mock the ReCAPTCHA component to avoid loading the actual library during tests
vi.mock('react-google-recaptcha', () => ({
  default: vi.forwardRef(({ onChange, sitekey }, ref) => (
    <div data-testid="recaptcha-mock">ReCAPTCHA</div>
  )),
}));

// Mock the LoginForm component to isolate tests to the LoginPage layout and navigation
vi.mock('../features/login/components/LoginForm', () => ({
  default: () => <div data-testid="login-form">Login Form</div>,
}));

describe('LoginPage Component', () => {
  // Clear all mocks before each test to ensure test isolation
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Page Layout', () => {
    // Test to check if the welcome heading is rendered on the page
    it('should render welcome heading', () => {
      render(<LoginPage />);

      // Check for the existance of the welcome heading using its aria-label
      expect(screen.getByLabelText(/welcome back!/i)).toBeInTheDocument();
    });

    it('should render LoginForm component', () => {
      render(<LoginPage />);

      // Check for the existance of the mocked LoginForm component using its test id
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    it('should render all navigation links', () => {
      render(<LoginPage />);

      // Check for the existance of all navigation links using their aria-labels and text content
      expect(screen.getByRole('link', { name: /< Back to home page/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /forgot password\?/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /don't have an account\?/i }  )).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should have correct href for home page link', () => {
      render(<LoginPage />);

      // Select the home page link using its text content and get the closest anchor element
      const homeLink = screen.getByRole('link', { name: /< Back to home page/i }).closest('a');

      // Check if the href attribute of the home page link is correct
      expect(homeLink).toHaveAttribute('href', '/landing/');
    });

    it('should have correct href for forgot password link', () => {
      render(<LoginPage />);

      // Select the forgot password link using its text content and get the closest anchor element
      const forgotLink = screen.getByRole('link', { name: /forgot password\?/i }).closest('a');
      
      // Check if the href attribute of the forgot password link is correct
      expect(forgotLink).toHaveAttribute('href', '/auth/forgot-password/');
    });

    it('should have correct href for signup link', () => {
      render(<LoginPage />);

      // Select the signup link using its text content and get the closest anchor element
      const signupLink = screen.getByRole('link', { name: /don't have an account\?/i }).closest('a');

      // Check if the href attribute of the signup link is correct
      expect(signupLink).toHaveAttribute('href', '/auth/signup/');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<LoginPage />);

      // Select the heading element using its role and level
      const h1 = screen.getByRole('heading', { level: 1 });

      // Check if the heading element has the correct text content
      expect(h1).toHaveTextContent('Welcome Back!');
    });

    it('should have hover effects on links', () => {
      render(<LoginPage />);

      // Select all link elements on the page
      const links = screen.getAllByRole('link');
      
      // Check if each link element has the hover:underline class for hover effects
      links.forEach(link => {
        expect(link).toHaveClass('hover:underline');
      });
    });
  });

  describe('Component Integration', () => {
    it('should render all components in correct order', () => {
      // Render the LoginPage component and get the container element for querying
      const { container } = render(<LoginPage />);

      // Query all elements in the container and map them to their types based on their attributes and tags
      const elements = container.querySelectorAll('*');
      const elementTypes = Array.from(elements).map(element => {
        if (element.querySelector('h1')) return 'heading';
        if (element.getAttribute('data-testid') === 'login-form') return 'form';
        if (element.tagName === 'A') return 'link';
        return null;
      }).filter(Boolean);

      // Check if the heading element appears before the form element in the rendered output
      const headingIndex = elementTypes.indexOf('heading');
      const formIndex = elementTypes.indexOf('form');
      expect(headingIndex).toBeLessThan(formIndex);
    });
  });
});