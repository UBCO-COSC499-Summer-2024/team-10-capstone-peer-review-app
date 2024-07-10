import { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "@/api/authApi";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [userLoading, setUserLoading] = useState(false);

	const setUserContext = async () => {
		console.log("setUserContext called");
		try {
			setUserLoading(true);
			console.log("Fetching user info...");
			const userInfo = await getCurrentUser();
			console.log("User info received:", userInfo);
			if (userInfo.status === "Success") {
				console.log("Setting user:", userInfo.userInfo);
				setUser(userInfo.userInfo);
			}
		} catch (error) {
			console.error("Failed to fetch user", error);
		} finally {
			setUserLoading(false);
			console.log("Final user state:", user);
		}
	};

	const clearUserContext = () => {
		try {
			setUserLoading(true);
			setUser(null);
		} catch (error) {
			console.error("Failed to clear user", error);
		} finally {
			setUserLoading(false);
		}
	};

	// useEffect(() => {
	// 	setUserContext();
	// }, []);

	return (
		<UserContext.Provider
			value={{ user, userLoading, setUserContext, clearUserContext }}
		>
			{children}
		</UserContext.Provider>
	);
};
