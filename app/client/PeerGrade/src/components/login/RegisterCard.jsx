import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RegisterCard = ({ onSwitchToLogin }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Temporary logic for registration, to be replaced with actual registration logic
    console.log('Registering user');
  };

  return (
    <Card className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Register</CardTitle>
        <CardDescription className="text-gray-600">Please enter your details to create an account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}> {/* Add onSubmit handler */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name:</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name:</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700">Learning Institution Name:</label>
            <input
              id="institutionName"
              name="institutionName"
              type="text"
              required
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address:</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Re-type Password:</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className='flex justify-center'>
            <Button
              variant="success"
              type="submit"
              className="w-full"
            >
              Sign up
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account? <button onClick={onSwitchToLogin} className="text-green-600 hover:text-gray-900 hover:border-b-2">Log in</button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterCard;
