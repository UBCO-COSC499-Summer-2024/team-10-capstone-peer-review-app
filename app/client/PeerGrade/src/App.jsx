import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate
} from "react-router-dom";
import { UserProvider } from "./contexts/userContext";
import axios from "axios";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Class from "./pages/Class";
import AssignmentCreation from "./pages/classNav/AssignmentCreation";
import Assignment from "./pages/Assignment";
import AssignedPR from "./pages/AssignedPR";
import PeerReview from "./pages/PeerReview";
import Settings from "./pages/Settings";
import AppNavbar from "./components/global/Navbar";
import ManageClass from "./pages/ManageClass";
import Search from "./pages/Search";
import AdminDashboard from "./pages/AdminDashboard";
import TestUserContext from "./pages/TestUserContext";

import TitleUpdater from "@/utils/TitleUpdater";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <TitleUpdater />
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("/api/auth/current-user", {
          withCredentials: true
        });
        setCurrentUser(response.data.user);
        if (location.pathname === "/") {
          if (response.data.user.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }
      } catch (error) {
        if (location.pathname !== "/") {
          navigate("/");
        }
      }
    };

    fetchCurrentUser();
  }, [location, navigate]);

  const isLoginPage = location.pathname === "/";

  return (
    <main className="bg-gray-100 min-h-screen flex">
      {!isLoginPage && (
        <UserProvider>
          <AppNavbar currentUser={currentUser} />
        </UserProvider>
      )}
      <div className="main-container flex-grow p-6">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <UserProvider>
                <Dashboard />
              </UserProvider>
            }
          />
          <Route
            path="/class/:classId"
            element={
              <UserProvider>
                <Class />
              </UserProvider>
            }
          />
          <Route
            path="/class/createAssignment"
            element={
              <UserProvider>
                <AssignmentCreation />
              </UserProvider>
            }
          />
          <Route
            path="/manageClass"
            element={
              <UserProvider>
                <ManageClass />
              </UserProvider>
            }
          />
          <Route path="/search" element={<Search />} />
          <Route
            path="/assignment/:assignmentId"
            element={
              <UserProvider>
                <Assignment />
              </UserProvider>
            }
          />
          <Route
            path="/assignedPR/:assignmentId"
            element={
              <UserProvider>
                <AssignedPR />
              </UserProvider>
            }
          />
          <Route
            path="/peer-review"
            element={
              <UserProvider>
                <PeerReview />
              </UserProvider>
            }
          />
          <Route
            path="/settings"
            element={
              <UserProvider>
                <Settings />
              </UserProvider>
            }
          />
          <Route
            path="/admin"
            element={
              <UserProvider>
                <AdminDashboard />
              </UserProvider>
            }
          />
          <Route
            path="/test-user"
            element={
              <UserProvider>
                <TestUserContext />
              </UserProvider>
            }
          />
        </Routes>
      </div>
      <Toaster />
    </main>
  );
}

export default App;
