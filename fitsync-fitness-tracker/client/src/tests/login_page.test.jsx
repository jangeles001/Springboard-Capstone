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

vi.mock('react-google-recaptcha', () => ({
  default: vi.forwardRef(({ onChange, sitekey }, ref) => (
    <div data-testid="recaptcha-mock">ReCAPTCHA</div>
  )),
}));

vi.mock('../features/login/components/LoginForm', () => ({
  default: () => <div data-testid="login-form">Login Form</div>,
}));

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Page Layout', () => {
    it('should render welcome heading', () => {
      render(<LoginPage />);

      expect(screen.getByLabelText(/welcome/i)).toBeInTheDocument();
    });

    it('should render LoginForm component', () => {
      render(<LoginPage />);

      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    it('should render all navigation links', () => {
      render(<LoginPage />);

      expect(screen.getByLabelText(/backToHomePage/i)).toBeInTheDocument();
      expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
      expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should have correct href for home page link', () => {
      render(<LoginPage />);

      const homeLink = screen.getByText(/back to home page/i).closest('a');
      expect(homeLink).toHaveAttribute('href', '/landing/');
    });

    it('should have correct href for forgot password link', () => {
      render(<LoginPage />);

      const forgotLink = screen.getByText(/forgot password\?/i).closest('a');
      expect(forgotLink).toHaveAttribute('href', '/auth/forgot-password/');
    });

    it('should have correct href for signup link', () => {
      render(<LoginPage />);

      const signupLink = screen.getByText(/don't have an account\?/i).closest('a');
      expect(signupLink).toHaveAttribute('href', '/auth/signup/');
    });
  });

  describe('Styling', () => {
    it('should render with proper layout classes', () => {
      const { container } = render(<LoginPage />);

      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('flex', 'flex-col', 'items-center');
    });

    it('should apply text styling to heading', () => {
      render(<LoginPage />);

      const heading = screen.getByLabelText(/welcome/i);
      const section = heading.closest('section');

      expect(section).toHaveClass('text-3xl', 'text-white', 'mb-10');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<LoginPage />);

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Welcome Back!');
    });

    it('should have hover effects on links', () => {
      render(<LoginPage />);

      const links = screen.getAllByRole('link');
      
      links.forEach(link => {
        expect(link).toHaveClass('hover:underline');
      });
    });
  });

  describe('Component Integration', () => {
    it('should render all components in correct order', () => {
      const { container } = render(<LoginPage />);

      const elements = container.querySelectorAll('*');
      const elementTypes = Array.from(elements).map(el => {
        if (el.querySelector('h1')) return 'heading';
        if (el.getAttribute('data-testid') === 'login-form') return 'form';
        if (el.tagName === 'A') return 'link';
        return null;
      }).filter(Boolean);

      // Heading should come before form
      const headingIndex = elementTypes.indexOf('heading');
      const formIndex = elementTypes.indexOf('form');
      expect(headingIndex).toBeLessThan(formIndex);
    });
  });
});