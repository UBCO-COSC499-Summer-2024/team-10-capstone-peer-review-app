import { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "@/api/authApi";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [userLoading, setUserLoading] = useState(false);

	useEffect(() => {
		setUserContext();
	}, []);

	const setUserContext = async () => {
		try {
			setUserLoading(true);
			const userInfo = await getCurrentUser();
			setUser(userInfo);
			setUserLoading(false);
		} catch (error) {
			console.error("Failed to fetch user", error);
		}
	};

	const clearUserContext = () => {
		setUser(null);
	};

	return (
		<UserContext.Provider
			value={{ user, userLoading, setUserContext, clearUserContext }}
		>
			{children}
		</UserContext.Provider>
	);
};
