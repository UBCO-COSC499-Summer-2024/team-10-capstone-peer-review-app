// getAllUsers: Fetch all users
// getUsersByRole: Fetch users by role
// isEmailVerifiedJWT: Check if email is verified
// getGroups: Fetch groups for a user
// getAllGroups: Fetch all groups
// updateProfile: Update profile for a user
// sendReportToInstructor: Send report to instructor
// sendReportToAdmin: Send report to admin
// getSentReports: Fetch sent reports
// getInstructorReports: Fetch instructor reports
// getAdminReports: Fetch admin reports
// unResolveReport: Unresolve report
// resolveReport: Resolve report
// deleteReport: Delete report
// getMyGrades: Fetch grades for the user

import axios from "axios";
import showStatusToast from "@/utils/showToastStatus";

const BASE_URL = "/api"; // TODO change this to an environment var?

export const getAllUsers = async () => {
	try {
		const response = await axios.get(`${BASE_URL}/users/all`);
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const getUsersByRole = async (role) => {
	try {
		const response = await axios.get(`${BASE_URL}/users/role/${role}`);
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const isEmailVerifiedJWT = async (email) => {
	try {
		const response = await axios.get(`${BASE_URL}/`, {
			email
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const getGroups = async (userId) => {
	try {
		const response = await axios.post(`${BASE_URL}/users/get-groups`, {
			userId
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const getAllGroups = async () => {
	try {
		const response = await axios.post(`${BASE_URL}/users/get-all-groups`);
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const updateProfile = async (userId, updateData) => {
	try {
		const response = await axios.post(`${BASE_URL}/users/update-profile`, {
			userId,
			updateData
		});
		return response.data;
	} catch (error) {
		console.log(error);
		handleError(error);
		return error.response.data;
	}
};

export const sendReportToInstructor = async (userId, title, content, instructorId) => {
	try {
		const response = await axios.post(`${BASE_URL}/users/send-report-to-instructor`, {
			title,
			content,
			instructorId
		});
		return response.data;
	} catch (error) {
		console.log(error);
		handleError(error);
		return error.response.data;
	}
};

export const sendReportToAdmin = async (userId, title, content) => {
	try {
		const response = await axios.post(`${BASE_URL}/users/send-report-to-admin`, {
			title,
			content
		});
		return response.data;
	} catch (error) {
		console.log(error);
		handleError(error);
		return error.response.data;
	}
};

export const getSentReports = async () => {
	try {
		const response = await axios.post(`${BASE_URL}/users/get-sent-reports`);
		return response.data;
	} catch (error) {
		console.log(error);
		handleError(error);
		return error.response.data;
	}
};

export const getInstructorReports = async () => {
	try {
		const response = await axios.post(`${BASE_URL}/users/get-instructor-reports`);
		return response.data;
	} catch (error) {
		console.log(error);
		handleError(error);
		return error.response.data;
	}
};

export const getAdminReports = async () => {
	try {
		const response = await axios.post(`${BASE_URL}/users/get-admin-reports`);
		return response.data;
	} catch (error) {
		console.log(error);
		handleError(error);
		return error.response.data;
	}
};

export const unResolveReport = async (reportId) => {
	try {
		const response = await axios.post(`${BASE_URL}/users/unresolve-report`, {
			reportId
		});
		return response.data;
	} catch (error) {
		console.log(error);
		handleError(error);
		return error.response.data;
	}
};

export const resolveReport = async (reportId) => {
	try {
		const response = await axios.post(`${BASE_URL}/users/resolve-report`, {
			reportId
		});
		return response.data;
	} catch (error) {
		console.log(error);
		handleError(error);
		return error.response.data;
	}
};

export const deleteReport = async (reportId) => {
	try {
		const response = await axios.post(`${BASE_URL}/users/delete-report`, {
			reportId
		});
		return response.data;
	} catch (error) {
		console.log(error);
		handleError(error);
		return error.response.data;
	}
};

export const getMyGrades = async () => {
	try {
		const response = await axios.get(`${BASE_URL}/grade/grades`);
		return response.data;
	} catch (error) {
		console.log(error);
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
