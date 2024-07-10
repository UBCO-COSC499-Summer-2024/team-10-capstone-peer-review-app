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
import AppNavbar from "./components/login/global/Navbar";
import ManageClass from "./pages/ManageClass";
import Search from "./pages/Search";
import AdminDashboard from "./pages/AdminDashboard";
import TestUserContext from "./pages/TestUserContext";
import NotFound from "./components/login/global/NotFound";
import ProtectedRoute from "./components/handlers/ProtectedRoute";
import AuthHandler from "./components/handlers/authHandler";

import TitleUpdater from "@/utils/TitleUpdater";
import { Toaster } from "@/components/ui/toaster";

function App() {
	return (
		<Router>
			<TitleUpdater />
			<UserProvider>
				<ClassProvider>
					<AuthHandler />
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
		<main className="bg-gray-100 mx-auto">
			{!isLoginPage && <AppNavbar />}
			<div className="main-container flex justify-center flex-1">
				<Routes>
					<Route path="/" element={<Login />} />
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute
								element={<Dashboard />}
								allowedRoles={["STUDENT", "INSTRUCTOR", "ADMIN"]}
							/>
						}
					/>
					<Route
						path="/class/:classId"
						element={
							<ProtectedRoute
								element={<Class />}
								allowedRoles={["STUDENT", "INSTRUCTOR", "ADMIN"]}
							/>
						}
					/>
					<Route
						path="/class/:classId/edit"
						element={
							<ProtectedRoute
								element={<EditClass />}
								allowedRoles={["INSTRUCTOR", "ADMIN"]}
							/>
						}
					/>
					<Route
						path="/class/createAssignment"
						element={
							<ProtectedRoute
								element={<AssignmentCreation />}
								allowedRoles={["INSTRUCTOR", "ADMIN"]}
							/>
						}
					/>
					<Route
						path="/manageClass"
						element={
							<ProtectedRoute
								element={<ManageClass />}
								allowedRoles={["INSTRUCTOR", "ADMIN"]}
							/>
						}
					/>
					<Route
						path="/search"
						element={
							<ProtectedRoute element={<Search />} allowedRoles={["ADMIN"]} />
						}
					/>
					<Route
						path="/class/:classId/assignment/:assignmentId"
						element={
							<ProtectedRoute
								element={<Assignment />}
								allowedRoles={["STUDENT", "INSTRUCTOR", "ADMIN"]}
							/>
						}
					/>
					<Route
						path="/assignedPR/:assignmentId"
						element={
							<ProtectedRoute
								element={<AssignedPR />}
								allowedRoles={["STUDENT", "INSTRUCTOR", "ADMIN"]}
							/>
						}
					/>
					<Route
						path="/peer-review"
						element={
							<ProtectedRoute
								element={<PeerReview />}
								allowedRoles={["STUDENT", "INSTRUCTOR", "ADMIN"]}
							/>
						}
					/>
					<Route
						path="/settings"
						element={
							<ProtectedRoute
								element={<Settings />}
								allowedRoles={["STUDENT", "INSTRUCTOR", "ADMIN"]}
							/>
						}
					/>
					<Route
						path="/admin"
						element={
							<ProtectedRoute
								element={<AdminDashboard />}
								allowedRoles={["ADMIN"]}
							/>
						}
					/>
					<Route
						path="/test-user"
						element={
							<ProtectedRoute
								element={<TestUserContext />}
								allowedRoles={["ADMIN"]}
							/>
						}
					/>
					<Route
						path="*"
						element={
							<ProtectedRoute
								element={<NotFound />}
								allowedRoles={["STUDENT", "INSTRUCTOR", "ADMIN"]}
							/>
						}
					/>
				</Routes>
			</div>
			<Toaster />
		</main>
	);
}

export default App;
