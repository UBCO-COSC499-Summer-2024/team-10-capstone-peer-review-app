// ExtendDeadlinesDialog.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExtendDeadlinesDialog from '@/components/assign/assignment/ExtendDeadlinesDialog';
import { format } from 'date-fns';

// needed to avoid 'TypeError: t.scrollIntoView is not a function' testing error
window.HTMLElement.prototype.scrollIntoView = function() {};

// Mock the toast function
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

const mockExtendDeadlineForStudent = jest.fn();
const mockDeleteExtendedDeadlineForStudent = jest.fn();

const students = [
  { studentId: '1', label: 'Student One' },
  { studentId: '2', label: 'Student Two' },
];

const extendedDueDates = [
  { userId: '1', newDueDate: new Date('2023-12-31') },
];

describe('ExtendDeadlinesDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dialog with the correct title and description', () => {
    render(
      <ExtendDeadlinesDialog
        assignmentId="123"
        openExtendDeadlines={true}
        setOpenExtendDeadlines={jest.fn()}
        students={students}
        extendedDueDates={extendedDueDates}
        setExtendedDueDates={jest.fn()}
        extendDeadlineForStudent={mockExtendDeadlineForStudent}
        confirmDelete=""
        setConfirmDelete={jest.fn()}
        deleteExtendedDeadlineForStudent={mockDeleteExtendedDeadlineForStudent}
      />
    );

    expect(screen.getByText('Extend Deadlines')).toBeInTheDocument();
    expect(screen.getByText('Extend the deadline for this assignment for particular students here. Note: You can re-add the same student to edit the extended due date.')).toBeInTheDocument();
  });

  it('displays the table of current extended due dates', () => {
    render(
      <ExtendDeadlinesDialog
        assignmentId="123"
        openExtendDeadlines={true}
        setOpenExtendDeadlines={jest.fn()}
        students={students}
        extendedDueDates={extendedDueDates}
        setExtendedDueDates={jest.fn()}
        extendDeadlineForStudent={mockExtendDeadlineForStudent}
        confirmDelete=""
        setConfirmDelete={jest.fn()}
        deleteExtendedDeadlineForStudent={mockDeleteExtendedDeadlineForStudent}
      />
    );

    expect(screen.getByText('Student One')).toBeInTheDocument();
    expect(screen.getByText(format(new Date('2023-12-31'), 'dd/MM/yyyy'))).toBeInTheDocument();
  });

  it('allows selecting a student and a new due date', async () => {
    render(
      <ExtendDeadlinesDialog
        assignmentId="123"
        openExtendDeadlines={true}
        setOpenExtendDeadlines={jest.fn()}
        students={students}
        extendedDueDates={extendedDueDates}
        setExtendedDueDates={jest.fn()}
        extendDeadlineForStudent={mockExtendDeadlineForStudent}
        confirmDelete=""
        setConfirmDelete={jest.fn()}
        deleteExtendedDeadlineForStudent={mockDeleteExtendedDeadlineForStudent}
      />
    );

    // Select a student
    fireEvent.click(screen.getByText('Select a student'));
    fireEvent.click(screen.getByRole('option', { name: 'Student Two' }));
    // Select a new due date
    fireEvent.click(screen.getByText('Pick a date'));
    fireEvent.click(screen.getByText('15'));

    await waitFor(() => {
      expect(screen.getByText(format(new Date(new Date().getFullYear(), new Date().getMonth(), 15), 'PPP'))).toBeInTheDocument();
    });
  });

  it('adds an extended due date for a student', async () => {
    const setExtendedDueDates = jest.fn();
    const setSelectedStudent = jest.fn();
    const setNewDueDate = jest.fn();
    mockExtendDeadlineForStudent.mockResolvedValue({ status: 'Success' });

    render(
      <ExtendDeadlinesDialog
        assignmentId="123"
        openExtendDeadlines={true}
        setOpenExtendDeadlines={jest.fn()}
        students={students}
        extendedDueDates={extendedDueDates}
        setExtendedDueDates={setExtendedDueDates}
        extendDeadlineForStudent={mockExtendDeadlineForStudent}
        confirmDelete=""
        setConfirmDelete={jest.fn()}
        deleteExtendedDeadlineForStudent={mockDeleteExtendedDeadlineForStudent}
      />
    );

    // Select a student
    fireEvent.click(screen.getByText('Select a student'));
    fireEvent.click(screen.getByRole('option', { name: 'Student Two' }));

    // Select a new due date
    fireEvent.click(screen.getByText('Pick a date'));
    fireEvent.click(screen.getByText('15'));

    // Add extended due date
    fireEvent.click(screen.getByText('Add Extended Due Date'));

    await waitFor(() => {
      expect(mockExtendDeadlineForStudent).toHaveBeenCalledWith(
        '123',
        '2',
        expect.any(Date)
      );
    });

    expect(setExtendedDueDates).toHaveBeenCalled();
  });

  it('deletes an extended due date for a student', async () => {
    const setExtendedDueDates = jest.fn();
    const setConfirmDelete = jest.fn();
    mockDeleteExtendedDeadlineForStudent.mockResolvedValue({ status: 'Success' });

    render(
      <ExtendDeadlinesDialog
        assignmentId="123"
        openExtendDeadlines={true}
        setOpenExtendDeadlines={jest.fn()}
        students={students}
        extendedDueDates={extendedDueDates}
        setExtendedDueDates={setExtendedDueDates}
        extendDeadlineForStudent={mockExtendDeadlineForStudent}
        confirmDelete="1"
        setConfirmDelete={setConfirmDelete}
        deleteExtendedDeadlineForStudent={mockDeleteExtendedDeadlineForStudent}
      />
    );

    // Confirm deletion
    fireEvent.click(screen.getByText('Confirm Deletion'));

    await waitFor(() => {
      expect(mockDeleteExtendedDeadlineForStudent).toHaveBeenCalledWith(
        '1',
        '123'
      );
    });

    expect(setExtendedDueDates).toHaveBeenCalled();
  });

  it('closes the dialog when the close button is clicked', () => {
    const setOpenExtendDeadlines = jest.fn();

    render(
      <ExtendDeadlinesDialog
        assignmentId="123"
        openExtendDeadlines={true}
        setOpenExtendDeadlines={setOpenExtendDeadlines}
        students={students}
        extendedDueDates={extendedDueDates}
        setExtendedDueDates={jest.fn()}
        extendDeadlineForStudent={mockExtendDeadlineForStudent}
        confirmDelete=""
        setConfirmDelete={jest.fn()}
        deleteExtendedDeadlineForStudent={mockDeleteExtendedDeadlineForStudent}
      />
    );

    fireEvent.click(screen.getByTestId('close-extend-deadlines'));

    expect(setOpenExtendDeadlines).toHaveBeenCalledWith(false);
  });
});