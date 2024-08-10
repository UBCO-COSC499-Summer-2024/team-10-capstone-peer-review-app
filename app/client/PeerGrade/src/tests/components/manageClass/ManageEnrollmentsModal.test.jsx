import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManageEnrollmentsModal from '@/components/manageClass/ManageEnrollmentsModal';
import { getEnrollRequestsForClass, updateEnrollRequestStatus, deleteEnrollRequest } from '@/api/enrollmentApi';
import { useToast } from '@/components/ui/use-toast';

jest.mock('@/api/enrollmentApi');
jest.mock('@/components/ui/use-toast');

describe('ManageEnrollmentsModal', () => {
  const mockToast = jest.fn();
  useToast.mockReturnValue({ toast: mockToast });

  const classItem = { classId: '1', classname: 'Test Class' };
  const enrollRequests = [
    {
      enrollRequestId: '1',
      user: { firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com' },
      createdAt: '2023-01-01T00:00:00Z',
      senderMessage: 'Please enroll me',
      status: 'PENDING',
    },
    {
      enrollRequestId: '2',
      user: { firstname: 'Jane', lastname: 'Smith', email: 'jane.smith@example.com' },
      createdAt: '2023-01-02T00:00:00Z',
      senderMessage: '',
      status: 'PENDING',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly when open', async () => {
    getEnrollRequestsForClass.mockResolvedValue({ data: enrollRequests });

    render(<ManageEnrollmentsModal open={true} onOpenChange={() => {}} classItem={classItem} />);

    expect(screen.getByText(/Manage Enrollment Requests for Test Class/i)).toBeInTheDocument();
    await waitFor(() => expect(getEnrollRequestsForClass).toHaveBeenCalledWith('1'));
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
  });

  test('filters requests based on search term', async () => {
    getEnrollRequestsForClass.mockResolvedValue({ data: enrollRequests });

    render(<ManageEnrollmentsModal open={true} onOpenChange={() => {}} classItem={classItem} />);

    await waitFor(() => expect(getEnrollRequestsForClass).toHaveBeenCalledWith('1'));

    fireEvent.change(screen.getByPlaceholderText(/Search by student name/i), { target: { value: 'John' } });
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.queryByText(/Jane Smith/i)).not.toBeInTheDocument();
  });

  test('updates status correctly', async () => {
    getEnrollRequestsForClass.mockResolvedValue({ data: enrollRequests });
    updateEnrollRequestStatus.mockResolvedValue({});

    render(<ManageEnrollmentsModal open={true} onOpenChange={() => {}} classItem={classItem} />);

    await waitFor(() => expect(getEnrollRequestsForClass).toHaveBeenCalledWith('1'));

    fireEvent.click(screen.getAllByText(/Approve/i)[0]);
    await waitFor(() => expect(updateEnrollRequestStatus).toHaveBeenCalledWith('1', 'APPROVED'));
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Success' }));
  });

  test('deletes request correctly', async () => {
    getEnrollRequestsForClass.mockResolvedValue({ data: enrollRequests });
    deleteEnrollRequest.mockResolvedValue({});

    render(<ManageEnrollmentsModal open={true} onOpenChange={() => {}} classItem={classItem} />);

    await waitFor(() => expect(getEnrollRequestsForClass).toHaveBeenCalledWith('1'));

    fireEvent.click(screen.getAllByText(/Delete/i)[0]);
    await waitFor(() => expect(deleteEnrollRequest).toHaveBeenCalledWith('1', undefined));
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Success' }));
  });
});