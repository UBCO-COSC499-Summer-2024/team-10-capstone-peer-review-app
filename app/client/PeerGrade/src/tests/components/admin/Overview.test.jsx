import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Overview from '@/components/admin/Overview';
import { useUser } from '@/contexts/contextHooks/useUser';
import { useClass } from '@/contexts/contextHooks/useClass';
import { getUsersByRole, getAllUsers } from "@/api/userApi";
import { getAllClasses } from "@/api/classApi";
import { getAllAssignments } from "@/api/assignmentApi";
import userEvent from '@testing-library/user-event';

// Mock the hooks and API calls
jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/contexts/contextHooks/useClass');
jest.mock('@/api/userApi');
jest.mock('@/api/assignmentApi');
jest.mock('@/api/classApi');

describe('Overview Component', () => {
  beforeEach(() => {
    useUser.mockReturnValue({
      user: { id: 1, name: 'Test User' },
      userLoading: false,
    });

    useClass.mockReturnValue({
      classes: [{ id: 1, name: 'Class 1' }],
      isClassLoading: false,
    });

    getAllUsers.mockResolvedValue({
      status: 'Success',
      data: [
        { id: 1, role: 'STUDENT', firstname: 'John', lastname: 'Doe', createdAt: '2021-01-01', classes: [] },
        { id: 2, role: 'INSTRUCTOR', firstname: 'Jane', lastname: 'Smith', createdAt: '2021-01-01', classesInstructed: [] },
      ],
    });

    getAllAssignments.mockResolvedValue({
      status: 'Success',
      data: [{ id: 1, title: 'Assignment 1' }],
    });

    getAllClasses.mockResolvedValue({
      status: 'Success',
      data: [{ id: 1, name: 'Class 1' }],
    });
  });

  test('renders user statistics correctly', async () => {
    render(<Overview />);

    await waitFor(() => {
        expect(screen.getByText('Users')).toBeInTheDocument();
        expect(screen.getByText(/Students\s*-\s*1/)).toBeInTheDocument();
        expect(screen.getByText(/Instructors\s*-\s*1/)).toBeInTheDocument();
    });
  });

  test('renders class statistics correctly', async () => {
    render(<Overview />);

    await waitFor(() => {
        expect(screen.getByTestId('Classes-title')).toBeInTheDocument();
        expect(screen.getByTestId('Classes-number')).toBeInTheDocument();
    });
  });

  test('renders assignment statistics correctly', async () => {
    render(<Overview />);

    await waitFor(() => {
        expect(screen.getByTestId('Assignments-title')).toBeInTheDocument();
        expect(screen.getByTestId('Assignments-number')).toBeInTheDocument();
    });
  });

  test('renders student data table correctly', async () => {
    getUsersByRole.mockResolvedValue({
        status: 'Success',
        data: [
          { id: 1, role: 'STUDENT', firstname: 'John', lastname: 'Doe', createdAt: '2021-01-01', classes: [] },
        ],
    });
    render(<Overview />);

    userEvent.click(screen.getByRole('tab', { name: 'Students' }));

    await waitFor(() => {
      console.log(document.body.innerHTML);
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
    });
  });

  test('renders instructor data table correctly', async () => {
    getUsersByRole.mockResolvedValue({
        status: 'Success',
        data: [
          { id: 2, role: 'INSTRUCTOR', firstname: 'Jane', lastname: 'Smith', createdAt: '2021-01-01', classesInstructed: [] },
        ],
    });
    render(<Overview />);

    userEvent.click(screen.getByRole('tab', { name: 'Instructors' }));

    await waitFor(() => {
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('Smith')).toBeInTheDocument();
    });
  });
});