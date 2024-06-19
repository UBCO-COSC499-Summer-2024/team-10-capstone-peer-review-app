import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { setCurrentUser } from '@/lib/redux/hooks/userSlice';
import ForgotPasswordCard from '@/components/login/ForgotPasswordCard';

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


describe('ForgotPasswordCard', () => {
  const mockStore = configureMockStore();
  let store;
  
  beforeEach(() => {
    store = mockStore({
        user: {
          // initial state
        }
      });
  });

  test('renders without crashing', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Router>
          <ForgotPasswordCard />
        </Router>
      </Provider>
    );
    expect(getByText('Reset Password')).toBeInTheDocument();
  });

  test('shows error message when invalid credentials are entered', () => {
    const { getByLabelText, getByText, getByRole } = render(
      <Provider store={store}>
        <Router>
          <ForgotPasswordCard />
        </Router>
      </Provider>
    );

    fireEvent.change(getByLabelText('Email address'), { target: { value: 'wrong@example.com' } });
    fireEvent.click(getByRole('button', { name: 'Send Reset Email' }));

    expect(getByText('This e-mail does not belong to a registered user.')).toBeInTheDocument();
  });

  test('switches to verification code screen', async () => {
    const { getByLabelText, getByRole, getByText } = render(
        <Provider store={store}>
        <Router>
            <ForgotPasswordCard />
        </Router>
        </Provider>
    );

    fireEvent.change(getByLabelText('Email address'), { target: { value: 'valid@example.com' } });
    fireEvent.click(getByRole('button', { name: 'Send Reset Email' }));

    expect(getByText('An email has been sent to your email address! Please check it for a verification code and enter it below.')).toBeInTheDocument();
    expect(getByText('Submit')).toBeInTheDocument();
  });
});
