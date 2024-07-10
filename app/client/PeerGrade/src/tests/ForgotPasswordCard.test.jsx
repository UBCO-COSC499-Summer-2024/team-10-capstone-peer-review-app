import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import ForgotPasswordCard from '@/components/login/ForgotPasswordCard';
import {
	isEmailVerifiedJWT,
	resetPassword,
	sendForgotPasswordEmail,
} from '@/api/authApi';

// Mock the API calls
jest.mock('@/api/authApi', () => ({
	isEmailVerifiedJWT: jest.fn(),
	resetPassword: jest.fn(),
	sendForgotPasswordEmail: jest.fn(),
}));

jest.mock('@heroicons/react/24/outline', () => ({
	CheckCircleIcon: (props) => <svg {...props} data-testid="CheckCircleIcon" />,
	XCircleIcon: (props) => <svg {...props} data-testid="XCircleIcon" />,
}));

jest.mock('@heroicons/react/24/solid', () => ({
	EyeIcon: (props) => <svg {...props} data-testid="EyeIcon" />,
	EyeSlashIcon: (props) => <svg {...props} data-testid="EyeSlashIcon" />,
}));

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => jest.fn(),
	useLocation: jest.fn(),
}));

const mockUseLocation = useLocation;
const mockNavigate = jest.fn();

describe('ForgotPasswordCard', () => {
	beforeEach(() => {
		mockUseLocation.mockReturnValue({
			search: '',
		});
	});

	it('renders the component', () => {
		render(
			<MemoryRouter>
				<ForgotPasswordCard onSwitchToLogin={jest.fn()} />
			</MemoryRouter>
		);

		expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
	});

	it('shows email input initially', () => {
		render(
			<MemoryRouter>
				<ForgotPasswordCard onSwitchToLogin={jest.fn()} />
			</MemoryRouter>
		);

		expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
	});

	it('sends a reset email', async () => {
		sendForgotPasswordEmail.mockResolvedValueOnce({ status: 'Success' });

		render(
			<MemoryRouter>
				<ForgotPasswordCard onSwitchToLogin={jest.fn()} />
			</MemoryRouter>
		);

		fireEvent.change(screen.getByLabelText(/Email address/i), {
			target: { value: 'test@example.com' },
		});
		fireEvent.click(screen.getByText(/Send Reset Email/i));

		await waitFor(() =>
			expect(screen.getByText(/An email has been sent/i)).toBeInTheDocument()
		);
	});

	it('shows error if reset email fails', async () => {
		sendForgotPasswordEmail.mockResolvedValueOnce({
			status: 'Error',
			message: 'Email not found',
		});

		render(
			<MemoryRouter>
				<ForgotPasswordCard onSwitchToLogin={jest.fn()} />
			</MemoryRouter>
		);

		fireEvent.change(screen.getByLabelText(/Email address/i), {
			target: { value: 'test@example.com' },
		});
		fireEvent.click(screen.getByText(/Send Reset Email/i));

		await waitFor(() =>
			expect(screen.getByText(/Email not found/i)).toBeInTheDocument()
		);
	});

	it('validates the token and shows password fields', async () => {
		mockUseLocation.mockReturnValue({
			search: '?forgotPasswordToken=validToken',
		});

		isEmailVerifiedJWT.mockResolvedValueOnce({ status: 'Success' });

		render(
			<MemoryRouter>
				<ForgotPasswordCard onSwitchToLogin={jest.fn()} />
			</MemoryRouter>
		);

		await waitFor(() =>
			expect(
				screen.getByText(/Please enter your new password/i)
			).toBeInTheDocument()
		);
	});

	it('shows error if token validation fails', async () => {
		mockUseLocation.mockReturnValue({
			search: '?forgotPasswordToken=invalidToken',
		});

		isEmailVerifiedJWT.mockResolvedValueOnce({
			status: 'Error',
			message: 'Invalid token',
		});

		render(
			<MemoryRouter>
				<ForgotPasswordCard onSwitchToLogin={jest.fn()} />
			</MemoryRouter>
		);

		await waitFor(() =>
			expect(screen.getByText(/Invalid token/i)).toBeInTheDocument()
		);
	});

	it('resets the password and calls resetPassword', async () => {
		mockUseLocation.mockReturnValue({
			search: '?forgotPasswordToken=validToken',
		});

		isEmailVerifiedJWT.mockResolvedValueOnce({ status: 'Success' });
		resetPassword.mockResolvedValueOnce({ status: 'Success' });

		render(
			<MemoryRouter>
				<ForgotPasswordCard onSwitchToLogin={jest.fn()} />
			</MemoryRouter>
		);

		await waitFor(() =>
			expect(screen.getByLabelText("Password:")).toBeInTheDocument()
		);

		fireEvent.change(screen.getByLabelText("Password:"), {
			target: { value: 'ValidPass@1' },
		});
		fireEvent.change(screen.getByLabelText("Confirm Password:"), {
			target: { value: 'ValidPass@1' },
		});
		fireEvent.click(screen.getByText("Submit"));

		await waitFor(() => expect(resetPassword).toHaveBeenCalledWith('validToken', 'ValidPass@1'));
	});

	it('shows error if passwords do not match', async () => {
		mockUseLocation.mockReturnValue({
			search: '?forgotPasswordToken=validToken',
		});

		isEmailVerifiedJWT.mockResolvedValueOnce({ status: 'Success' });

		render(
			<MemoryRouter>
				<ForgotPasswordCard onSwitchToLogin={jest.fn()} />
			</MemoryRouter>
		);

		await waitFor(() =>
			expect(screen.getByLabelText("Password:")).toBeInTheDocument()
		);

		fireEvent.change(screen.getByLabelText("Password:"), {
			target: { value: 'ValidPass@1' },
		});
		fireEvent.change(screen.getByLabelText("Confirm Password:"), {
			target: { value: 'DifferentPass@1' },
		});
		fireEvent.click(screen.getByText("Submit"));

		await waitFor(() =>
			expect(screen.getByText("Passwords do not match")).toBeInTheDocument()
		);
	});
});
