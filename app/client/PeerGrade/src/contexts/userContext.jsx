import { createContext, useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "@/api/authApi";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [userLoading, setUserLoading] = useState(false);

	// If the user state changes, update the local storage with the new user object or remove the user from local storage

	// TODO: sync session with this content being storaed in local storage, once session expires, remove the user from local storage

	useEffect(() => {
		console.log("Setting User on inital Mount");
		setUserContext();
	}, []);

	useEffect(() => {
		if (!user) {
			console.log("User does not exist yet");
		}
	}, [user]);

	const setUserContext = async () => {
		try {
			setUserLoading(true);
			const userInfo = await getCurrentUser();
			if (userInfo.status === "Success") {
				setUser(userInfo.userInfo);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setUserLoading(false);
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
