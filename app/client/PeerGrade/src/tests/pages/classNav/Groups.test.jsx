import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Groups from '@/pages/classNav/Groups';
import { useUser } from '@/contexts/contextHooks/useUser';
import {
  getAllGroupsByClass,
  createGroup,
  deleteGroup,
  updateGroup,
  joinGroup,
  leaveGroup,
  getUsersNotInGroups,
} from '@/api/classApi';
import { getGroups } from '@/api/userApi';
import { useToast } from '@/components/ui/use-toast';
import { useParams } from 'react-router-dom';

jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/components/ui/use-toast');
jest.mock('@/api/classApi');
jest.mock('@/api/userApi');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

toast = jest.fn();

const mockUser = {
  userId: 'test-user-id',
  role: 'STUDENT',
  firstname: "First",
  lastname: "Name",
};

useUser.mockReturnValue({
  user: mockUser,
  userLoading: false,
});

useParams.mockReturnValue({
  classId: 'test-class-id',
});

describe('Groups Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getUsersNotInGroups.mockResolvedValueOnce({
      status: 'Success',
      data: []
    });
  });

  test('fetches and displays groups', async () => {
    getAllGroupsByClass.mockResolvedValueOnce({
      data: [
        { groupId: '1', groupName: 'Group 1', groupDescription: 'Description 1', students: [] },
        { groupId: '2', groupName: 'Group 2', groupDescription: 'Description 2', students: [] },
      ],
    });
    getGroups.mockResolvedValueOnce({
      data: [],
    });

    render(
      <BrowserRouter>
        <Groups />
      </BrowserRouter>
    );

    expect(await screen.findByText('Group 1')).toBeInTheDocument();
    expect(screen.getByText('Group 2')).toBeInTheDocument();
  });

  test('joins a group', async () => {
    getAllGroupsByClass.mockResolvedValueOnce({
      data: [
        { groupId: '1', groupName: 'Group 1', groupDescription: 'Description 1', students: [] },
      ],
    });
    getGroups.mockResolvedValueOnce({
      data: [],
    });
    joinGroup.mockResolvedValueOnce({
      status: 'Success',
    });

    render(
      <BrowserRouter>
        <Groups />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Group 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Join"));

    await waitFor(() => expect(joinGroup).toHaveBeenCalledWith('1'));
  });

  test('leaves a group', async () => {
    getAllGroupsByClass.mockResolvedValueOnce({
      data: [
        { groupId: '1', classId: 'test-class-id', groupName: 'Group 1', groupDescription: 'Description 1', students: [{userId: 'test-user-id', role: 'STUDENT'}] },
      ],
    });
    getGroups.mockResolvedValueOnce({
      data: [
        { groupId: '1', classId: 'test-class-id', groupName: 'Group 1', groupDescription: 'Description 1', students: [{userId: 'test-user-id', role: 'STUDENT'}] },
      ],
    });
    leaveGroup.mockResolvedValueOnce({
      status: 'Success',
    });

    render(
      <BrowserRouter>
        <Groups />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Group 1")).toBeInTheDocument();
    });

    fireEvent.click(await screen.findByText('Leave'));

    await waitFor(() => expect(leaveGroup).toHaveBeenCalledWith('1'));
  });

  test('adds a group', async () => {
    getAllGroupsByClass.mockResolvedValueOnce({
      data: [],
    });
    getGroups.mockResolvedValueOnce({
      data: [],
    });
    createGroup.mockResolvedValueOnce({
      status: 'Success',
      data: { groupId: '3', groupName: 'New Group', groupDescription: 'New Description', students: [] },
    });
    mockUser.role = 'INSTRUCTOR';

    render(
      <BrowserRouter>
        <Groups />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Add Group'));
    fireEvent.change(screen.getByLabelText(/Group Name/i), { target: { value: 'New Group' } });
    fireEvent.change(screen.getByLabelText(/Group Description/i), { target: { value: 'New Description' } });
    fireEvent.change(screen.getByLabelText(/Group Size/i), { target: { value: '10' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(createGroup).toHaveBeenCalledWith('test-class-id', expect.any(Object)));
  });

  test('edits a group', async () => {
    getAllGroupsByClass.mockResolvedValueOnce({
      data: [
        { groupId: '1', groupName: 'Group 1', groupDescription: 'Description 1', groupSize: 2, students: [] },
      ],
    });
    getGroups.mockResolvedValueOnce({
        data: [],
    });
    updateGroup.mockResolvedValueOnce({
        status: 'Success',
        data: { groupId: '1', groupName: 'Updated Group', groupDescription: 'Updated Description', groupSize: 2, students: [] },
    });
    getUsersNotInGroups.mockResolvedValueOnce({
      status: 'Success',
      data: []
    });
    mockUser.role = 'INSTRUCTOR';

    render(
        <BrowserRouter>
            <Groups />
        </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Group 1")).toBeInTheDocument();
    });

    fireEvent.click(await screen.getByTestId('edit-group-1'));

    await waitFor(() => {
      expect(screen.getByText("Edit Group")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Group Name"), { target: { value: 'Updated Group' } });
    fireEvent.change(screen.getByLabelText("Group Description"), { target: { value: 'Updated Description' } });
    fireEvent.change(screen.getByLabelText("Group Size"), { target: { value: '15' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(updateGroup).toHaveBeenCalledWith('1', expect.any(Object)));
  });

  test('deletes a group', async () => {
    getAllGroupsByClass.mockResolvedValueOnce({
        data: [
            { groupId: '1', groupName: 'Group 1', groupDescription: 'Description 1', students: [] },
        ],
        status: 'Success',
    });
    getGroups.mockResolvedValueOnce({
        data: [],
    });
    deleteGroup.mockResolvedValueOnce({
        status: 'Success',
    });
    getUsersNotInGroups.mockResolvedValueOnce({
      status: 'Success',
      data: [mockUser]
    });

    render(
        <BrowserRouter>
            <Groups />
        </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Group 1")).toBeInTheDocument();
    });

    fireEvent.click(await screen.getByTestId('delete-group-1'));

    await waitFor(() => {
      expect(screen.getByText("Delete Group")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(screen.getByText("Confirm Delete Group")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => expect(deleteGroup).toHaveBeenCalledWith('1'));
  });
});
