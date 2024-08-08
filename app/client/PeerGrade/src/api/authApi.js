// This code provides a set of API functions to handle user authentication and role management functionalities. 
// The functionalities include:

// 1. getCurrentUser: Retrieves the current authenticated user's details.
// 2. registerUser: Registers a new user with the provided details.
// 3. loginUser: Logs in a user with the given email and password.
// 4. logoutUser: Logs out the current user.
// 5. resendVerificationEmail: Resends the email verification link to the user's email.
// 6. confirmEmail: Confirms the user's email using a token.
// 7. isEmailVerifiedJWT: Checks if the email is verified using a JWT token.
// 8. sendForgotPasswordEmail: Sends a forgot password email to the user's email.
// 9. resetPassword: Resets the user's password using a token and new password.
// 10. getAllRoleRequests: Retrieves all role requests.
// 11. deleteRoleRequest: Deletes a role request by ID.
// 12. approveRoleRequest: Approves a role request by ID.
// 13. denyRoleRequest: Denies a role request by ID.
// 14. pendRoleRequest: Marks a role request as pending by ID.
// 15. updateRoleRequestStatus: Updates the status of a role request by ID.
// 16. applyForNewRoleRequest: Applies for a new role request with the provided details.

// The handleError function is used to handle errors and display appropriate status messages.


import axios from "axios";
import showStatusToast from "@/utils/showToastStatus";

const BASE_URL = "/api"; // TODO change this to an environment var?

export const getCurrentUser = async () => {
	try {
		const response = await axios.get(`${BASE_URL}/auth/current-user`, {
			withCredentials: true
		});
		return response.data;
	} catch (error) {
		// Find a way to handle the error of the session not existing but only when a user is redirected to the login page
		// Its useless to show an error toast when the user refreshes to the login page
		return error.response.data;
	}
};

export const registerUser = async (userDetails) => {
	try {
		const response = await axios.post(`${BASE_URL}/auth/register`, userDetails);
		showStatusToast({
			status: response.data.status,
			message: response.data.message
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const loginUser = async (email, password) => {
	try {
		const response = await axios.post(`${BASE_URL}/auth/login`, {
			email,
			password
		});
		showStatusToast({
			status: response.data.status,
			message: response.data.message
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const logoutUser = async () => {
	try {
		const response = await axios.post(`${BASE_URL}/auth/logout`);
		showStatusToast({
			status: response.data.status,
			message: response.data.message
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const resendVerificationEmail = async (email) => {
	try {
		const response = await axios.post(`${BASE_URL}/auth/resend-verification`, {
			email
		});
		showStatusToast({
			status: response.data.status,
			message: response.data.message
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const confirmEmail = async (token) => {
	try {
		const response = await axios.post(`${BASE_URL}/auth/confirm-email`, {
			token
		});
		showStatusToast({
			status: response.data.status,
			message: response.data.message
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const isEmailVerifiedJWT = async (token) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/auth/is-email-verified-jwt`,
			{
				token
			}
		);
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const sendForgotPasswordEmail = async (email) => {
	try {
		const response = await axios.post(`${BASE_URL}/auth/forgot-password`, {
			email
		});
		showStatusToast({
			status: response.data.status,
			message: response.data.message
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const resetPassword = async (token, newPassword) => {
	try {
		const response = await axios.post(`${BASE_URL}/auth/reset-password`, {
			token,
			newPassword
		});
		showStatusToast({
			status: response.data.status,
			message: response.data.message
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const getAllRoleRequests = async () => {
	try {
		const response = await axios.get(`${BASE_URL}/auth/role-request`, {
			withCredentials: true
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const deleteRoleRequest = async (roleRequestId) => {
	try {
		const response = await axios.delete(
			`${BASE_URL}/auth/role-request/${roleRequestId}`,
			{
				withCredentials: true
			}
		);
		showStatusToast({
			status: response.data.status,
			message: response.data.message
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const approveRoleRequest = async (roleRequestId) => {
	try {
		// should change to a patch
		const response = await axios.post(
			`${BASE_URL}/auth/role-request/approve/${roleRequestId}`,
			{},
			{
				withCredentials: true
			}
		);
		showStatusToast({
			status: response.data.status,
			message: response.data.message
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const denyRoleRequest = async (roleRequestId) => {
	try {
		// should change to a patch
		const response = await axios.post(
			`${BASE_URL}/auth/role-request/deny/${roleRequestId}`,
			{},
			{
				withCredentials: true
			}
		);
		showStatusToast({
			status: response.data.status,
			message: response.data.message
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const pendRoleRequest = async (roleRequestId) => {
	try {
		// should change to a patch
		const response = await axios.post(
			`${BASE_URL}/auth/role-request/pending/${roleRequestId}`,
			{},
			{
				withCredentials: true
			}
		);
		showStatusToast({
			status: response.data.status,
			message: response.data.message
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const updateRoleRequestStatus = async (roleRequestId, status) => {
	try {
		const response = await axios.put(
			`${BASE_URL}/auth/role-request/${roleRequestId}`,
			{ status },
			{
				withCredentials: true
			}
		);
		showStatusToast({
			status: response.data.status,
			message: response.data.message
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const applyForNewRoleRequest = async (requestDetails) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/auth/role-request`,
			requestDetails,
			{
				withCredentials: true
			}
		);
		showStatusToast({
			status: response.data.status,
			message: response.data.message
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

function handleError(error) {
	if (error.response && error.response.data) {
		showStatusToast({
			status: error.response.data.status,
			message: error.response.data.message
		});
	} else {
		console.log("Unexpected error from Auth API: ", error);
		showStatusToast({
			status: "Error",
			message: "An unexpected error occurred. Please try again."
		});
	}
}
