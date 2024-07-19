import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Class from "@/pages/Class";
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";
import { getAllAssignmentsByClassId } from "@/api/assignmentApi";
import {
  getCategoriesByClassId,
  getInstructorByClassId,
  getStudentsByClassId,
  removeStudentFromClass,
  addStudentToClass,
  getAllGroupsByClass,
  createGroup,
  deleteGroup,
  updateGroup,
  joinGroup,
  leaveGroup,
  getUsersNotInGroups,
} from '@/api/classApi';
import { getUsersByRole, getGroups } from '@/api/userApi';
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";

// Mock the custom hooks and API functions
jest.mock("@/contexts/contextHooks/useUser");
jest.mock("@/contexts/contextHooks/useClass");
jest.mock("@/api/assignmentApi");
jest.mock("@/api/classApi");
jest.mock('@/api/userApi');
jest.mock("@/components/ui/use-toast");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("Class Component", () => {
  const mockToast = jest.fn();
  const mockUser = { role: "INSTRUCTOR" };
  const mockClasses = [
    {
      classId: "1",
      classname: "Test Class",
      description: "This is a test class",
      startDate: "2024-09-01",
      endDate: "2024-12-31",
      term: "Fall 2024",
      classSize: 30
    },
  ];

  const mockAssignments = {
    data: [
      {
        assignmentId: "1",
        title: "Test Assignment",
        status: "Pending",
        dueDate: "2024-07-20",
      },
    ],
  };

  const mockCategories = {
    data: [
      {
        categoryId: "1",
        name: "Test Category",
        assignments: [
          {
            assignmentId: "1",
            title: "Test Assignment",
            status: "Pending",
            dueDate: "2024-07-20",
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    useUser.mockReturnValue({ user: mockUser, userLoading: false });
    useClass.mockReturnValue({ classes: mockClasses });
    getAllAssignmentsByClassId.mockResolvedValue(mockAssignments);
    getCategoriesByClassId.mockResolvedValue(mockCategories);
    useToast.mockReturnValue({ toast: mockToast });
    useParams.mockReturnValue({ classId: "1" });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders class information and home view by default", async () => {
    render(
      <Router>
        <Class />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Class")).toBeInTheDocument();
      expect(screen.getByText("This is a test class")).toBeInTheDocument();
      expect(screen.getByText("Recent Announcements")).toBeInTheDocument();
      expect(screen.getByText("Test Category")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Test Category"));

    await waitFor(() => {
      expect(screen.getByText("Test Assignment")).toBeInTheDocument();
    });
  });

  test("renders grades view when Grades button is clicked", async () => {
    render(
      <Router>
        <Class />
      </Router>
    );

    fireEvent.click(screen.getByText("Grades"));

    await waitFor(() => {
      expect(screen.getByText("Class Grades")).toBeInTheDocument();
    });
  });

  test("renders people view when People button is clicked", async () => {
    getInstructorByClassId.mockResolvedValue({
      status: 'Success',
      data: { userId: '2', firstname: 'John', lastname: 'Doe' }
    });
    getStudentsByClassId.mockResolvedValue({
      status: 'Success',
      data: [
        { userId: '3', firstname: 'Jane', lastname: 'Smith', avatarUrl: '' },
        { userId: '4', firstname: 'Bob', lastname: 'Brown', avatarUrl: '' }
      ]
    });
    getGroups.mockResolvedValue({
      status: 'Success',
      data: []
    });
    render(
      <Router>
        <Class />
      </Router>
    );

    fireEvent.click(screen.getByText("People"));

    await waitFor(() => {
      expect(screen.getByText("Instructor")).toBeInTheDocument();
    });
  });

  test("renders groups view when Groups button is clicked", async () => {
    getUsersNotInGroups.mockResolvedValueOnce({
      status: 'Success',
      data: []
    });
    getAllGroupsByClass.mockResolvedValueOnce({
      data: [
        { groupId: '1', groupName: 'Group 1', groupDescription: 'Description 1', students: [] },
        { groupId: '2', groupName: 'Group 2', groupDescription: 'Description 2', students: [] },
      ],
    });
    getGroups.mockResolvedValueOnce({
      data: [],
    });
  
    render(
      <Router>
        <Class />
      </Router>
    );

    fireEvent.click(screen.getByText("Groups"));

    await waitFor(() => {
      expect(screen.getByText("No groups found.")).toBeInTheDocument();
    });
  });

  test("renders files view when Files button is clicked", async () => {
    render(
      <Router>
        <Class />
      </Router>
    );

    fireEvent.click(screen.getByText("Files"));

    await waitFor(() => {
      expect(screen.getByText("Class Assignments")).toBeInTheDocument();
    });
  });

  test("renders edit view when Edit button is clicked", async () => {
    render(
      <Router>
        <Class />
      </Router>
    );

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      expect(screen.getByText("Edit Class")).toBeInTheDocument();
    });
  });

  test("renders rubrics view when Rubrics button is clicked", async () => {
    render(
      <Router>
        <Class />
      </Router>
    );

    fireEvent.click(screen.getByText("Rubrics"));

    await waitFor(() => {
      expect(screen.getByText("No rubrics found")).toBeInTheDocument();
    });
  });

  test("fetches class data on mount", async () => {
    render(
      <Router>
        <Class />
      </Router>
    );

    await waitFor(() => {
      expect(getAllAssignmentsByClassId).toHaveBeenCalledWith("1");
      expect(getCategoriesByClassId).toHaveBeenCalledWith("1");
    });
  });

  test("shows error toast when fetching class data fails", async () => {
    getAllAssignmentsByClassId.mockRejectedValueOnce(new Error("Failed to fetch"));
    getCategoriesByClassId.mockRejectedValueOnce(new Error("Failed to fetch"));

    render(
      <Router>
        <Class />
      </Router>
    );

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to fetch class data",
        variant: "destructive",
      });
    });
  });
});
