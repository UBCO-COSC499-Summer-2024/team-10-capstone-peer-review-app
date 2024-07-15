import axios from "axios";
import showStatusToast from "@/utils/showToastStatus";

const BASE_URL = "/api"; // Use environment variable if available

// Create a new enrollment request (for students)
export const createEnrollRequest = async (classId, senderMessage) => {
	try {
		const response = await axios.post("/api/enroll-requests", {
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
		const response = await axios.get("/api/enroll-requests/user");
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

// Delete an enrollment request (for students)
export const deleteEnrollRequest = async (enrollRequestId, userId) => {
	try {
		const response = await axios.delete(
			`/api/enroll-requests/${enrollRequestId}`,
			data: {
				userId
			}
		);
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

// Get all enrollment requests for a class (for instructors)
export const getEnrollRequestsForClass = async (classId) => {
	try {
		const response = await axios.get(`/api/enroll-requests/class/${classId}`);
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
		const response = await axios.put(
			`/api/enroll-requests/${enrollRequestId}`,
			{
				status,
				receiverMessage
			}
		);
		return response.data;
	} catch (error) {
		handleError(error);
		throw error.response.data;
	}
};

// Get all enrollment requests (for admins)
export const getAllEnrollRequests = async () => {
	try {
		const response = await axios.get("/api/enroll-requests");
		return response.data;
	} catch (error) {
		throw error.response.data;
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
