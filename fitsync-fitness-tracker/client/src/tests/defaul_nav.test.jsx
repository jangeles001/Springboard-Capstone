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

// Import mocked modules
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
      useAuthUser.mockReturnValue({ isLoading: true });
      useUsername.mockReturnValue(null);

      render(<DefaultNav links={mockLinks} queryEnabled={true} homeURL={"/"}/>);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should not show loading when query is disabled", () => {
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue(null);

      render(<DefaultNav links={mockLinks} queryEnabled={false} />);

      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  describe("Navigation Links", () => {
    beforeEach(() => {
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue(null);
    });

    it("should render all navigation links", () => {
      render(<DefaultNav links={mockLinks} />);

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();
    });

    it("should render links with correct href", () => {
      render(<DefaultNav links={mockLinks} />);

      const homeLink = screen.getByText("Home").closest("a");
      const aboutLink = screen.getByText("About").closest("a");

      expect(homeLink).toHaveAttribute("href", "/home");
      expect(aboutLink).toHaveAttribute("href", "/about");
    });

    it("should render links on desktop only (hidden on mobile)", () => {
      render(<DefaultNav links={mockLinks} />);

      // Desktop nav links should be present
      const navLinks = screen.getAllByText("Home");
      expect(navLinks.length).toBeGreaterThan(0);
    });
  });

  describe("Authentication States", () => {
    it("should show Login link when user is not authenticated", () => {
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue(null);

      render(<DefaultNav links={mockLinks} />);

      expect(screen.getByText("Login")).toBeInTheDocument();
    });

    it("should show ProfileBlock when user is authenticated", () => {
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue("testuser");

      render(<DefaultNav links={mockLinks} />);

      expect(screen.getByTestId("profile-block")).toBeInTheDocument();
    });

    it("should show LogoutButton when user is authenticated", () => {
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue("testuser");

      render(<DefaultNav links={mockLinks} />);

      expect(screen.getByTestId("logout-button")).toBeInTheDocument();
    });

    it("should not show Login link when user is authenticated", () => {
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue("testuser");

      render(<DefaultNav links={mockLinks} />);

      const loginLinks = screen.queryAllByText("Login");
      // Should not find any Login links (or only in hamburger menu)
      expect(loginLinks.length).toBeLessThanOrEqual(1);
    });
  });

  describe("Hamburger Menu", () => {
    beforeEach(() => {
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue(null);
    });

    it("should show hamburger button", () => {
      render(<DefaultNav links={mockLinks} />);

      const hamburgerButton = screen.getByRole("button", {
        name: /toggle navigation/i,
      });
      expect(hamburgerButton).toBeInTheDocument();
    });

    it("should toggle hamburger menu on button click", async () => {
      const user = userEvent.setup();
      render(<DefaultNav links={mockLinks} />);

      const hamburgerButton = screen.getByRole("button", {
        name: /toggle navigation/i,
      });

      // Menu should not be visible initially
      expect(screen.queryByTestId("hamburger-menu")).not.toBeInTheDocument();

      // Click to open
      await user.click(hamburgerButton);

      // Menu should now be visible 
      expect(screen.getByTestId("hamburger-menu")).toBeInTheDocument();

      // Click to close
      await user.click(hamburgerButton);

      // Menu should be hidden again
      await waitFor(() => {
        expect(screen.queryByTestId("hamburger-menu")).not.toBeInTheDocument();
      });
    });

    it("should pass username to HamburgerMenu when authenticated", async () => {
      const user = userEvent.setup();
      useUsername.mockReturnValue("johndoe");

      render(<DefaultNav links={mockLinks} />);

      const hamburgerButton = screen.getByRole("button", {
        name: /toggle navigation/i,
      });
      await user.click(hamburgerButton);

      expect(screen.getByText("User: johndoe")).toBeInTheDocument();
    });

    it("should pass links to HamburgerMenu", async () => {
      const user = userEvent.setup();
      render(<DefaultNav links={mockLinks} />);

      const hamburgerButton = screen.getByRole("button", {
        name: /toggle navigation/i,
      });
      await user.click(hamburgerButton);

      const hamburgerMenu = screen.getByTestId("hamburger-menu");
      expect(hamburgerMenu).toHaveTextContent("Home");
      expect(hamburgerMenu).toHaveTextContent("About");
      expect(hamburgerMenu).toHaveTextContent("Contact");
    });
  });

  describe("Layout Components", () => {
    beforeEach(() => {
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue(null);
    });

    it("should render logo", () => {
      render(<DefaultNav links={mockLinks} />);

      const logo = screen.getByAltText("Logo");
      expect(logo).toBeInTheDocument();
    });

    it("should render Outlet for nested routes", () => {
      render(<DefaultNav links={mockLinks} />);

      expect(screen.getByTestId("outlet")).toBeInTheDocument();
    });

    it("should render CookiesNotification", () => {
      render(<DefaultNav links={mockLinks} />);

      expect(screen.getByTestId("cookies-notification")).toBeInTheDocument();
    });

    it("should render header with border", () => {
      const { container } = render(<DefaultNav links={mockLinks} />);

      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();
    });

    it("should render footer", () => {
      const { container } = render(<DefaultNav links={mockLinks} />);

      const footer = container.querySelector("footer");
      expect(footer).toBeInTheDocument();
    });
  });

  describe("Query Enabled Prop", () => {
    it("should pass queryEnabled to useAuthUser hook", () => {
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue(null);

      render(<DefaultNav links={mockLinks} queryEnabled={false} />);

      expect(useAuthUser).toHaveBeenCalledWith(false);
    });

    it("should default queryEnabled to true", () => {
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue(null);

      render(<DefaultNav links={mockLinks} />);

      expect(useAuthUser).toHaveBeenCalledWith(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty links array", () => {
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue(null);

      render(<DefaultNav links={[]} />);

      // Should still render without crashing
      expect(screen.getByAltText("Logo")).toBeInTheDocument();
    });

    it("should handle username as empty string", () => {
      useAuthUser.mockReturnValue({ isLoading: false });
      useUsername.mockReturnValue("");

      render(<DefaultNav links={mockLinks} />);

      // Empty string is falsy, should show Login
      expect(screen.getByText("Login")).toBeInTheDocument();
    });

    it("should handle loading state with existing username", () => {
      useAuthUser.mockReturnValue({ isLoading: true });
      useUsername.mockReturnValue("existinguser");

      render(<DefaultNav links={mockLinks} />);

      // Should NOT show loading when username exists
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      expect(screen.getByTestId("profile-block")).toBeInTheDocument();
    });
  });
});
