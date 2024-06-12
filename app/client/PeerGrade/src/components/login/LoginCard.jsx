import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { user as users } from "@/lib/dbData";
import { setCurrentUser } from '@/lib/redux/hooks/userSlice';
import logo from '@/assets/logo-no-background.svg'; 

const LoginCard = ({ onSwitchToRegister }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Find user by email and password
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
      console.log(`Logged in as: ${user.type}`);
      setError('');
      dispatch(setCurrentUser(user)); // Dispatch the action to set the current user
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Card className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg">
      <CardHeader className="text-center">
      <CardTitle className="text-2xl font-bold">
          <img src={logo} alt="App Logo" className="mx-auto h-full" />
        </CardTitle>
      </CardHeader>
      <CardContent className="">
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
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
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
      </CardContent>
      <CardFooter className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account? <button onClick={onSwitchToRegister} className="text-green-600 hover:text-green-500 hover:border-b-2">Sign up</button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
