import { Link } from "react-router-dom";

const NotFound = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<h1 className="text-3xl font-bold text-gray-800">404</h1>
			<p className="text-xl text-gray-600">Oops! Page not found</p>
			<Link to="/dashboard" className="text-blue-500 hover:underline">
				Go to Dashboard
			</Link>
		</div>
	);
};

export default NotFound;
