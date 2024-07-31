import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Assignments from '@/pages/classNav/Assignments';
import { getAllAssignmentsByClassId, removeAssignmentFromClass } from '@/api/assignmentApi';
import { useUser } from '@/contexts/contextHooks/useUser';

jest.mock('@/api/assignmentApi');
jest.mock('@/contexts/contextHooks/useUser');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

const mockAssignments = [
  {
    assignmentId: '1',
    title: 'Assignment 1',
    dueDate: '2024-07-20',
  },
  {
    assignmentId: '2',
    title: 'Assignment 2',
    dueDate: '2024-08-15',
  },
];

describe('Assignments Component', () => {
  const renderComponent = (userRole = 'STUDENT') => {
    useParams.mockReturnValue({ classId: '123' });
    useUser.mockReturnValue({
      user: { role: userRole },
    });
    getAllAssignmentsByClassId.mockResolvedValue({ data: mockAssignments });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Assignments />} />
        </Routes>
      </BrowserRouter>
    );
  };

  test('renders assignments correctly', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Assignment 1')).toBeInTheDocument();
      expect(screen.getByText('Assignment 2')).toBeInTheDocument();
      expect(screen.getByText('Due: 7/19/2024')).toBeInTheDocument();
      expect(screen.getByText('Due: 8/14/2024')).toBeInTheDocument();
    });
  });

  test('renders view button for all roles', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getAllByText('View')).toHaveLength(mockAssignments.length);
    });
  });

  test('renders delete button for non-student roles', async () => {
    renderComponent('INSTRUCTOR');

    await waitFor(() => {
      expect(screen.getAllByText('Delete')).toHaveLength(mockAssignments.length);
    });
  });

  test('does not render delete button for student role', async () => {
    renderComponent('STUDENT');

    await waitFor(() => {
      expect(screen.queryByText('Delete')).toBeNull();
    });
  });

  test('renders submit button for student role', async () => {
    renderComponent('STUDENT');

    await waitFor(() => {
      expect(screen.getAllByText('Submit')).toHaveLength(mockAssignments.length);
    });
  });

  test('does not render submit button for non-student roles', async () => {
    renderComponent('INSTRUCTOR');

    await waitFor(() => {
      expect(screen.queryByText('Submit')).toBeNull();
    });
  });

  test('handles fetch assignment errors gracefully', async () => {
    getAllAssignmentsByClassId.mockRejectedValue(new Error('Error fetching assignments'));
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Assignment 1')).toBeNull();
      expect(screen.queryByText('Assignment 2')).toBeNull();
    });
  });

  test('handles delete assignment correctly', async () => {
    renderComponent('INSTRUCTOR');
    removeAssignmentFromClass.mockResolvedValue({ status: 'Success', data: {} });

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('delete-assignment-1'));
    });

    await waitFor(() => {
      expect(screen.getByText('Delete Assignment')).toBeInTheDocument();
    });

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('delete-assignment'));
    });

    await waitFor(() => {
      expect(screen.getByText('Confirm Delete Assignment')).toBeInTheDocument();
    });

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('delete-assignment'));
    });

    await waitFor(() => {
      expect(screen.queryByText('Confirm Delete Assignment')).toBeNull();
      expect(removeAssignmentFromClass).toHaveBeenCalledWith('1');
      expect(screen.queryByText('Assignment 1')).toBeNull();
    });
  });

  test('handles delete assignment errors gracefully', async () => {
    renderComponent('INSTRUCTOR');
    removeAssignmentFromClass.mockRejectedValue(new Error('Error deleting assignment'));

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('delete-assignment-1'));
    });

    await waitFor(() => {
      expect(screen.getByText('Delete Assignment')).toBeInTheDocument();
    });

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('delete-assignment'));
    });

    await waitFor(() => {
      expect(screen.getByText('Confirm Delete Assignment')).toBeInTheDocument();
    });

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('delete-assignment'));
    });

    await waitFor(() => {
      expect(screen.queryByText('Confirm Delete Assignment')).toBeNull();
      expect(removeAssignmentFromClass).toHaveBeenCalledWith('1');
      expect(screen.getByText('Assignment 1')).toBeInTheDocument();
    });
  });
});