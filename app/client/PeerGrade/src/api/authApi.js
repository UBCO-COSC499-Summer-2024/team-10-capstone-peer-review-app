import axios from "axios";
import showStatusToast from "@/utils/showToastStatus";

const BASE_URL = "/api"; // TODO change this to an environment var?

export const getCurrentUser = async () => {
	try {
		const response = await axios.get(`${BASE_URL}/auth/current-user`, {
			withCredentials: true
		});
		return response.data.userInfo;
	} catch (error) {
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

export const applyForNewRoleRequest = async (roleRequest) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/auth/role-request`,
			roleRequest,
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
