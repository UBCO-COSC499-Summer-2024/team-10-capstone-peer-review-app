import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import RegisterCard from '@/components/login/RegisterCard';
import { registerUser } from '@/api/authApi';

// Mock the registerUser API function
jest.mock('@/api/authApi', () => ({
    registerUser: jest.fn(),
}));

const mockedRegisterUser = registerUser;

describe('RegisterCard', () => {
    const mockOnSwitchToLogin = jest.fn();

    beforeEach(() => {
        mockedRegisterUser.mockClear();
    });

    it('renders the RegisterCard component', () => {
        const { getByText, getByLabelText } = render(<RegisterCard onSwitchToLogin={mockOnSwitchToLogin} />);

        expect(getByText('Register')).toBeInTheDocument();
        expect(getByLabelText('First Name:')).toBeInTheDocument();
        expect(getByLabelText('Last Name:')).toBeInTheDocument();
        expect(getByLabelText('Email Address:')).toBeInTheDocument();
        expect(getByLabelText('Password:')).toBeInTheDocument();
        expect(getByLabelText('Confirm Password:')).toBeInTheDocument();
    });

    it('validates form fields correctly', async () => {
        const { getByLabelText, getByText, getByRole } = render(<RegisterCard onSwitchToLogin={mockOnSwitchToLogin} />);

        mockedRegisterUser.mockResolvedValue({
          status: 'Success',
        });

        fireEvent.change(getByLabelText('First Name:'), { target: { value: 'John' } });
        fireEvent.change(getByLabelText('Last Name:'), { target: { value: 'Doe' } });
        fireEvent.change(getByLabelText('Email Address:'), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(getByLabelText('Password:'), { target: { value: 'Password1!' } });
        fireEvent.change(getByLabelText('Confirm Password:'), { target: { value: 'Password1!' } });

        fireEvent.click(getByRole('button', { name: "Sign up"}));

        await waitFor(() => {
            expect(mockedRegisterUser).toHaveBeenCalledWith({
                email: 'john.doe@example.com',
                password: 'Password1!',
                firstname: 'John',
                lastname: 'Doe',
                role: 'STUDENT',
            });
        });
    });

    it('displays client-side validation errors', async () => {
        const { getByLabelText, getByText, getByRole } = render(<RegisterCard onSwitchToLogin={mockOnSwitchToLogin} />);

        fireEvent.change(getByLabelText('First Name:'), { target: { value: 'John' } });
        fireEvent.change(getByLabelText('Last Name:'), { target: { value: 'Doe' } });
        fireEvent.change(getByLabelText('Email Address:'), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(getByLabelText('Password:'), { target: { value: 'password' } });
        fireEvent.change(getByLabelText('Confirm Password:'), { target: { value: 'differentPassword' } });

        fireEvent.click(getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
            expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
        });
    });

    it('handles API error response', async () => {
        mockedRegisterUser.mockResolvedValue({
            status: 'Error',
            message: 'Email already in use',
        });

        const { getByLabelText, getByText, getByRole } = render(<RegisterCard onSwitchToLogin={mockOnSwitchToLogin} />);

        fireEvent.change(getByLabelText('First Name:'), { target: { value: 'John' } });
        fireEvent.change(getByLabelText('Last Name:'), { target: { value: 'Doe' } });
        fireEvent.change(getByLabelText('Email Address:'), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(getByLabelText('Password:'), { target: { value: 'Password1!' } });
        fireEvent.change(getByLabelText('Confirm Password:'), { target: { value: 'Password1!' } });

        fireEvent.click(getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/email already in use/i)).toBeInTheDocument();
        });
    });

    it('switches to login on successful registration', async () => {
        mockedRegisterUser.mockResolvedValue({
            status: 'Success',
        });

        const { getByLabelText, getByRole } = render(<RegisterCard onSwitchToLogin={mockOnSwitchToLogin} />);

        fireEvent.change(getByLabelText('First Name:'), { target: { value: 'John' } });
        fireEvent.change(getByLabelText('Last Name:'), { target: { value: 'Doe' } });
        fireEvent.change(getByLabelText('Email Address:'), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(getByLabelText('Password:'), { target: { value: 'Password1!' } });
        fireEvent.change(getByLabelText('Confirm Password:'), { target: { value: 'Password1!' } });

        fireEvent.click(getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(mockOnSwitchToLogin).toHaveBeenCalled();
        });
    });
});