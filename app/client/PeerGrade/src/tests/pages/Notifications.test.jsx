import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Notifications from '@/pages/Notifications';
import { useUser } from '@/contexts/contextHooks/useUser';
import { getNotifications, deleteNotification } from '@/api/notifsApi';

jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/api/notifsApi');

const mockUser = {
  user: { userId: '123' },
  userLoading: false,
};

const mockNotifications = {
  data: [
    { notificationId: '1', title: 'Notification 1', content: "bingo", createdAt: new Date() },
    { notificationId: '2', title: 'Notification 2', content: "bongo", createdAt: new Date() },
  ],
};

describe('Notifications Component', () => {
  beforeEach(() => {
    useUser.mockReturnValue(mockUser);
    getNotifications.mockResolvedValue(mockNotifications);
    deleteNotification.mockResolvedValue({ status: 'Success' });
  });

  it('renders the component', () => {
    render(<Notifications />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Here are all your notifications.')).toBeInTheDocument();
  });

  it('displays notifications', async () => {
    render(<Notifications />);
    await waitFor(() => {
      expect(screen.getByText('Notification 1')).toBeInTheDocument();
      expect(screen.getByText('Notification 2')).toBeInTheDocument();
    });
  });

  it('displays no notifications message when there are no notifications', async () => {
    getNotifications.mockResolvedValue({ data: [] });
    render(<Notifications />);
    await waitFor(() => {
      expect(screen.getByText('You have no notifications!')).toBeInTheDocument();
    });
  });

  it('handles deleting a notification', async () => {
    render(<Notifications />);
    await waitFor(() => {
      expect(screen.getByText('Notification 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('delete-notification-1'));

    await waitFor(() => {
      expect(deleteNotification).toHaveBeenCalledWith('1');
      mockNotifications.data = mockNotifications.data.filter((n) => n.notificationId !== '1'); // works in practice, but not in test as its using api calls
      expect(screen.queryByText('Notification 1')).not.toBeInTheDocument();
    });
  });
});