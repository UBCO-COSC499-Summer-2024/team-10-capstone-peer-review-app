import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudentEnrollmentRequests from '@/pages/StudentEnrollmentRequests';
import { getAllClassesUserisNotIn, createEnrollRequest, getEnrollRequestsForUser } from '@/api/classApi';
import { useToast } from '@/components/ui/use-toast';

jest.mock('@/api/classApi');
jest.mock('@/components/ui/use-toast');

describe('StudentEnrollmentRequests', () => {
  beforeEach(() => {
    useToast.mockReturnValue({ toast: jest.fn() });
  });

  test('renders component correctly', async () => {
    getAllClassesUserisNotIn.mockResolvedValue({
      status: 'Success',
      data: []
    });
    getEnrollRequestsForUser.mockResolvedValue({
      status: 'Success',
      data: []
    });

    render(<StudentEnrollmentRequests />);

    expect(screen.getByText('Enroll in Classes')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search classes...')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('No classes available')).toBeInTheDocument());
  });

  test('search functionality filters classes', async () => {
    const mockClasses = [
      { classId: 1, classname: 'Math 101', description: 'Basic Math', instructor: { firstname: 'John', lastname: 'Doe' }, startDate: '2023-01-01', endDate: '2023-06-01', availableSeats: 10 },
      { classId: 2, classname: 'History 101', description: 'World History', instructor: { firstname: 'Jane', lastname: 'Doe' }, startDate: '2023-01-01', endDate: '2023-06-01', availableSeats: 10 }
    ];

    getAllClassesUserisNotIn.mockResolvedValue({
      status: 'Success',
      data: mockClasses
    });
    getEnrollRequestsForUser.mockResolvedValue({
      status: 'Success',
      data: []
    });

    render(<StudentEnrollmentRequests />);

    await waitFor(() => expect(screen.getByText('Math 101')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText('Search classes...'), { target: { value: 'History' } });

    await waitFor(() => {
      expect(screen.queryByText('Math 101')).not.toBeInTheDocument();
      expect(screen.getByText('History 101')).toBeInTheDocument();
    });
  });

  test('pagination works for classes', async () => {
    const mockClasses = Array.from({ length: 10 }, (_, i) => ({
      classId: i + 1,
      classname: `Class ${i + 1}`,
      description: `Description ${i + 1}`,
      instructor: { firstname: 'John', lastname: 'Doe' },
      startDate: '2023-01-01',
      endDate: '2023-06-01',
      availableSeats: 10
    }));

    getAllClassesUserisNotIn.mockResolvedValue({
      status: 'Success',
      data: mockClasses
    });
    getEnrollRequestsForUser.mockResolvedValue({
      status: 'Success',
      data: []
    });

    render(<StudentEnrollmentRequests />);

    await waitFor(() => expect(screen.getByText('Class 1')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(screen.queryByText('Class 1')).not.toBeInTheDocument();
      expect(screen.getByText('Class 4')).toBeInTheDocument();
    });
  });

  test('enrollment request dialog opens and sends request', async () => {
    const mockClasses = [
      { classId: 1, classname: 'Math 101', description: 'Basic Math', instructor: { firstname: 'John', lastname: 'Doe' }, startDate: '2023-01-01', endDate: '2023-06-01', availableSeats: 10 }
    ];

    getAllClassesUserisNotIn.mockResolvedValue({
      status: 'Success',
      data: mockClasses
    });
    getEnrollRequestsForUser.mockResolvedValue({
      status: 'Success',
      data: []
    });

    render(<StudentEnrollmentRequests />);

    await waitFor(() => expect(screen.getByText('Math 101')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Enroll'));

    expect(screen.getByText('Enroll in Math 101')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Enter a message for your enrollment request (optional)'), { target: { value: 'Please enroll me' } });

    createEnrollRequest.mockResolvedValue({ status: 'Success' });

    fireEvent.click(screen.getByText('Send Request'));

    await waitFor(() => expect(useToast().toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Success', description: 'Enrollment request sent' })));
  });
});