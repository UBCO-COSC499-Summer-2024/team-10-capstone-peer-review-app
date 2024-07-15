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
import AssignmentCreation from "./pages/classNav/assignment/AssignmentCreation";
import Assignment from "./pages/Assignment";
import AssignedPR from "./pages/AssignedPR";
import PeerReview from "./pages/PeerReview";
import Settings from "./pages/Settings";
import AppNavbar from "./components/global/Navbar";
import ManageClass from "./pages/ManageClass";
import StudentEnrollmentRequests from "./pages/StudentEnrollmentRequests";
import Report from "./pages/Report";
import Search from "./components/admin/Search";
import Submission from "./pages/Submission";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/global/ProtectedRoute";
import ManageClassDashboard from "./components/manageClass/ManageClassDashboard";
import NotFound from "./components/global/NotFound";

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
		<main className="gradient-background min-h-screen flex">
			{!isLoginPage && <AppNavbar />}
			<div className="main-container flex-grow p-6">
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
						path="/admin"
						element={
							<ProtectedRoute
								element={<AdminDashboard />}
								allowedRoles={["ADMIN"]}
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
						path="/manageclass"
						element={
							<ProtectedRoute
								element={<ManageClass />}
								allowedRoles={["INSTRUCTOR", "ADMIN"]}
							/>
						}
					/>
					<Route
						path="/manageclass/:classId"
						element={
							<ProtectedRoute
								element={<ManageClassDashboard />}
								allowedRoles={["INSTRUCTOR", "ADMIN"]}
							/>
						}
					/>
					<Route
						path="/enrollment"
						element={
							<ProtectedRoute
								element={<StudentEnrollmentRequests />}
								allowedRoles={["STUDENT", "ADMIN"]}
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
						path="/class/:classId/submit/:assignmentId"
						element={
							<ProtectedRoute
								element={<Submission />}
								allowedRoles={["STUDENT"]}
							/>
						}
					/>
					<Route
						path="/report"
						element={
							<ProtectedRoute
								element={<Report />}
								allowedRoles={["STUDENT", "INSTRUCTOR", "ADMIN"]}
							/>
						}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>
			<Toaster />
		</main>
	);
}

export default App;
