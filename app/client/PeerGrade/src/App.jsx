import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation  } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import PeerReview from './pages/PeerReview';
import Settings from './pages/Settings';
import AppNavbar from './components/Navbar';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setMessage(data.message))
      .catch(error => console.error('Fetch error:', error));
  }, []);

  function MainLayout({ children }) {
    const location = useLocation();
    const isLoginPage = location.pathname === "/";
  
    return (
      <main className="flex items-center bg-gray-100 justify-center flex-col">
        {!isLoginPage && <AppNavbar/>}
        <div className="flex justify-center flex-1">
          {children}
        </div>
      </main>
    );
  }

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/peer-review" element={<PeerReview />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}


export default App;
