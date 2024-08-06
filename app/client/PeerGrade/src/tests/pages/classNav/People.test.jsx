import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import People from '@/pages/classNav/People';
import { useUser } from '@/contexts/contextHooks/useUser';
import {
  getInstructorByClassId,
  getStudentsByClassId,
  removeStudentFromClass,
  addStudentToClass
} from '@/api/classApi';
import { getUsersByRole, getGroups } from '@/api/userApi';

jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/api/classApi');
jest.mock('@/api/userApi');

window.HTMLElement.prototype.scrollIntoView = jest.fn();

const mockUser = {
  userId: '1',
  role: 'INSTRUCTOR'
};

describe('People component', () => {
  beforeEach(() => {
    useUser.mockReturnValue({
      user: mockUser,
      userLoading: false
    });
  });

  it('renders the component and fetches initial data', async () => {
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

    render(<People classId="123" />);

    expect(screen.getByPlaceholderText('Search people')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Brown')).toBeInTheDocument();
    });
  });

  it('filters students based on search term', async () => {
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

    render(<People classId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Search people'), {
      target: { value: 'Jane' }
    });

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('Bob Brown')).not.toBeInTheDocument();
    });
  });

  it('adds a student to the class', async () => {
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
    getUsersByRole.mockResolvedValue({
      status: 'Success',
      data: [
        { userId: '5', firstname: 'Alice', lastname: 'White' },
        { userId: '6', firstname: 'Tom', lastname: 'Green' }
      ]
    });
    getGroups.mockResolvedValue({
      status: 'Success',
      data: []
    });
    addStudentToClass.mockResolvedValue({
      status: 'Success',
      data: { userId: '5', firstname: 'Alice', lastname: 'White', avatarUrl: '' }
    });

    render(<People classId="123" />);

    fireEvent.click(screen.getByTestId('add-student-button'));

    await waitFor(() => {
      expect(screen.getByLabelText('Select students to add to the class:')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('add-student-dropdown'));
    
    await waitFor(() => {
      expect(screen.getByText('Alice White')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Alice White'));
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Alice White')).toBeInTheDocument();
    });
  });

  it('removes a student from the class', async () => {
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
    removeStudentFromClass.mockResolvedValue({
      status: 'Success'
    });
    getGroups.mockResolvedValue({
      status: 'Success',
      data: []
    });

    render(<People classId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('remove-student-button-3'));

    await waitFor(() => {
      expect(screen.getByText('Remove Student')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to remove the student Jane Smith from this class?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Remove'));

    await waitFor(() => {
      expect(screen.getByText('Confirm Remove Student')).toBeInTheDocument();
      expect(screen.getByText('Are you really sure you want to remove the student Jane Smith from this class?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Remove'));

    await waitFor(() => {
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });
});
