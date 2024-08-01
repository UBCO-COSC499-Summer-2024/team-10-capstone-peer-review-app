import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Groups from '@/components/admin/Groups';
import { useUser } from '@/contexts/contextHooks/useUser';
import { useClass } from '@/contexts/contextHooks/useClass';
import { getAllGroups } from '@/api/userApi';

// Mock the dependencies
jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/contexts/contextHooks/useClass');
jest.mock('@/api/userApi');

describe('Groups Component', () => {
  beforeEach(() => {
    useUser.mockReturnValue({
      user: { id: 1, name: 'Test User' },
      userLoading: false,
    });

    useClass.mockReturnValue({
      classes: [{ classId: 1, classname: 'Class 1' }],
      isClassLoading: false,
    });

    getAllGroups.mockResolvedValue({
      status: 'Success',
      data: [
        { groupId: 1, groupName: 'Group 1', groupDescription: 'Description 1', groupSize: 10, classId: 1 },
        { groupId: 2, groupName: 'Group 2', groupDescription: 'Description 2', groupSize: 20, classId: 2 },
      ],
    });
  });

  test('renders Groups component', () => {
    render(<Groups />);
    expect(screen.getByText('Groups')).toBeInTheDocument();
  });

  test('fetches and displays groups data', async () => {
    render(<Groups />);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('Class 1')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Group 2')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
  });
});