import { createContext, useState, useEffect } from "react";
import { getCurrentUser, loginUser, logoutUser } from "@/api/authApi";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [userLoading, setUserLoading] = useState(true);

	useEffect(() => {
		setUserContext();
	}, []);

	const setUserContext = async () => {
		const userInfo = await getCurrentUser();
		setUser(userInfo);
		setUserLoading(false);
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
