import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { user as users } from "@/lib/dbData"; // DB CALL: this is user data being pulled from the 'db'
import { setCurrentUser } from '@/lib/redux/hooks/userSlice'; //REDUX slice
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const LoginCard = ({ onSwitchToRegister, onSwitchToForgotPassword }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // // Password validation regex: 8 characters, 1 uppercase, 1 lowercase, 1 special character
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // if (!passwordRegex.test(password)) {
    //   setError('Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character.');
    //   return;
    // }

    // DB PROCESS: Find user by email and password process stored under const user.
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
      console.log(`Logged in as: ${user.type}`);
      setError('');
      dispatch(setCurrentUser(user)); // REDUX: sets current user to state with redux dispatch call 
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Card className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg">
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
  );
};

export default LoginCard;
