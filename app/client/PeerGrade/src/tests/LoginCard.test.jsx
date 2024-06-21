import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { setCurrentUser } from '@/utils/redux/hooks/userSlice';
import LoginCard from '@/components/login/LoginCard';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@/lib/dbData', () => ({
    user: [
      {
        user_id: 1,
        username: "testUser",
        password: "validpassword@A1",
        firstname: "Test",
        lastname: "User",
        email: "valid@example.com",
        class_id: [1,2,3,4,5,6,7,8,9,10],
        type: "admin"
      },
    ],
    addUser: jest.fn(),
    iClass: [],
  }));  

const mockStore = configureMockStore();
let store;

beforeEach(() => {
  store = mockStore({
    user: {
      // initial state
    }
  });
  jest.clearAllMocks();
});

describe('LoginCard', () => {
  beforeEach(() => {
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
  });

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
    const { getByLabelText, getByText, getByRole } = render(
      <Provider store={store}>
        <Router>
          <LoginCard />
        </Router>
      </Provider>
    );

    fireEvent.change(getByLabelText('Email address'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'wrongpasswordA@1' } });
    fireEvent.click(getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('navigates to dashboard and dispatches action when valid credentials are entered', async () => {
    const { getByLabelText, getByRole } = render(
      <Provider store={store}>
        <Router>
          <LoginCard />
        </Router>
      </Provider>
    );

    fireEvent.change(getByLabelText('Email address'), { target: { value: 'valid@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'validpassword@A1' } });
    fireEvent.click(getByRole('button', { name: 'Sign in' }));

    // Wait for any changes to the DOM that occur as a result of the form submission
    await waitFor(() => {
      // Check if the navigate function was called
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');

      // Check if the setCurrentUser action was dispatched
      const actions = store.getActions();
      expect(actions[0]).toEqual(setCurrentUser({
        class_id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        email: 'valid@example.com',
        firstname: 'Test',
        lastname: 'User',
        type: 'admin',
        user_id: 1,
        username: 'testUser',
      }));
    });
  });
});
