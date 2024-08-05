import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NotifCard from '@/components/global/NotifCard';
import { formatDistanceToNow } from 'date-fns';

jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn(),
}));

describe('NotifCard Component', () => {
  const mockNotificationData = {
    notificationId: '1',
    title: 'Test Notification',
    content: 'This is a test notification',
    createdAt: new Date().toISOString(),
  };

  const mockDeleteNotifCall = jest.fn();

  beforeEach(() => {
    formatDistanceToNow.mockReturnValue('2 hours ago');
  });

  it('renders the notification card with correct data', () => {
    render(<NotifCard notificationData={mockNotificationData} deleteNotifCall={mockDeleteNotifCall} />);

    expect(screen.getByText('Test Notification')).toBeInTheDocument();
    expect(screen.getByText('This is a test notification')).toBeInTheDocument();
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
  });

  it('calls deleteNotifCall with correct notification ID when delete button is clicked', () => {
    render(<NotifCard notificationData={mockNotificationData} deleteNotifCall={mockDeleteNotifCall} />);

    const deleteButton = screen.getByTestId('delete-notification-1');
    fireEvent.click(deleteButton);

    expect(mockDeleteNotifCall).toHaveBeenCalledWith('1');
  });
});