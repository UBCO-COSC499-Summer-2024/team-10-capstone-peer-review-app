// The component for checking if a user is authenticated and has the required role to access a page (used in App.jsx Routes)

import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/contextHooks/useUser";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { useEffect } from "react";

const ProtectedRoute = ({ element, allowedRoles }) => {
	const { user, userLoading } = useUser();
	const navigate = useNavigate();
	const { toast } = useToast();

	// Redirect the user to the dashboard if they are not authenticated or have the wrong role
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

	// Display a loader while the user is loading
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
};

export default ProtectedRoute;
