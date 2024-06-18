import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginCard from '@/components/login/LoginCard';
import ForgotPasswordCard from '@/components/login/ForgotPasswordCard';
import RegisterCard from '@/components/login/RegisterCard';

const Login = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowResetPassword(false);
  };

  const handleSwitchToLogin = () => {
    setShowLogin(true);
    setShowResetPassword(false);
  };
  
  const handleSwitchToForgotPassword = () => {
    setShowLogin(false);
    setShowResetPassword(true);
  };

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className={`transition-opacity duration-500 ${showLogin ? 'opacity-100' : 'opacity-0 w-0 h-0'}`}>
        {showLogin ? <LoginCard onSwitchToRegister={handleSwitchToRegister} onSwitchToForgotPassword={handleSwitchToForgotPassword}/> : null}
      </div>
      <div className={`transition-opacity duration-500 ${(!showLogin && !showResetPassword) ? 'opacity-100' : 'opacity-0 w-0 h-0'}`}>
        {!showLogin ? <RegisterCard onSwitchToLogin={handleSwitchToLogin} /> : null}
      </div>
      <div className={`transition-opacity duration-500 ${(!showLogin && showResetPassword) ? 'opacity-100' : 'opacity-0 w-0 h-0'}`}>
        {!showLogin ? <ForgotPasswordCard onSwitchToLogin={handleSwitchToLogin} /> : null}
      </div>
    </main>
  );
};

export default Login;
