import axios from "axios";
import showStatusToast from "@/utils/showToastStatus";

const BASE_URL = "/api"; // TODO change this to an environment var?

export const getNotifications = async (userId) => {
	try {
		const response = await axios.post(`${BASE_URL}/notifs/get-notifications`, {
			userId
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const getNotification = async () => {
	try {
		const response = await axios.get(`${BASE_URL}/notifs/${notificationId}`);
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const updateNotification = async (notificationId, updateData) => {
	try {
		const response = await axios.put(`${BASE_URL}/notifs/${notificationId}`, {
			updateData
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const deleteNotification = async (notificationId) => {
	try {
		const response = await axios.delete(`${BASE_URL}/notifs/${notificationId}`);
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const sendNotificationToClass = async (userId, title, content, classId) => {
	try {
		const response = await axios.post(`${BASE_URL}/notifs/send-to-class`, {
			userId, title, content, classId
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const sendNotificationToGroup = async (userId, title, content, groupId) => {
	try {
		const response = await axios.post(`${BASE_URL}/notifs/send-to-group`, {
			userId, title, content, groupId
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const sendNotificationToRole = async (userId, title, content, role) => {
	try {
		const response = await axios.post(`${BASE_URL}/notifs/send-to-role`, {
			userId, title, content, role
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const sendNotificationToAll = async (userId, title, content) => {
	try {
		const response = await axios.post(`${BASE_URL}/notifs/send-to-all`, {
			userId, title, content
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
