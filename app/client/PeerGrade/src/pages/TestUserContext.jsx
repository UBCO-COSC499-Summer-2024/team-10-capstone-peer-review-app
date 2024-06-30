import React from "react";
import { useUser } from "@/contexts/contextHooks/useUser";

const TestUserContext = () => {
	const { user, contextLoading } = useUser();

	console.log("User:", user);
	return (
		<div>
			{user ? (
				<h2>User Information: Firstname: {user.firstname}</h2>
			) : (
				<h2>Loading user information...</h2>
			)}
		</div>
	);
};

export default TestUserContext;
