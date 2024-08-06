import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/contextHooks/useUser";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { useEffect } from "react";

const ProtectedRoute = ({ element, allowedRoles }) => {
	const { user, userLoading } = useUser();
	const navigate = useNavigate();
	const { toast } = useToast();

	useEffect(() => {
		if (!userLoading && user) {
			if (!allowedRoles.includes(user.role)) {
				navigate("/dashboard", { replace: true });
				toast({
					title: "Unauthorized",
					description: "You are not authorized to access this page",
					variant: "destructive"
				});
			}
		}
	}, [user, userLoading]);

	if (userLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loader className="w-16 h-16 animate-spin text-stone-800" data-testid="loader" />
			</div>
		);
	}

	if (user && allowedRoles.includes(user.role)) {
		return element;
	}

	return null;

	// If the user is not authenticated / logged in, redirect them to the login page

	// If the user has been authenticated but is in the login page, redirect them to the dashboard
	// Have the check valid session here

	// If the user is authenticated and has the required role, render the element
};

export default ProtectedRoute;
