// The component for displaying a 404 page when a user tries to access a page that doesn't exist

import { Link } from "react-router-dom";
import { useUser } from "@/contexts/contextHooks/useUser";

const NotFound = () => {
	const { user, userLoading } = useUser();

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<h1 className="text-3xl font-bold text-gray-800">404</h1>
			<p className="text-xl text-gray-600">Oops! Page not found</p>
			{user && <Link to={user.role === "ADMIN" ? "/admin" : "/dashboard"} className="text-blue-500 hover:underline">
				Go to Dashboard
			</Link>}
		</div>
	);
};

export default NotFound;
