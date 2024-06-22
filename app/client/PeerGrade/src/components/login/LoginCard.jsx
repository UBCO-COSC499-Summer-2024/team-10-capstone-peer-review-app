import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { user as users } from "@/lib/dbData"; // DB CALL: this is user data being pulled from the 'db'
import { setCurrentUser } from '@/utils/redux/hooks/userSlice'; //REDUX slice
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const LoginCard = ({ onSwitchToRegister, onSwitchToForgotPassword }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [tokenReceived, setTokenReceived] = useState(false);
  const [verificationSuccessful, setVerificationSuccessful] = useState(false);
  const [error, setError] = useState('');
  const query = useQuery();
  const token = query.get('token') || '';

  useEffect(() => {
    if (token) {
      fetch(`http://localhost:5001/auth/confirm-email?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.error && data.error.status === "Error") {
          setVerificationSuccessful(false);
        } else {
          console.log(`Received token ${token} was successfully processed.`);
          setVerificationSuccessful(true);
        }
      })
      .catch((error) => {
        console.error('Verification error:', error);
        setVerificationSuccessful(false);
      });
      setTokenReceived(true);
    }
  }, [token]);

    // // Password validation regex: 8 characters, 1 uppercase, 1 lowercase, 1 special character
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // if (!passwordRegex.test(password)) {
    //   setError('Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character.');
    //   return;
    // }

    // Adding Comment

    const handleSubmit = (e) => {
      e.preventDefault();
    
      // TODO: Add a folder directory for API calls? then we can just importthe 
      // ADD ENV VARS
      // Create a fetch request to the /login endpoint
      fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.error && data.error.status === "fail") {
          setError(data.message);
        } else {
          console.log(`Logged in as: ${data.user.role}`);
          setError('');
          dispatch(setCurrentUser(data.user)); // REDUX: sets current user to state with redux dispatch call 
          navigate('/dashboard');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('An error occurred while logging in');
      });
    };

  return (
    <div className='relative space-y-5 max-w-md'>
      {tokenReceived && 
        <Alert className='absolute top-0 left-0 w-full flex justify-center items-center space-x-2' variant={verificationSuccessful ? 'success' : 'destructive'}>
          <div>
            {verificationSuccessful ? 
              <CheckCircleIcon className='h-6 w-6' />
                :
              <XCircleIcon className='h-6 w-6' />
            }
          </div>
          <div>
            <AlertDescription>
              {verificationSuccessful ? 'The email verification was successful! You can now login.' : 'The verification code either expired or was invalid. Please try again later.'}
            </AlertDescription>
          </div>
        </Alert>
      }
      <Card className="w-full p-8 space-y-8 bg-white shadow-md rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription className="text-gray-600">Please enter your credentials to login</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              <div className="absolute mt-6 inset-y-0 right-0 pr-3 flex items-center">
                <button type="button" onClick={() => setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ? <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-[#111827] border border-transparent rounded-md shadow-sm hover:bg-[#374151] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
          <p className="text-sm text-gray-600">
            <button onClick={onSwitchToForgotPassword} className="text-green-600 hover:text-green-500">Forgot your password?</button>
          </p>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? <button onClick={onSwitchToRegister} className="text-green-600 hover:text-green-500">Sign up</button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginCard;
