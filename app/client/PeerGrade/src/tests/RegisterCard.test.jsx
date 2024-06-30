import { render, fireEvent, waitFor } from '@testing-library/react';
import RegisterCard from '@/components/login/RegisterCard';

describe('RegisterCard', () => {
  let onSwitchToLogin;

  beforeEach(() => {
    onSwitchToLogin = jest.fn();
  });

  test('renders without crashing', () => {
    const { getByText } = render(<RegisterCard onSwitchToLogin={onSwitchToLogin} />);
    expect(getByText('Register')).toBeInTheDocument();
  });

  test('shows error message when passwords do not match', async () => {
    const { getByLabelText, getByText, getByRole } = render(<RegisterCard onSwitchToLogin={onSwitchToLogin} />);

    fireEvent.change(getByLabelText('First Name:'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Last Name:'), { target: { value: 'Doe' } });
    fireEvent.change(getByLabelText('Email Address:'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(getByLabelText('Password:'), { target: { value: 'passwosrd123@A' } });
    fireEvent.change(getByLabelText('Confirm Password:'), { target: { value: 'differentpassword123@AAAAAAAAA' } });
    fireEvent.click(getByRole('button', { name: 'Sign up' }));

    await waitFor(() => {
      expect(getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  // Add more tests here (on actual functionality, etc.)
});
