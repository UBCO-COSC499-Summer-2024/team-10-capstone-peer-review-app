import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import LoginCard from '@/components/login/LoginCard';
import { loginUser, confirmEmail } from '@/api/authApi';
import { useUser } from '@/contexts/contextHooks/useUser';

// Mock the necessary modules
jest.mock('@/api/authApi');
jest.mock('@/contexts/contextHooks/useUser');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('LoginCard', () => {
  const mockSetUserContext = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useUser.mockReturnValue({ setUserContext: mockSetUserContext });
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders LoginCard component', () => {
    render(
      <Router>
        <LoginCard />
      </Router>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    loginUser.mockResolvedValue({ status: 'Success', userRole: 'USER' });

    render(
      <Router>
        <LoginCard />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/Sign in/i));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith('test@example.com', 'password');
      expect(mockSetUserContext).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('handles email verification', async () => {
    confirmEmail.mockResolvedValue({ status: 'Success' });

    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
      search: '?verifyEmailToken=test-token'
    });

    render(
      <Router>
        <LoginCard />
      </Router>
    );

    await waitFor(() => {
      expect(confirmEmail).toHaveBeenCalledWith('test-token');
      expect(screen.getByText(/The email verification was successful!/i)).toBeInTheDocument();
    });
  });

  test('displays error message on login failure', async () => {
    loginUser.mockResolvedValue({ status: 'Error', message: 'Invalid credentials' });

    render(
      <Router>
        <LoginCard />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText(/Sign in/i));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});