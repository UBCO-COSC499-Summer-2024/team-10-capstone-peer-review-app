import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudentsTable from '@/components/manageClass/StudentsTable';
import { removeStudentFromClass } from '@/api/classApi';

jest.mock('@/api/classApi');

const mockStudents = [
  {
    userId: '1',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    avatarUrl: '',
  },
  {
    userId: '2',
    firstname: 'Jane',
    lastname: 'Smith',
    email: 'jane.smith@example.com',
    avatarUrl: '',
  },
];

const mockUser = {
  role: 'INSTRUCTOR',
};

describe('StudentsTable Component', () => {
  let setStudents, setSearchTerm, setAddByCSVOpen, setAddDialogOpen, renderPagination, setCurrentPage;

  beforeEach(() => {
    setStudents = jest.fn();
    setSearchTerm = jest.fn();
    setAddByCSVOpen = jest.fn();
    setAddDialogOpen = jest.fn();
    renderPagination = jest.fn();
    setCurrentPage = jest.fn();
  });

  it('renders with no students', () => {
    render(
      <StudentsTable
        students={[]}
        setStudents={setStudents}
        searchTerm=""
        setSearchTerm={setSearchTerm}
        setAddByCSVOpen={setAddByCSVOpen}
        setAddDialogOpen={setAddDialogOpen}
        classId="1"
        user={mockUser}
        renderPagination={renderPagination}
        currentPage={1}
        setCurrentPage={setCurrentPage}
      />
    );

    expect(screen.getByText('No students found')).toBeInTheDocument();
  });

  it('renders with students', () => {
    render(
      <StudentsTable
        students={mockStudents}
        setStudents={setStudents}
        searchTerm=""
        setSearchTerm={setSearchTerm}
        setAddByCSVOpen={setAddByCSVOpen}
        setAddDialogOpen={setAddDialogOpen}
        classId="1"
        user={mockUser}
        renderPagination={renderPagination}
        currentPage={1}
        setCurrentPage={setCurrentPage}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();
  });

  it('handles search input change', () => {
    render(
      <StudentsTable
        students={mockStudents}
        setStudents={setStudents}
        searchTerm=""
        setSearchTerm={setSearchTerm}
        setAddByCSVOpen={setAddByCSVOpen}
        setAddDialogOpen={setAddDialogOpen}
        classId="1"
        user={mockUser}
        renderPagination={renderPagination}
        currentPage={1}
        setCurrentPage={setCurrentPage}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search students');
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    expect(setSearchTerm).toHaveBeenCalledWith('Jane');
  });

  it('opens delete dialog on delete button click', async () => {
    render(
      <StudentsTable
        students={mockStudents}
        setStudents={setStudents}
        searchTerm=""
        setSearchTerm={setSearchTerm}
        setAddByCSVOpen={setAddByCSVOpen}
        setAddDialogOpen={setAddDialogOpen}
        classId="1"
        user={mockUser}
        renderPagination={renderPagination}
        currentPage={1}
        setCurrentPage={setCurrentPage}
      />
    );

    fireEvent.click(screen.getAllByText('Delete')[0]);

    await waitFor(() => {
      expect(screen.getByText('Are you sure you want to remove the student John Doe from this class?')).toBeInTheDocument();
    });
  });

  it('handles student deletion', async () => {
    removeStudentFromClass.mockResolvedValue({ status: 'Success' });

    render(
      <StudentsTable
        students={mockStudents}
        setStudents={setStudents}
        searchTerm=""
        setSearchTerm={setSearchTerm}
        setAddByCSVOpen={setAddByCSVOpen}
        setAddDialogOpen={setAddDialogOpen}
        classId="1"
        user={mockUser}
        renderPagination={renderPagination}
        currentPage={1}
        setCurrentPage={setCurrentPage}
      />
    );

    fireEvent.click(screen.getAllByText('Delete')[0]);

    await waitFor(() => {
      expect(screen.getByText('Are you sure you want to remove the student John Doe from this class?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Remove'));

    await waitFor(() => {
      expect(screen.getByText('Are you really sure you want to remove the student John Doe from this class?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Remove'));

    await waitFor(() => {
      expect(removeStudentFromClass).toHaveBeenCalledWith('1', '1');
      expect(setStudents).toHaveBeenCalled();
    });
  });
});