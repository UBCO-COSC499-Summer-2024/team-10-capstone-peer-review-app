import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation
} from "react-router-dom";
import { UserProvider } from "./contexts/userContext";
import { ClassProvider } from "./contexts/classContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Class from "./pages/Class";
import EditClass from "./pages/classNav/EditClass";
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
			<UserProvider>
				<ClassProvider>
					<TitleUpdater />
					<MainLayout />
				</ClassProvider>
			</UserProvider>
		</Router>
	);
}

function MainLayout() {
	const location = useLocation();

	// May need to change this? Idk if this is necessary of the best way to do redirects

  const isLoginPage = location.pathname === "/";

	return (
    <main className="gradient-background  min-h-screen flex">
			{!isLoginPage && <AppNavbar />}
			<div className="main-container  flex-grow p-6">
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/class/:classId" element={<Class />} />
					<Route path="/class/:classId/edit" element={<EditClass />} />
					<Route
						path="/class/createAssignment"
						element={<AssignmentCreation />}
					/>
					<Route path="/manageClass" element={<ManageClass />} />
					<Route path="/search" element={<Search />} />
					<Route
						path="/class/:classId/assignment/:assignmentId"
						element={<Assignment />}
					/>
					<Route path="/assignedPR/:assignmentId" element={<AssignedPR />} />
					<Route path="/peer-review" element={<PeerReview />} />
					<Route path="/settings" element={<Settings />} />
					<Route path="/admin" element={<AdminDashboard />} />
					<Route path="/test-user" element={<TestUserContext />} />
				</Routes>
			</div>
			<Toaster />
		</main>
	);
}

export default App;
