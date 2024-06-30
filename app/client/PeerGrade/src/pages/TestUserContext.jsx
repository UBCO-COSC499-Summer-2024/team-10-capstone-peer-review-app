import React from "react";
import { useUser } from "@/contexts/contextHooks/useUser";

const TestUserContext = () => {
	const { user, userLoading } = useUser();

	console.log("User:", user);

	if (userLoading) {
		return (
			<div>
				<h2>Loading user information...</h2>
			</div>
		);
	}

	return (
		<div>
			<h2>User Information: Firstname: {user.firstname}</h2>
		</div>
	);
};

export default TestUserContext;
