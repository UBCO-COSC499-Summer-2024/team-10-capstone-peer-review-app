// src/components/AuthHandler.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/contextHooks/useUser";

const AuthHandler = () => {
	const { user, userLoading } = useUser();
	const navigate = useNavigate();
	const location = useLocation();

	// On inital mount, check if the user is logged in as if they are set their context
	// useEffect(() => {
	// 	const checkValidSession = async () => {
	// 		console.log("Checking valid session");
	// 		if (!user && !userLoading) {
	// 			console.log("No user, setting user context");
	// 			await setUserContext();
	// 		}
	// 	};
	// 	checkValidSession();
	// }, []);

	// If the user object changes at all, if the user
	useEffect(() => {
		if (!userLoading && user) {
			if (location.pathname === "/") {
				// TODO change to dashboard wrapper component
				navigate(user.role === "ADMIN" ? "/admin" : "/dashboard", {
					replace: true
				});
			}
		}
	}, [user, userLoading, navigate, location]);

	return null; // This component doesn't render anything, soley handles the usercontext and
};

export default AuthHandler;
