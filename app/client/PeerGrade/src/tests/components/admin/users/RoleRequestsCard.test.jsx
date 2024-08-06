import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import RoleRequestsCard from '@/components/admin/users/RoleRequestsCard';
import { updateRoleRequestStatus, deleteRoleRequest } from '@/api/authApi';
import { getStatusDetails } from '@/utils/statusIcons';

// Mock the dependencies
jest.mock('@/api/authApi');
jest.mock('@/utils/statusIcons');

describe('RoleRequestsCard', () => {
  const mockRoleRequest = {
    roleRequestId: '1',
    status: 'PENDING',
    user: {
        userId: '1',
        firstname: 'John',
        lastname: 'Doe',
        email: 'test@gmail.com'
    },
    roleRequested: 'ADMIN'
  };

  const mockRefreshRoleRequests = jest.fn();
  const mockGetStatusDetails = { icon: <div data-testid="status-icon" /> };

  beforeEach(() => {
    getStatusDetails.mockReturnValue(mockGetStatusDetails);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders RoleRequestsCard component', () => {
    const { getByText, getByTestId } = render(
      <RoleRequestsCard
        key="1"
        roleRequest={mockRoleRequest}
        refreshRoleRequests={mockRefreshRoleRequests}
        title="Test Title"
        description="Test Description"
      />
    );

    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Description')).toBeInTheDocument();
  });

  test('handles approve action', async () => {
    updateRoleRequestStatus.mockResolvedValue({ status: 'Success' });

    const { getByRole, getByTestId } = render(
      <RoleRequestsCard
        key="1"
        roleRequest={mockRoleRequest}
        refreshRoleRequests={mockRefreshRoleRequests}
        title="Test Title"
        description="Test Description"
      />
    );

    fireEvent.click(getByTestId('approve-role-req-1'));

    await waitFor(() => {
      expect(updateRoleRequestStatus).toHaveBeenCalledWith('1', 'APPROVED');
      expect(mockRefreshRoleRequests).toHaveBeenCalled();
    });
  });

  test('handles deny action', async () => {
    updateRoleRequestStatus.mockResolvedValue({ status: 'Success' });

    const { getByRole, getByTestId } = render(
      <RoleRequestsCard
        key="1"
        roleRequest={mockRoleRequest}
        refreshRoleRequests={mockRefreshRoleRequests}
        title="Test Title"
        description="Test Description"
      />
    );

    fireEvent.click(getByTestId('unapprove-role-req-1'));

    await waitFor(() => {
      expect(updateRoleRequestStatus).toHaveBeenCalledWith('1', 'DENIED');
      expect(mockRefreshRoleRequests).toHaveBeenCalled();
    });
  });

  test('handles delete action', async () => {
    deleteRoleRequest.mockResolvedValue({ status: 'Success' });

    const { getByRole, getByTestId, queryByText, getByText } = render(
      <RoleRequestsCard
        key="1"
        roleRequest={mockRoleRequest}
        refreshRoleRequests={mockRefreshRoleRequests}
        title="Test Title"
        description="Test Description"
      />
    );

    fireEvent.click(getByTestId('delete-role-req-1'));

    await waitFor(() => {
        expect(queryByText('Are you absolutely sure?')).toBeInTheDocument();
    });

    fireEvent.click(getByText('Continue'));

    await waitFor(() => {
      expect(deleteRoleRequest).toHaveBeenCalledWith('1');
      expect(mockRefreshRoleRequests).toHaveBeenCalled();
    });
  });
});