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

import { Toaster } from "@/components/ui/toaster";

function App() {
	return (
		<Router>
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
		<main className="bg-gray-100 mx-auto">
			{!isLoginPage && <AppNavbar currentUser={currentUser} />}
			<div className="main-container flex justify-center flex-1">
				<Routes>
					<Route path="/" element={<Login />} />
					{/* All the routes that need the userContext (the global user state)*/}
					<UserProvider>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/class/:classId" element={<Class />} />
						<Route
							path="/class/createAssignment"
							element={<AssignmentCreation />}
						/>
						<Route path="/manageClass" element={<ManageClass />} />
						<Route path="/search" element={<Search />} />
						<Route path="/assignment/:assignmentId" element={<Assignment />} />
						<Route path="/assignedPR/:assignmentId" element={<AssignedPR />} />
						<Route path="/peer-review" element={<PeerReview />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="/admin" element={<AdminDashboard />} />
					</UserProvider>
				</Routes>
			</div>
			<Toaster />
		</main>
	);
}

export default App;
