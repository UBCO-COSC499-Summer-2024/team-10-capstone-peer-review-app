import { createContext, useState, useEffect } from "react";
import { getCurrentUser, loginUser, logoutUser } from "@/api/authApi";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		setUserContext();
	}, []);

	const setUserContext = async () => {
		const data = await getCurrentUser();
		console.log("UserContext data:", data);
		setUser(data.userInfo);
		console.log(user);
	};

	const clearUserContext = () => {
		setUser(null);
	};

	return (
		<UserContext.Provider value={{ user, setUserContext, clearUserContext }}>
			{children}
		</UserContext.Provider>
	);
};
