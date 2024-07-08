import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginCard from '@/components/login/LoginCard';
import ForgotPasswordCard from '@/components/login/ForgotPasswordCard';
import RegisterCard from '@/components/login/RegisterCard';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Login = () => {
  const [currentTab, setCurrentTab] = useState('login');
  const query = useQuery();
  const frgtToken = query.get('frgtToken') || '';
  const [tokenReceived, setTokenReceived] = useState(false);

  useEffect(() => {
    if (frgtToken) {
      setCurrentTab('forgotPassword');
    }
  }, [frgtToken]);

  return (
    <main className="flex items-center justify-center min-h-screen ">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginCard onSwitchToRegister={() => setCurrentTab('register')} onSwitchToForgotPassword={() => setCurrentTab('forgotPassword')} />
        </TabsContent>
        <TabsContent value="register">
          <RegisterCard onSwitchToLogin={() => setCurrentTab('login')} />
        </TabsContent>
        <TabsContent value="forgotPassword">
          <ForgotPasswordCard onSwitchToLogin={() => setCurrentTab('login')} />
          </TabsContent>
      </Tabs>
    </main>
  );
};

export default Login;
