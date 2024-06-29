import axios from "axios";

const BASE_URL = "/api"; // TODO change this to an environment var?

export const getCurrentUser = async () => {
	const response = await axios.get("/api/auth/current-user", {
		withCredentials: true
	});
	return response.data.userInfo;
};

export const registerUser = async (userDetails) => {
	const response = await axios.post(`${BASE_URL}/auth/register`, userDetails);
	return response.data;
};

export const loginUser = async (email, password) => {
	const response = await axios.post(`${BASE_URL}/auth/login`, {
		email,
		password
	});
	return response.data;
};
export const logoutUser = async () => {
	const response = await axios.post(`${BASE_URL}/auth/logout`);
	return response.data;
};

export const resendVerificationEmail = async (email) => {
	const response = await axios.post(`${BASE_URL}/auth/resend-verification`, {
		email
	});
	return response.data;
};

export const confirmEmail = async (token) => {
	const response = await axios.post(`${BASE_URL}/auth/confirm-email`, {
		token
	});
	return response.data;
};

export const sendForgotPasswordEmail = async (email) => {
	const response = await axios.post(`${BASE_URL}/auth/forgot-password`, {
		email
	});
	return response.data;
};

export const resetPassword = async (token, newPassword) => {
	const response = await axios.post(`${BASE_URL}/auth/reset-password`, {
		token,
		newPassword
	});
	return response.data;
};

// Add more functions as needed for other authentication-related actions
