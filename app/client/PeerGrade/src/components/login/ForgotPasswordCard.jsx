import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { user as users } from "@/lib/dbData"; // DB CALL: this is user data being pulled from the 'db'

const ForgotPasswordCard = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = users.find(user => user.email === email);

    if (user) {
      setEmailSent(true);
      console.log(`User of type ${user.type} has been found.`);
      setError('');
    } else {
      setError('This e-mail does not belong to a registered user.');
    }
  };



  return (
    <Card className="w-full max-w-lg p-8 space-y-8 bg-white shadow-md rounded-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription className="text-gray-600">Please enter your e-mail to reset your password</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {emailSent && <p className="text-green-500 text-sm">An email has been sent to your email address! Please check it for a verification code and enter it below.</p>}
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
          {emailSent && 
            <div className="relative">
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">Verification Code</label>
              <input
                id="verificationCode"
                name="verificationCode"
                type="number"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                className={`block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm hide-arrows`}
              />
            </div>
          }
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-[#111827] border border-transparent rounded-md shadow-sm hover:bg-[#374151] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {emailSent ? "Submit" : "Send Reset Email"}
            </button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="text-center">
        <p className="text-sm text-gray-600">
          Don't need to reset your password? <button onClick={onSwitchToLogin} className="text-green-600 hover:text-gray-900">Log in</button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordCard;
