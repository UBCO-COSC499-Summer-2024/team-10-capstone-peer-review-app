import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Settings from '@/pages/Settings';
import { updateUser } from '@/utils/redux/hooks/userSlice';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';

// Mock store setup
const mockStore = configureStore([]);
const store = mockStore({
  user: {
    currentUser: {
      username: 'testuser',
      email: 'testuser@example.com',
      bio: 'This is a bio',
      urls: ['https://example.com', 'https://example2.com'],
      firstname: 'Test',
      lastname: 'User',
      description: 'This is a test user'
    }
  }
});

// Mock dispatch
store.dispatch = jest.fn();

describe('Settings Component', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );
  });

  test('renders profile tab by default', () => {
    expect(screen.getByLabelText('Profile')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Bio')).toBeInTheDocument();
    expect(screen.getByLabelText('URL')).toBeInTheDocument();
  });

  test('allows switching between tabs', async () => {
    userEvent.click(screen.getByText('Profile', { selector: 'button' }));
    await waitFor(() => expect(screen.getByText('Username')).toBeInTheDocument());

    userEvent.click(screen.getByText('Account'));
    await waitFor(() => expect(screen.getByText('Account Settings')).toBeInTheDocument());
  
    userEvent.click(screen.getByText('Notifications'));
    await waitFor(() => expect(screen.getByText('Notification Settings')).toBeInTheDocument());
  
    userEvent.click(screen.getByText('Privacy'));
    await waitFor(() => expect(screen.getByText('Privacy Settings')).toBeInTheDocument());
  
    userEvent.click(screen.getByText('Integrations'));
    await waitFor(() => expect(screen.getByText('Integrations Settings')).toBeInTheDocument());
  });

  test('updates profile information and dispatches updateUser action', () => {
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const bioInput = screen.getByLabelText('Bio');
    const urlInput = screen.getByLabelText('URL');

    fireEvent.change(usernameInput, { target: { value: 'newusername' } });
    fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });
    fireEvent.change(bioInput, { target: { value: 'New bio' } });
    fireEvent.change(urlInput, { target: { value: 'https://newurl.com' } });

    fireEvent.click(screen.getByText('Save'));

    expect(store.dispatch).toHaveBeenCalledWith(updateUser({
      username: 'newusername',
      email: 'newemail@example.com',
      bio: 'New bio',
      urls: ['https://newurl.com']
    }));
  });

  test('displays the correct username and email', () => {
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
  
    expect(usernameInput.value).toBe('testuser');
    expect(emailInput.value).toBe('testuser@example.com');
  });
});
