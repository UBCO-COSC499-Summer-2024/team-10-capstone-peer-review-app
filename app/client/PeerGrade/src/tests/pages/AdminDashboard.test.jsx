import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from "@/pages/AdminDashboard";
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass"; // Import useClass
import userEvent from "@testing-library/user-event";
import * as assignmentApi from "@/api/assignmentApi";
import * as userApi from "@/api/userApi";
import * as authApi from "@/api/authApi";


// Mock the custom hooks
jest.mock("@/contexts/contextHooks/useUser");
jest.mock("@/contexts/contextHooks/useClass"); // Mock useClass
jest.mock('@/api/userApi');
jest.mock('@/api/assignmentApi');
jest.mock('@/api/authApi');

describe("AdminDashboard Component", () => {
  const mockAdminUser = { role: "ADMIN" };
  const mockNonAdminUser = { role: "USER" };
  const mockClasses = []; // Add mock data for classes
  const mockAssignments = [
    {
      assignmentId: "1",
      classId: "class1",
      rubricId: "rubric1",
      title: "Assignment 1",
      description: "Description for assignment 1",
      dueDate: new Date().toISOString(),
      maxSubmissions: 1,
      isGroupAssignment: false,
      isPeerReviewAnonymous: false,
      allowedFileTypes: ["pdf", "docx"],
      assignmentFilePath: "/path/to/assignment1",
      categoryId: "category1",
      reviewOption: "option1",
      extendedDueDates: [],
      commentChains: []
    },
    {
      assignmentId: "2",
      classId: "class2",
      rubricId: "rubric2",
      title: "Assignment 2",
      description: "Description for assignment 2",
      dueDate: new Date().toISOString(),
      maxSubmissions: 2,
      isGroupAssignment: true,
      isPeerReviewAnonymous: true,
      allowedFileTypes: ["pdf"],
      assignmentFilePath: "/path/to/assignment2",
      categoryId: "category2",
      reviewOption: "option2",
      extendedDueDates: [],
      commentChains: []
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  assignmentApi.getAllAssignments = jest.fn().mockResolvedValue({ data: mockAssignments }); // Mock the API calls
  userApi.getAllUsers = jest.fn().mockResolvedValue({ data: [] });
  userApi.getAdminReports = jest.fn().mockResolvedValue({ data: [] });
  userApi.getInstructorReports = jest.fn().mockResolvedValue({ data: [] });
  userApi.getAllGroups = jest.fn().mockResolvedValue({ data: [] });
  authApi.getAllRoleRequests = jest.fn().mockResolvedValue({ data: [] });

  test("renders permission error for non-admin users", () => {
    useUser.mockReturnValue({ user: mockNonAdminUser, userLoading: false });
    useClass.mockReturnValue({ classes: mockClasses, isClassLoading: false }); // Mock return value

    render(
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      );

    expect(screen.getByText("You do not have permission to view this page.")).toBeInTheDocument();
  });

  test("renders admin dashboard for admin users", () => {
    useUser.mockReturnValue({ user: mockAdminUser, userLoading: false });
    useClass.mockReturnValue({ classes: mockClasses, isClassLoading: false }); // Mock return value

    render(
        <MemoryRouter>
            <AdminDashboard />
        </MemoryRouter>
    );

    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Users' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Classes' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Assignments' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Groups' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Reports' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Notifications' })).toBeInTheDocument();
  });

  test("renders Overview tab content by default", () => {
    useUser.mockReturnValue({ user: mockAdminUser, userLoading: false });
    useClass.mockReturnValue({ classes: mockClasses, isClassLoading: false }); // Mock return value

    render(
        <MemoryRouter>
            <AdminDashboard />
        </MemoryRouter>
    );

    expect(screen.getByText("Instructors")).toBeInTheDocument();
  });

  test("renders Users tab content when Users tab is clicked", async () => {
    useUser.mockReturnValue({ user: mockAdminUser, userLoading: false });
    useClass.mockReturnValue({ classes: mockClasses, isClassLoading: false }); // Mock return value

    render(
        <MemoryRouter>
            <AdminDashboard />
        </MemoryRouter>
    );

    userEvent.click(screen.getByRole('tab', { name: 'Users' }));

    await waitFor(() => {
      expect(screen.getByText("Role Requests")).toBeInTheDocument();
    });
  });

  test("renders Classes tab content when Classes tab is clicked", async () => {
    useUser.mockReturnValue({ user: mockAdminUser, userLoading: false });
    useClass.mockReturnValue({ classes: mockClasses, isClassLoading: false }); // Mock return value

    render(
        <MemoryRouter>
            <AdminDashboard />
        </MemoryRouter>
    );

    userEvent.click(screen.getByRole('tab', { name: 'Classes' }));

    await waitFor(() => {
      expect(screen.getByText("All Classes")).toBeInTheDocument();
    });
  });

  test("renders Assignments tab content when Assignments tab is clicked", async () => {
    useUser.mockReturnValue({ user: mockAdminUser, userLoading: false });
  
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );
  
    userEvent.click(screen.getByRole('tab', { name: 'Assignments' }));
  
    await waitFor(() => {
      expect(screen.getByTestId("assignments-tab")).toBeInTheDocument();
    });
  });
  
  test("renders Groups tab content when Groups tab is clicked", async () => {
    useUser.mockReturnValue({ user: mockAdminUser, userLoading: false });
  
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );
  
    userEvent.click(screen.getByRole('tab', { name: 'Groups' }));
  
    await waitFor(() => {
      expect(screen.getByText("Description")).toBeInTheDocument();
    });
  });
  
  test("renders Reports tab content when Reports tab is clicked", async () => {
    useUser.mockReturnValue({ user: mockAdminUser, userLoading: false });
  
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );
  
    userEvent.click(screen.getByRole('tab', { name: 'Reports' }));
  
    await waitFor(() => {
      expect(screen.getByText("Reports Received")).toBeInTheDocument();
    });
  });
  
  test("renders Notifications tab content when Notifications tab is clicked", async () => {
    useUser.mockReturnValue({ user: mockAdminUser, userLoading: false });
  
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );
  
    userEvent.click(screen.getByRole('tab', { name: 'Notifications' }));
  
    await waitFor(() => {
      expect(screen.getByText("Notifications Panel")).toBeInTheDocument();
    });
  });
});