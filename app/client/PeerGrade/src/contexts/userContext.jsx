import { createContext, useState, useEffect } from "react";
import { getCurrentUser, loginUser, logoutUser } from "@/api/authApi";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [contextLoading, setContentLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const data = await getCurrentUser();
				console.log("Fetched user info:", data);
				setUser(data);
			} catch (error) {
				console.log("Failed to fetch user:", error);
			} finally {
				setContentLoading(false);
			}
		};

		fetchUser();
	}, []);

	const setUserContext = async () => {
		const data = await getCurrentUser();
		setUser(data);
	};

	const clearUserContext = () => {
		setUser(null);
	};

	return (
		<UserContext.Provider
			value={{ user, contextLoading, setUserContext, clearUserContext }}
		>
			{children}
		</UserContext.Provider>
	);
};
