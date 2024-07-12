import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Settings from '@/pages/Settings';
import { useUser } from '@/contexts/contextHooks/useUser';
import { useToast } from '@/components/ui/use-toast';
import { updateProfile } from '@/api/userApi';

// Mock the necessary hooks and functions
jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/components/ui/use-toast');
jest.mock('@/api/userApi');

describe('Settings Component', () => {
  let user, setUserContext, toast;

  beforeEach(() => {
    user = {
      userId: '123',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com'
    };

    setUserContext = jest.fn();
    toast = jest.fn();

    useUser.mockReturnValue({
      user,
      userLoading: false,
      setUserContext,
    });

    useToast.mockReturnValue({
      toast,
    });

    updateProfile.mockResolvedValue({ status: 'Success' });
  });

  it('renders the Settings component', () => {
    render(<Settings />);

    // Check for the presence of the Settings title
    expect(screen.getByText('Settings')).toBeInTheDocument();
    // Check for the Profile tab being active by default
    expect(screen.getByText('Manage your personal information')).toBeInTheDocument();
    expect(screen.getByText('First name')).toBeInTheDocument();
  });

  it('switches between tabs', () => {
    render(<Settings />);

    const accountTab = screen.getByText('Account');
    fireEvent.click(accountTab);

    // Ensure Account section is rendered
    expect(screen.getByText('Manage your account settings')).toBeInTheDocument();
  });

  it('updates profile information', async () => {
    render(<Settings />);

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/Last name/i), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane.smith@example.com' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Save changes/i));

    await waitFor(() => {
      // Ensure the toast message is displayed
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Profile Updated',
      }));

      // Ensure the updateProfile API was called with the correct arguments
      expect(updateProfile).toHaveBeenCalledWith('123', {
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'jane.smith@example.com'
      });

      // Ensure the user context was updated
      expect(setUserContext).toHaveBeenCalled();
    });

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();
  });
});
