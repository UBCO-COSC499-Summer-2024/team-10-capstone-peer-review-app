import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Assign from '@/components/admin/Assign';
import { useUser } from '@/contexts/contextHooks/useUser';
import { useClass } from '@/contexts/contextHooks/useClass';
import { getAllAssignments } from '@/api/assignmentApi';

// Mock the hooks and API call
jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/contexts/contextHooks/useClass');
jest.mock('@/api/assignmentApi');

describe('Assign Component', () => {
  const mockUser = { id: 1, name: 'Test User' };
  const mockClasses = [
    { classname: 'Class 1', classId: 1 },
    { classname: 'Class 2', classId: 2 },
  ];
  const mockAssignments = {
    status: 'Success',
    data: [
      { title: 'Assignment 1', description: 'Desc 1', dueDate: '2023-10-01', maxSubmissions: 3, classId: 1 },
      { title: 'Assignment 2', description: 'Desc 2', dueDate: '2023-10-02', maxSubmissions: 2, classId: 2 },
    ],
  };

  beforeEach(() => {
    useUser.mockReturnValue({ user: mockUser, userLoading: false });
    useClass.mockReturnValue({ classes: mockClasses, isClassLoading: false });
    getAllAssignments.mockResolvedValue(mockAssignments);
  });

  test('renders Assign component', async () => {
    render(<Assign />);

    expect(screen.getByText('Assignments')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Class 1')).toBeInTheDocument();
      expect(screen.getByText('Class 2')).toBeInTheDocument();
    });
  });

  test('displays assignments for selected class', async () => {
    render(<Assign />);

    await waitFor(() => {
      expect(screen.getByText('Assignment 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('next'));

    await waitFor(() => {
      expect(screen.getByText('Assignment 2')).toBeInTheDocument();
    });
  });

  test('carousel navigation works', async () => {
    render(<Assign />);

    await waitFor(() => {
      expect(screen.getByText('Class 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('next'));

    await waitFor(() => {
      expect(screen.getByText('Class 2')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('previous'));

    await waitFor(() => {
      expect(screen.getByText('Class 1')).toBeInTheDocument();
    });
  });
});