import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/contextHooks/useUser";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

const ProtectedRoute = ({ element, allowedRoles }) => {
	const { user, userLoading } = useUser();
	const navigate = useNavigate();
	const { toast } = useToast();

	if (userLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loader className="w-16 h-16 animate-spin text-blue-500" />
			</div>
		);
	}

	// If the user is not authenticated / logged in, redirect them to the login page
	if (!user) {
		navigate("/", { replace: true });
		toast({
			title: "Session expired",
			description: "Your session has expired, please login again"
		});
	}

	// If the user has been authenticated but is in the login page, redirect them to the dashboard
	// Have the check valid session here

	// If the user is authenticated and has the required role, render the element
	if (user && allowedRoles.includes(user.role)) {
		return element;
	} else if (user && !allowedRoles.includes(user.role)) {
		navigate("/dashboard", {});
		toast({
			title: "Unauthorized",
			description: "You are not authorized to access this page",
			variant: "destructive"
		});
	}
};

export default ProtectedRoute;
