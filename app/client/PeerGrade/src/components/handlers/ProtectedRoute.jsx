import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/contextHooks/useUser";
import { useToast } from "@/components/ui/use-toast";

const ProtectedRoute = ({ element, allowedRoles }) => {
	const { user, userLoading } = useUser();
	const location = useLocation();
	const { toast } = useToast();

	if (userLoading) {
		return <div>Loading...</div>; // Or a more sophisticated loading component
	}

	if (!user) {
		// Redirect to login page if not authenticated
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	if (allowedRoles && !allowedRoles.includes(user.role)) {
		// Show a toast notification for unauthorized access
		// Redirect to dashboard or another appropriate page
		toast({
			title: "Unauthorized",
			description: "You are not authorized to access this page",
			variant: "destructive"
		});
		return <Navigate to="/dashboard" replace />;
	}

	// If authenticated and authorized, render the protected element
	return element;
};

export default ProtectedRoute;
