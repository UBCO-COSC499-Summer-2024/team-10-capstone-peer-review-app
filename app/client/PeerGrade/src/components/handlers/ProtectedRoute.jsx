import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/contextHooks/useUser";
import { useToast } from "@/components/ui/use-toast";

const ProtectedRoute = ({ element, allowedRoles }) => {
	const { user, userLoading } = useUser();
	const navigate = useNavigate();
	const { toast } = useToast();

	if (userLoading) {
		return <div>Loading...</div>; // Or a more sophisticated loading component
	}

	if (!user) {
		// Redirect to login page if not authenticated
		navigate("/", { replace: true });
	}

	if (user && (!allowedRoles || allowedRoles.includes(user.role))) {
		return element;
	} else if (user && allowedRoles && !allowedRoles.includes(user.role)) {
		navigate("/dashboard", {
			replace: true
		});
		toast({
			title: "Unauthorized",
			description: "You are not authorized to access this page",
			variant: "destructive"
		});
	}
};

export default ProtectedRoute;
