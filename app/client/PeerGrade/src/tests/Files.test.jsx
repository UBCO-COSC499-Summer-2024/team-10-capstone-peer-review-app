import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Files from '@/pages/classNav/Files';
import { getAllAssignmentsByClassId } from '@/api/assignmentApi';
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

describe('Files Component', () => {
  const renderComponent = (userRole = 'STUDENT') => {
    useParams.mockReturnValue({ classId: '123' });
    useUser.mockReturnValue({
      user: { role: userRole },
    });
    getAllAssignmentsByClassId.mockResolvedValue({ data: mockAssignments });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Files />} />
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

  test('renders edit and delete buttons for non-student roles', async () => {
    renderComponent('INSTRUCTOR');

    await waitFor(() => {
      expect(screen.getAllByText('Edit')).toHaveLength(mockAssignments.length);
      expect(screen.getAllByText('Delete')).toHaveLength(mockAssignments.length);
    });
  });

  test('does not render edit and delete buttons for student role', async () => {
    renderComponent('STUDENT');

    await waitFor(() => {
      expect(screen.queryByText('Edit')).toBeNull();
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
});
