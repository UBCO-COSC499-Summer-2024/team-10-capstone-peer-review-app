import React from 'react';
import { render, fireEvent, within } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '@/pages/Login';
import { useUser } from '@/contexts/contextHooks/useUser';

jest.mock('@/contexts/contextHooks/useUser');

const mockUser = {
  userId: 'test-user-id',
  role: 'STUDENT',
  firstname: "First",
  lastname: "Name",
};

useUser.mockReturnValue({
  user: mockUser,
  userLoading: false,
});

describe('Login', () => {
  it('switches between LoginCard and RegisterCard when buttons are clicked', () => {
    const { getByText, queryByText, getByRole } = render(
            <Router>
                <Login />
            </Router>
    );

    // Initially, LoginCard should be displayed
    expect(getByText("Don't have an account?")).toBeInTheDocument();

    // Click "Sign up" button to switch to RegisterCard
    fireEvent.click(getByText('Sign up'));
    expect(queryByText("Don't have an account?")).not.toBeInTheDocument();
    expect(getByText('Already have an account?')).toBeInTheDocument();

    // Click "Log in" button to switch back to LoginCard
    // Find the paragraph with the specific text
    const paragraph = getByText(/already have an account\?/i);

    // Find the button within that paragraph
    const button = within(paragraph).getByRole('button', { name: /log in/i });
    fireEvent.click(button);
    expect(getByText("Don't have an account?")).toBeInTheDocument();
    expect(queryByText('Already have an account?')).not.toBeInTheDocument();
  });
});
