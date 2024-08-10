import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AssignmentsTable from '@/components/manageClass/AssignmentsTable';
import { removeAssignmentFromClass } from '@/api/assignmentApi';

jest.mock('@/api/assignmentApi');

const mockAssignments = [
  { assignmentId: '1', title: 'Assignment 1', dueDate: '2023-12-31' },
  { assignmentId: '2', title: 'Assignment 2', dueDate: '2023-11-30' },
];

const mockUser = { role: 'INSTRUCTOR' };

const renderPagination = jest.fn();

describe('AssignmentsTable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with no assignments', () => {
    render(
      <Router>
        <AssignmentsTable
          assignments={[]}
          setAssignments={jest.fn()}
          classId="1"
          user={mockUser}
          renderPagination={renderPagination}
          currentPage={1}
          setCurrentPage={jest.fn()}
        />
      </Router>
    );

    expect(screen.getByText('No assignments found')).toBeInTheDocument();
  });

  it('renders correctly with assignments', () => {
    render(
      <Router>
        <AssignmentsTable
          assignments={mockAssignments}
          setAssignments={jest.fn()}
          classId="1"
          user={mockUser}
          renderPagination={renderPagination}
          currentPage={1}
          setCurrentPage={jest.fn()}
        />
      </Router>
    );

    expect(screen.getByText('Assignment 1')).toBeInTheDocument();
    expect(screen.getByText('Assignment 2')).toBeInTheDocument();
  });

  it('handles delete button click and shows confirmation dialog', async () => {
    render(
      <Router>
        <AssignmentsTable
          assignments={mockAssignments}
          setAssignments={jest.fn()}
          classId="1"
          user={mockUser}
          renderPagination={renderPagination}
          currentPage={1}
          setCurrentPage={jest.fn()}
        />
      </Router>
    );

    fireEvent.click(screen.getAllByText('Delete')[0]);

    await waitFor(() => {
      expect(screen.getByText('Are you sure you want to delete the assignment "Assignment 1" from this class?')).toBeInTheDocument();
    });
  });

  it('handles successful assignment deletion', async () => {
    removeAssignmentFromClass.mockResolvedValue({ status: 'Success' });
    const setAssignments = jest.fn();

    render(
      <Router>
        <AssignmentsTable
          assignments={mockAssignments}
          setAssignments={setAssignments}
          classId="1"
          user={mockUser}
          renderPagination={renderPagination}
          currentPage={1}
          setCurrentPage={jest.fn()}
        />
      </Router>
    );

    fireEvent.click(screen.getAllByText('Delete')[0]);

    await waitFor(() => {
        expect(screen.getByText('Are you sure you want to delete the assignment "Assignment 1" from this class?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('delete-assignment'));

    await waitFor(() => {
        expect(screen.getByText('Are you really sure you want to delete the assignment "Assignment 1" from this class?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('delete-assignment'));

    await waitFor(() => {
      expect(removeAssignmentFromClass).toHaveBeenCalledWith('1');
      expect(setAssignments).toHaveBeenCalled();
    });
  });

  it('calls renderPagination with correct parameters', () => {
    render(
      <Router>
        <AssignmentsTable
          assignments={mockAssignments}
          setAssignments={jest.fn()}
          classId="1"
          user={mockUser}
          renderPagination={renderPagination}
          currentPage={1}
          setCurrentPage={jest.fn()}
        />
      </Router>
    );

    expect(renderPagination).toHaveBeenCalledWith(1, expect.any(Function), mockAssignments.length);
  });
});