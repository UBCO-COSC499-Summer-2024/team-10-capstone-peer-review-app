import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotificationsPanel from '@/components/admin/NotificationsPanel';
import { sendNotificationToClass, sendNotificationToGroup, sendNotificationToRole, sendNotificationToAll } from '@/api/notifsApi';
import { getAllGroups } from '@/api/userApi';
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";
import { useToast } from '@/components/ui/use-toast';

// Mock the API calls and context hooks
jest.mock('@/api/notifsApi');
jest.mock('@/api/userApi');
jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/contexts/contextHooks/useClass');
jest.mock('@/components/ui/use-toast');

describe('NotificationsPanel', () => {
  beforeEach(() => {
    useUser.mockReturnValue({ user: { userId: '123' }, userLoading: false });
    useClass.mockReturnValue({ classes: [{ classId: '1', classname: 'Class 1' }] });
    useToast.mockReturnValue({ toast: jest.fn() });
    getAllGroups.mockResolvedValue({ data: [{ groupId: '1', groupName: 'Group 1' }] });
  });

  test('renders input fields and buttons', () => {
    render(<NotificationsPanel />);

    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Content')).toBeInTheDocument();
    expect(screen.getByText('Send Notification to All Users')).toBeInTheDocument();
  });

  test('updates state on input change', () => {
    render(<NotificationsPanel />);

    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByPlaceholderText('Content'), { target: { value: 'Test Content' } });

    expect(screen.getByPlaceholderText('Title')).toHaveValue('Test Title');
    expect(screen.getByPlaceholderText('Content')).toHaveValue('Test Content');
  });

  test('sends notification to all users', async () => {
    sendNotificationToAll.mockResolvedValue({ status: 'Success' });

    render(<NotificationsPanel />);

    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByPlaceholderText('Content'), { target: { value: 'Test Content' } });
    fireEvent.click(screen.getByText('Send Notification to All Users'));

    await waitFor(() => {
      expect(sendNotificationToAll).toHaveBeenCalledWith('123', 'Test Title', 'Test Content');
      expect(screen.getByPlaceholderText('Title')).toHaveValue('');
      expect(screen.getByPlaceholderText('Content')).toHaveValue('');
    });
  });
});
