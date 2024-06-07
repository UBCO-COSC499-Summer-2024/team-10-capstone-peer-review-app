import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

  return (
    <main className="App">
      <h1>{message}</h1>
      <Router>
        <AppNavbar/>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/peer-review" element={<PeerReview />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
    </Router>
    </main>
  );
}

export default App;
