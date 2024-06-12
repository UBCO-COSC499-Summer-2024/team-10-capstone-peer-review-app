import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginCard from '@/components/login/LoginCard';
import RegisterCard from '@/components/login/RegisterCard';

const Login = () => {
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSwitchToRegister = () => {
    setShowLogin(false);
  };

  const handleSwitchToLogin = () => {
    setShowLogin(true);
  };

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className={`transition-opacity duration-500 ${showLogin ? 'opacity-100' : 'opacity-0'}`}>
        {showLogin ? <LoginCard onSwitchToRegister={handleSwitchToRegister} /> : null}
      </div>
      <div className={`transition-opacity duration-500 ${!showLogin ? 'opacity-100' : 'opacity-0'}`}>
        {!showLogin ? <RegisterCard onSwitchToLogin={handleSwitchToLogin} /> : null}
      </div>
    </main>
  );
};

export default Login;
