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
		handleError(error);
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
	}
};

function handleError(error) {
	if (error.response && error.response.data) {
		showStatusToast({
			status: error.response.data.status,
			message: error.response.data.message
		});
		return error.response.data;
	} else {
		showStatusToast({
			status: "Error",
			message: "An unexpected error occurred. Please try again."
		});
	}
}
