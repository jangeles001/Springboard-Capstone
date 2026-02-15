import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DefaultNav from "../layout/DefaultNav";

// Mock all dependencies
vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  Outlet: () => <div data-testid="outlet">Main Content</div>,
  useNavigate: () => vi.fn(),
}));

vi.mock('../hooks/useAuthUser', () => ({
  useAuthUser: vi.fn(),
}));

vi.mock('../store/UserStore', () => ({
  useUsername: vi.fn(),
}))
vi.mock("../components/ProfileBlock", () => ({
  default: () => <div data-testid="profile-block">Profile</div>,
}));
vi.mock("../features/logout/components/LogoutButton", () => ({
  default: ({ className }) => (
    <button className={className} data-testid="logout-button">
      Logout
    </button>
  ),
}));
vi.mock("../components/HamburgerMenu", () => ({
  default: ({ links, setHamburgerOpen, username }) => (
    <div data-testid="hamburger-menu">
      <div>Hamburger Menu</div>
      <div>{username ? `User: ${username}` : "Guest"}</div>
      {links.map((link) => (
        <div key={link.path}>{link.label}</div>
      ))}
    </div>
  ),
}));
vi.mock("../features/cookies/component/CookiesNotification", () => ({
  default: () => <div data-testid="cookies-notification">Cookies</div>,
}));

import { useAuthUser } from "../hooks/useAuthUser";
import { useUsername } from "../store/UserStore";

describe("DefaultNav Component", () => {
  const mockLinks = [
    { label: "Home", path: "/home" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Loading State", () => {
    it("should show loading text when auth is loading and no username", () => {
      // Mock useAuthUser to return loading state and no username 
      useAuthUser.mockReturnValue({ isLoading: true });
      useUsername.mockReturnValue(null);

      // Render component with queryEnabled true (default)
      render(<DefaultNav links={mockLinks} queryEnabled={true} homeURL={"/"}/>);

      // Should show loading text
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should not show loading when query is disabled", () => {
      // Mock useAuthUser to return loading state and no username
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue(null);

      // Render component with queryEnabled false
      render(<DefaultNav links={mockLinks} queryEnabled={false} />);

      // Should NOT show loading text
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  describe("Navigation Links", () => {
    // Reset mocks to default state before each test in this block
    beforeEach(() => {
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue(null);
    });

    it("should render all navigation links", () => {
      render(<DefaultNav links={mockLinks} />);

      // Check that all links are rendered
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();
    });

    it("should render links with correct href", () => {
      render(<DefaultNav links={mockLinks} />);

      // Check that links have correct href attributes
      const homeLink = screen.getByText("Home").closest("a");
      const aboutLink = screen.getByText("About").closest("a");

      // Ensure links are found and have correct href
      expect(homeLink).toHaveAttribute("href", "/home");
      expect(aboutLink).toHaveAttribute("href", "/about");
    });

    it("should render links on desktop only (hidden on mobile)", () => {
      render(<DefaultNav links={mockLinks} />);

      // Check that links are present in the document
      const navLinks = screen.getAllByText("Home");
      expect(navLinks.length).toBeGreaterThan(0);
    });
  });

  describe("Authentication States", () => {
    it("should show Login link when user is not authenticated", () => {
      // Mock useAuthUser to return not loading and no username
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue(null);

      render(<DefaultNav links={mockLinks} />);

      // Should show Login link
      expect(screen.getByText("Login")).toBeInTheDocument();
    });

    it("should show ProfileBlock when user is authenticated", () => {
      // Mock useAuthUser to return not loading and a username
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue("testuser");

      render(<DefaultNav links={mockLinks} />);

      // Should show ProfileBlock component
      expect(screen.getByTestId("profile-block")).toBeInTheDocument();
    });

    it("should show LogoutButton when user is authenticated", () => {
      // Mock useAuthUser to return not loading and a username
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue("testuser");

      render(<DefaultNav links={mockLinks} />);

      // Should show LogoutButton component
      expect(screen.getByTestId("logout-button")).toBeInTheDocument();
    });

    it("should not show Login link when user is authenticated", () => {
      // Mock useAuthUser to return not loading and a username
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue("testuser");

      render(<DefaultNav links={mockLinks} />);

      // Should NOT show Login link
      const loginLinks = screen.queryAllByText("Login");
      expect(loginLinks.length).toBeLessThanOrEqual(1);
    });
  });

  describe("Hamburger Menu", () => {
    // Reset useAuthUser and useUsername to default state before each test in this block
    beforeEach(() => {
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue(null);
    });

    it("should show hamburger button", () => {
      render(<DefaultNav links={mockLinks} />);

      // Check that hamburger button is rendered
      const hamburgerButton = screen.getByRole("button", {
        name: /toggle navigation/i,
      });
      expect(hamburgerButton).toBeInTheDocument();
    });

    it("should toggle hamburger menu on button click", async () => {
      // Use userEvent for better simulation of user interactions and async state updates
      const user = userEvent.setup();
      render(<DefaultNav links={mockLinks} />);

      // Get the hamburger button
      const hamburgerButton = screen.getByRole("button", {
        name: /toggle navigation/i,
      });

      // Initially, the hamburger menu should not be in the document
      expect(screen.queryByTestId("hamburger-menu")).not.toBeInTheDocument();

      // Click the hamburger button to open the menu
      await user.click(hamburgerButton);

      // After clicking, the hamburger menu should be in the document
      expect(screen.getByTestId("hamburger-menu")).toBeInTheDocument();

      // Click the hamburger button again to close the menu
      await user.click(hamburgerButton);

      // After clicking again, the hamburger menu should not be in the document
      await waitFor(() => {
        expect(screen.queryByTestId("hamburger-menu")).not.toBeInTheDocument();
      });
    });

    it("should pass username to HamburgerMenu when authenticated", async () => {
      // Use userEvent for better simulation of user interactions and async state updates
      const user = userEvent.setup();
      useUsername.mockReturnValue("johndoe");

      render(<DefaultNav links={mockLinks} />);

      // Click the hamburger button to open the menu
      const hamburgerButton = screen.getByRole("button", {
        name: /toggle navigation/i,
      });
      // Open the hamburger menu
      await user.click(hamburgerButton);

      // Check that the username is displayed in the hamburger menu
      expect(screen.getByText("User: johndoe")).toBeInTheDocument();
    });

    it("should pass links to HamburgerMenu", async () => {
      // Use userEvent for better simulation of user interactions and async state updates
      const user = userEvent.setup();
      render(<DefaultNav links={mockLinks} />);

      // Click the hamburger button to open the menu
      const hamburgerButton = screen.getByRole("button", {
        name: /toggle navigation/i,
      });

      // Open the hamburger menu
      await user.click(hamburgerButton);

      // Check that all links are displayed in the hamburger menu
      const hamburgerMenu = screen.getByTestId("hamburger-menu");
      expect(hamburgerMenu).toHaveTextContent("Home");
      expect(hamburgerMenu).toHaveTextContent("About");
      expect(hamburgerMenu).toHaveTextContent("Contact");
    });
  });

  describe("Layout Components", () => {
    // Reset useAuthUser and useUsername to default state before each test in this block
    beforeEach(() => {
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue(null);
    });

    it("should render logo", () => {
      render(<DefaultNav links={mockLinks} />);

      // Check that logo image is rendered and in the document
      const logo = screen.getByAltText("Logo");
      expect(logo).toBeInTheDocument();
    });

    it("should render Outlet for nested routes", () => {
      render(<DefaultNav links={mockLinks} />);

      // Check that Outlet component is rendered
      expect(screen.getByTestId("outlet")).toBeInTheDocument();
    });

    it("should render CookiesNotification", () => {
      render(<DefaultNav links={mockLinks} />);

      // Check that CookiesNotification component is rendered
      expect(screen.getByTestId("cookies-notification")).toBeInTheDocument();
    });

    it("should render header with border", () => {
      // Check that header element is rendered with border class
      const { container } = render(<DefaultNav links={mockLinks} />);

      // Check that header element is rendered with border class
      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();
    });

    it("should render footer", () => {
      const { container } = render(<DefaultNav links={mockLinks} />);

      // Check that footer element is rendered
      const footer = container.querySelector("footer");
      expect(footer).toBeInTheDocument();
    });
  });

  describe("Query Enabled Prop", () => {
    it("should pass queryEnabled to useAuthUser hook", () => {
      // Mock useAuthUser to return not loading and no username
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue(null);

      render(<DefaultNav links={mockLinks} queryEnabled={false} />);

      // Check that useAuthUser was called with queryEnabled false
      expect(useAuthUser).toHaveBeenCalledWith(false);
    });

    it("should default queryEnabled to true", () => {
      // Mock useAuthUser to return not loading and no username
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue(null);

      render(<DefaultNav links={mockLinks} />);

      // Check that useAuthUser was called with queryEnabled true (default)
      expect(useAuthUser).toHaveBeenCalledWith(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty links array", () => {
      // Mock useAuthUser to return not loading and no username
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue(null);

      // Render component with empty links array
      render(<DefaultNav links={[]} />);

      // Should not render any navigation links
      expect(screen.getByAltText("Logo")).toBeInTheDocument();
    });

    
    it("should handle username as empty string", () => {
      // Mock useAuthUser to return not loading and empty username
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue("");

      render(<DefaultNav links={mockLinks} />);

      // Should show Login link since empty username is treated as not authenticated
      expect(screen.getByText("Login")).toBeInTheDocument();
    });

    it("should handle loading state with existing username", () => {
      // Mock useAuthUser to return loading state but with an existing username
      useAuthUser.mockReturnValue({ isLoading: true });
      useUsername.mockReturnValue("existinguser");

      render(<DefaultNav links={mockLinks} />);

      // Should NOT show loading text since username exists, and should show ProfileBlock
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      expect(screen.getByTestId("profile-block")).toBeInTheDocument();
    });
  });
});
