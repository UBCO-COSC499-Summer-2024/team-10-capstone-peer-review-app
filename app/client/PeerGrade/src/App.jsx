import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation  } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Class from './pages/Class';
import AssignmentCreation from './pages/classNav/AssignmentCreation';
import Assignment from './pages/Assignment';
import AssignedPR from './pages/AssignedPR';
import PeerReview from './pages/PeerReview';
import Settings from './pages/Settings';
import AppNavbar from './components/global/Navbar';
import ManageClass from './pages/ManageClass';
import { Toaster } from "@/components/ui/toaster";
import AdminDashboard from './pages/AdminDashboard';
// New comment 

function App() {
	const [message, setMessage] = useState("");

	useEffect(() => {
		fetch("/api")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => setMessage(data.message))
			.catch((error) => console.error("Fetch error:", error));
	}, []);

  function MainLayout({ children }) {
    const location = useLocation();
    const isLoginPage = location.pathname === "/";
  
    return (
      <main className=" bg-gray-100 mx-auto">
        {!isLoginPage && <AppNavbar/>}
        <div className="flex justify-center flex-1">
          {children}
        </div>
        <Toaster />
      </main>
    );
  }

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/class/:classId" element={<Class />} />
          <Route path="/class/createAssignment" element={<AssignmentCreation />} />
          <Route path="/manageClass" element={<ManageClass />} />
          <Route path="/assignment/:assignmentId" element={<Assignment />} />
          <Route path="/assignedPR/:assignmentId" element={<AssignedPR />} />
          <Route path="/peer-review" element={<PeerReview />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;