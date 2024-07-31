import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterCard from '@/components/login/RegisterCard';
import { registerUser } from '@/api/authApi';

jest.mock('@/api/authApi');

window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('RegisterCard', () => {
  const onSwitchToLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders register card', () => {
    render(<RegisterCard onSwitchToLogin={onSwitchToLogin} />);

    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password:')).toBeInTheDocument();
  });

  it('handles register success', async () => {
    registerUser.mockResolvedValueOnce({ status: 'Success' });

    render(<RegisterCard onSwitchToLogin={onSwitchToLogin} />);

    fireEvent.change(screen.getByLabelText('First Name:'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name:'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address:'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'Password1!' } });
    fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: 'Password1!' } });
    fireEvent.click(screen.getByText('Select option...'));
    fireEvent.click(screen.getByText('Student'));
    fireEvent.click(screen.getByText('Sign up'));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'Password1!',
        firstname: 'John',
        lastname: 'Doe',
        role: 'STUDENT'
      });
    });

    expect(onSwitchToLogin).toHaveBeenCalled();
  });

  it('handles register error', async () => {
    registerUser.mockResolvedValueOnce({ status: 'Error', message: 'Registration failed' });

    render(<RegisterCard onSwitchToLogin={onSwitchToLogin} />);

    fireEvent.change(screen.getByLabelText('First Name:'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name:'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address:'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'Password1!' } });
    fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: 'Password1!' } });
    fireEvent.click(screen.getByText('Select option...'));
    fireEvent.click(screen.getByText('Student'));
    fireEvent.click(screen.getByText('Sign up'));
    
    await waitFor(() => {
      expect(screen.getByText('Registration failed')).toBeInTheDocument();
    });
  });

  it('switches to login on button click', () => {
    render(<RegisterCard onSwitchToLogin={onSwitchToLogin} />);

    fireEvent.click(screen.getByText('Log in'));

    expect(onSwitchToLogin).toHaveBeenCalled();
  });

  it('shows validation errors for password mismatch and missing role', async () => {
    registerUser.mockResolvedValueOnce({ status: 'Fail' });
    render(<RegisterCard onSwitchToLogin={onSwitchToLogin} />);

    fireEvent.change(screen.getByLabelText('First Name:'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name:'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address:'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'Password1!' } });
    fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: 'Password2!' } });
    fireEvent.click(screen.getByText('Sign up'));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      expect(screen.getByText('Please select a role')).toBeInTheDocument();
    });
  });
});
