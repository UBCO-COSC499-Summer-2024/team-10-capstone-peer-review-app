import axios from "axios";
import showStatusToast from "@/utils/showToastStatus";

const BASE_URL = "/api"; // Use environment variable if available

// Create a new enrollment request (for students)
export const createEnrollRequest = async (classId, senderMessage) => {
	try {
		const response = await axios.post("/api/enroll-request", {
			classId,
			senderMessage
		});
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

// Get all enrollment requests for a user (for students)
export const getEnrollRequestsForUser = async () => {
	try {
		const response = await axios.get("/api/enroll-request/user");
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

// Delete an enrollment request (for students)
export const deleteEnrollRequest = async (enrollRequestId) => {
	try {
		const response = await axios.delete(
			`/api/enroll-request/${enrollRequestId}`
		);
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

// Get all enrollment requests for a class (for instructors)
export const getEnrollRequestsForClass = async (classId) => {
	try {
		const response = await axios.get(`/api/enroll-request/class/${classId}`);
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

// Update the status of an enrollment request (for instructors)
export const updateEnrollRequestStatus = async (
	enrollRequestId,
	status,
	receiverMessage
) => {
	try {
		const response = await axios.put(`/api/enroll-request/${enrollRequestId}`, {
			status,
			receiverMessage
		});
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

// Get all enrollment requests (for admins)
export const getAllEnrollRequests = async () => {
	try {
		const response = await axios.get("/api/enroll-request");
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};
