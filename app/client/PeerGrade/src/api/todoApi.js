import axios from "axios";
import showStatusToast from "@/utils/showToastStatus";

const BASE_URL = "/api"; // Use environment variable if available

export const getTodosByClassAndUser = async (classId) => {
	try {
		const response = await axios.get(`${BASE_URL}/todo/${classId}`);
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const createTodo = async (classId, content) => {
	try {
		const response = await axios.post(`${BASE_URL}/todo/${classId}`, {
			content
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const updateTodo = async (todoId, updates) => {
	try {
		const response = await axios.put(`${BASE_URL}/todo/${todoId}`, updates);
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const deleteTodo = async (todoId) => {
	try {
		const response = await axios.delete(`${BASE_URL}/todo/${todoId}`);
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
