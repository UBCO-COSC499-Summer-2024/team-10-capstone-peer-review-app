import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';
import LoginCard from '@/components/login/LoginCard';
import store from '@/utils/redux/store';

fetchMock.enableMocks();

describe('LoginCard', () => {

  test('renders without crashing', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Router>
          <LoginCard />
        </Router>
      </Provider>
    );
    expect(getByText('Login')).toBeInTheDocument();
  });

  test('shows error message when invalid credentials are entered', async () => {
    global.fetch = jest.fn((url, options) => {
      if (JSON.parse(options.body).email === 'valid@example.com' && JSON.parse(options.body).password === 'validpassword@A1') {
        return Promise.resolve({
          json: () => Promise.resolve({
            class_id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            email: 'valid@example.com',
            firstname: 'Test',
            lastname: 'User',
            type: 'admin',
            user_id: 1,
            username: 'testUser',
          })
        });
      } else {
        return Promise.resolve({
          json: () => Promise.resolve({
            message: 'Invalid credentials'
          })
        });
      }
    });

    const { getByLabelText, getByText, getByRole } = render(
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

  test('navigates to dashboard and dispatches action when valid credentials are entered', async () => {
    global.fetch = jest.fn((url, options) => {
      if (JSON.parse(options.body).email === 'valid@example.com' && JSON.parse(options.body).password === 'validpassword@A1') {
        return Promise.resolve({
          json: () => Promise.resolve({
            class_id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            email: 'valid@example.com',
            firstname: 'Test',
            lastname: 'User',
            type: 'admin',
            user_id: 1,
            username: 'testUser',
          })
        });
      } else {
        return Promise.resolve({
          json: () => Promise.resolve({
            message: 'Invalid credentials'
          })
        });
      }
    });
    
    const { getByLabelText, getByRole } = render(

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
