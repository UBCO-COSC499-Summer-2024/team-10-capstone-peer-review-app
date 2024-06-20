import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginCard from '@/components/login/LoginCard';
import ForgotPasswordCard from '@/components/login/ForgotPasswordCard';
import RegisterCard from '@/components/login/RegisterCard';

const Login = () => {
  const [currentTab, setCurrentTab] = useState('login');

  return (
    <main className="flex items-center justify-center min-h-screen ">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-[500px]">
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
      </Tabs>
    </main>
  );
};

export default Login;
