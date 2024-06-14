import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/lib/redux/store';
import Login from '@/pages/Login';

describe('Login', () => {
  it('switches between LoginCard and RegisterCard when buttons are clicked', () => {
    const { getByText, queryByText } = render(
        <Provider store={store}>
            <Router>
                <Login />
            </Router>
        </Provider>
    );

    // Initially, LoginCard should be displayed
    expect(getByText("Don't have an account?")).toBeInTheDocument();

    // Click "Sign up" button to switch to RegisterCard
    fireEvent.click(getByText('Sign up'));
    expect(queryByText("Don't have an account?")).not.toBeInTheDocument();
    expect(getByText('Already have an account?')).toBeInTheDocument();

    // Click "Log in" button to switch back to LoginCard
    fireEvent.click(getByText('Log in'));
    expect(getByText("Don't have an account?")).toBeInTheDocument();
    expect(queryByText('Already have an account?')).not.toBeInTheDocument();
  });
});
