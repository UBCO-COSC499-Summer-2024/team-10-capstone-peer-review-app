import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';
import LoginCard from '@/components/login/LoginCard';
import store from '@/utils/redux/store';

fetchMock.enableMocks();

describe('LoginCard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });  

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <Router>
          <LoginCard />
        </Router>
      </Provider>
    );
  });

  it('handles input changes', async () => {
    const { getByLabelText } = render(
      <Provider store={store}>
        <Router>
          <LoginCard />
        </Router>
      </Provider>
    );

    const emailInput = getByLabelText('Email address');
    const passwordInput = getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    await waitFor(() => {
      expect(emailInput.value).toBe('test@example.com');
      expect(passwordInput.value).toBe('password');
    });
  });

  it('shows error when non-existent user tries to login', async () => {
    // Mock the fetch call
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error: { status: 'Error', message: 'No user with that email' } }),
      })
    );

    const { getByLabelText, getByText, findByText } = render(
      <Provider store={store}>
        <Router>
          <LoginCard />
        </Router>
      </Provider>
    );

    const emailInput = getByLabelText('Email address');
    const passwordInput = getByLabelText('Password');
    const submitButton = getByText('Sign in');

    // Enter invalid email and password
    fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    // Wait for the async validation and error message to appear
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled(); // Ensure fetch was called
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'password',
        }),
      });
    });
    const errorMessage = await findByText('No user with that email');
    expect(errorMessage).toBeInTheDocument();
  });
  
});
