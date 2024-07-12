// LoginCard.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import LoginCard from '@/components/login/LoginCard';
import { loginUser, confirmEmail } from '@/api/authApi';

// Mock the API calls
jest.mock('@/api/authApi', () => ({
  loginUser: jest.fn(),
  confirmEmail: jest.fn(),
}));

// Mock the Toaster component
jest.mock('@/components/ui/toaster', () => ({
  Toaster: jest.fn(() => null),
}));

// Mock useLocation hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('LoginCard', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    // Mock useLocation to return a URL with no query params
    useLocation.mockReturnValue({
      search: '',
    });

    render(
      <MemoryRouter>
        <LoginCard />
      </MemoryRouter>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('handles email verification token', async () => {
    // Mock useLocation to return a URL with a verifyEmailToken query param
    useLocation.mockReturnValue({
      search: '?verifyEmailToken=valid-token',
    });

    confirmEmail.mockResolvedValueOnce({ status: 'Success' });

    render(
      <MemoryRouter>
        <LoginCard />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(confirmEmail).toHaveBeenCalledWith('valid-token')
    );

    expect(screen.getByText(/The email verification was successful!/i)).toBeInTheDocument();
  });

  it('handles login', async () => {
    loginUser.mockResolvedValueOnce({ status: 'Success', userRole: 'USER' });

    confirmEmail.mockResolvedValueOnce({ status: 'Success' });

    render(
      <MemoryRouter>
        <LoginCard />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'user@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password' },
    });

    fireEvent.click(screen.getByText(/Sign in/i));

    await waitFor(() =>
      expect(loginUser).toHaveBeenCalledWith('user@example.com', 'password')
    );
  });

  it('shows error message on login failure', async () => {
    loginUser.mockResolvedValueOnce({
      status: 'Error',
      message: 'Invalid credentials',
    });

    confirmEmail.mockResolvedValueOnce({ status: 'Success' });

    render(
      <MemoryRouter>
        <LoginCard />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'user@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByText(/Sign in/i));

    await waitFor(() =>
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument()
    );
  });
});
