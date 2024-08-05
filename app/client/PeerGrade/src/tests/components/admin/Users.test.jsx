import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Users from '@/components/admin/Users';
import { getAllUsers } from '@/api/userApi';
import { getAllRoleRequests } from '@/api/authApi';
import { getStatusDetails } from '@/utils/statusIcons';

jest.mock('@/api/userApi');
jest.mock('@/api/authApi');
jest.mock('@/utils/statusIcons');

const mockUsers = {
  status: 'Success',
  data: [
    {
      userId: '1',
      username: 'johndoe',
      email: 'johndoe@example.com',
      firstname: 'John',
      lastname: 'Doe',
      isEmailVerified: true,
      role: 'STUDENT',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-02',
    },
    {
      userId: '2',
      username: 'janesmith',
      email: 'janesmith@example.com',
      firstname: 'Jane',
      lastname: 'Smith',
      isEmailVerified: false,
      role: 'ADMIN',
      createdAt: '2023-07-15',
      updatedAt: '2023-07-16',
    },
  ],
};

const mockRoleRequests = {
  status: 'Success',
  data: [
    {
      roleRequestId: '1',
      roleRequested: 'INSTRUCTOR',
      status: 'Pending',
      user: {
        firstname: 'John',
        lastname: 'Doe',
      },
    },
  ],
};

describe('Users Component', () => {
  beforeEach(() => {
    getAllUsers.mockResolvedValue(mockUsers);
    getAllRoleRequests.mockResolvedValue(mockRoleRequests);
    getStatusDetails.mockReturnValue({ color: 'text-yellow-500' });
  });

  it('renders without crashing', async () => {
    render(<Users />);
    await waitFor(() => {
      expect(screen.getByText('Current Users')).toBeInTheDocument();
    });
  });

  it('fetches and displays users data', async () => {
    render(<Users />);
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('johndoe@example.com')).toBeInTheDocument();
      expect(screen.getByText('STUDENT')).toBeInTheDocument();
    });
  });

  it('fetches and displays role requests', async () => {
    render(<Users />);
    await waitFor(() => {
      expect(screen.getByText('Role Request for John Doe')).toBeInTheDocument();
      expect(screen.getByText('Status: Pending')).toBeInTheDocument();
    });
  });

  it('renders DataTable with correct props', async () => {
    render(<Users />);
    await waitFor(() => {
      const dataTable = screen.getByText('Last Updated');
      expect(dataTable).toBeInTheDocument();
    });
  });

  it('renders DataChart with correct props', async () => {
    render(<Users />);
    await waitFor(() => {
      const dataChart = screen.getByText('User Registration Trends').closest('div');
      expect(dataChart).toBeInTheDocument();
    });
  });

  it('renders RoleRequestsCard with correct props', async () => {
    render(<Users />);
    await waitFor(() => {
      const roleRequestCard = screen.getByText('Role Request for John Doe').closest('div');
      expect(roleRequestCard).toBeInTheDocument();
    });
  });
});