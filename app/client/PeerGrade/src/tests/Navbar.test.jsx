import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AppNavbar from "@/components/login/global/Navbar";
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";
import { logoutUser } from "@/api/authApi";
import { getAllAssignments } from "@/api/classApi";
import { useToast } from '@/components/ui/use-toast';


// Mocking the dependencies
jest.mock("@/contexts/contextHooks/useUser");
jest.mock("@/contexts/contextHooks/useClass");
jest.mock("@/components/ui/use-toast");
jest.mock("@/api/authApi");
jest.mock("@/api/classApi");
jest.mock('@/components/ui/hover-card', () => ({
	HoverCard: ({ children }) => <div>{children}</div>,
	HoverCardTrigger: ({ children }) => <div>{children}</div>,
	HoverCardContent: ({ children }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/navigation-menu', () => ({
	NavigationMenu: ({ children }) => <div>{children}</div>,
	NavigationMenuTrigger: ({ children }) => <div>{children}</div>,
	NavigationMenuContent: ({ children }) => <div>{children}</div>,
	NavigationMenuItem: ({ children }) => <div>{children}</div>,
	NavigationMenuLink: ({ children }) => <div>{children}</div>,
	NavigationMenuList: ({ children }) => <div>{children}</div>,
	navigationMenuTriggerStyle: jest.fn(() => 'mocked-navigation-menu-trigger-style'),
}));

describe("AppNavbar", () => {
  const mockNavigate = jest.fn();
  const mockSetUserContext = jest.fn();
  const mockClearUserContext = jest.fn();
  const mockSetUserClasses = jest.fn();
  const mockSetAdminClasses = jest.fn();

  beforeEach(() => {
    useUser.mockReturnValue({
		user: { userId: "1", role: "STUDENT", firstname: "John", lastname: "Doe" },
		userLoading: false,
		setUserContext: mockSetUserContext,
		clearUserContext: mockClearUserContext,
    });

    useClass.mockReturnValue({
		classes: [],
		setUserClasses: mockSetUserClasses,
		setAdminClasses: mockSetAdminClasses,
    });

	useToast.mockReturnValue({
		toast: jest.fn(),
	});

    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(
		<Router>
			<AppNavbar />
		</Router>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Peer-Review")).toBeInTheDocument();
    expect(screen.getByText("Classes")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("handles logout correctly", async () => {
    logoutUser.mockResolvedValueOnce();

    render(
		<Router>
			<AppNavbar />
		</Router>
    );

	fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
		expect(mockClearUserContext).toHaveBeenCalled();
		expect(logoutUser).toHaveBeenCalled();
    });
  });

  it("displays user initials in avatar", () => {
    render(
      <Router>
        <AppNavbar />
      </Router>
    );

    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("fetches and displays assignments correctly", async () => {
    const mockAssignments = {
		data: [
			{ assignmentId: "1", title: "Assignment 1", description: "Description 1" },
			{ assignmentId: "2", title: "Assignment 2", description: "Description 2" },
		]
    };

    getAllAssignments.mockResolvedValueOnce(mockAssignments);

    render(
		<Router>
			<AppNavbar />
		</Router>
    );

	fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
		expect(screen.getByText("Assignment 1")).toBeInTheDocument();
		expect(screen.getByText("Assignment 2")).toBeInTheDocument();
    });
  });

  it("fetches and displays classes correctly", async () => {
    const mockClasses = [
      { classId: "1", classname: "Class 1", description: "Description 1" },
      { classId: "2", classname: "Class 2", description: "Description 2" },
    ];

    useClass.mockReturnValue({
      classes: mockClasses,
      setUserClasses: mockSetUserClasses,
      setAdminClasses: mockSetAdminClasses,
    });

    render(
      <Router>
        <AppNavbar />
      </Router>
    );

    fireEvent.click(screen.getByText("Classes"));

    await waitFor(() => {
      expect(screen.getByText("Class 1")).toBeInTheDocument();
      expect(screen.getByText("Class 2")).toBeInTheDocument();
    });
  });
});
