import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { setCurrentUser } from '@/lib/redux/hooks/userSlice';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

const LoginCard = ({ onSwitchToRegister, onSwitchToForgotPassword }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
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
      if (data.message) {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome", description: "You have successfully logged in!", variant: "positive" });
        dispatch(setCurrentUser(data));
        navigate('/dashboard');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      toast({ title: "Error", description: "An error occurred while logging in", variant: "destructive" });
    });
  };

  return (
    <>
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
                className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <div className="absolute mt-6 inset-y-0 right-0 pr-3 flex items-center">
                <button type="button" onClick={() => setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ? <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
            </div>
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
      <Toaster />
    </>
  );
};

export default LoginCard;
