import axios from "axios";
import showStatusToast from "@/utils/showToastStatus";

const BASE_URL = "/api"; // TODO change this to an environment var?

export const getAllUsers = async () => {
	try {
		const response = await axios.post(`${BASE_URL}/admins/all-users`);
        console.log("response", response);
		return response;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const getAllClasses = async () => {
	try {
		const response = await axios.post(`${BASE_URL}/admins/all-classes`);
        console.log("response", response);
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
		showStatusToast({
			status: "Error",
			message: "An unexpected error occurred. Please try again."
		});
	}
}
