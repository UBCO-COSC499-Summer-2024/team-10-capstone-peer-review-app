import axios from "axios";
import showStatusToast from "@/utils/showToastStatus";

const BASE_URL = "/api";

const handleError = (error) => {
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
};

export const getRubricsForAssignment = async (assignmentId) => {
	try {
		const response = await axios.post(`${BASE_URL}/rubric/get-rubrics`, {
			assignmentId
		});
		return response.data;
	} catch (error) {
		handleError(error);
		throw error;
	}
};

export const getAllRubrics = async () => {
	try {
		const response = await axios.post(`${BASE_URL}/rubric/get-all-rubrics`);
		return response.data;
	} catch (error) {
		handleError(error);
		throw error;
	}
};

export const getAllRubricsInClass = async (classId) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/rubric/get-rubrics-in-class`,
			{ classId }
		);
		return response.data;
	} catch (error) {
		handleError(error);
		throw error;
	}
};

export const getRubricById = async (rubricId) => {
	try {
		const response = await axios.post(`${BASE_URL}/rubric/get-rubric-by-id`, {
			rubricId
		});
		return response.data;
	} catch (error) {
		handleError(error);
		throw error;
	}
};

export const addRubricToAssignment = async (data) => {
	try {
		const response = await axios.post(`${BASE_URL}/rubric/add-rubrics`, data);
		showStatusToast({
			status: "Success",
			message: "Rubric added successfully"
		});
		return response.data;
	} catch (error) {
		handleError(error);
		throw error;
	}
};

export const deleteRubricsFromAssignment = async (rubricId) => {
	try {
		const response = await axios.post(`${BASE_URL}/rubric/remove-rubric`, {
			rubricId
		});
		showStatusToast({
			status: "Success",
			message: "Rubric removed successfully"
		});
		return response.data;
	} catch (error) {
		handleError(error);
		throw error;
	}
};

export const updateRubricsForAssignment = async (rubricId, updateData) => {
	try {
		const response = await axios.post(`${BASE_URL}/rubric/update-rubrics`, {
			rubricId,
			updateData
		});
		showStatusToast({
			status: "Success",
			message: "Rubric updated successfully"
		});
		return response.data;
	} catch (error) {
		handleError(error);
		throw error;
	}
};

export const linkRubricToAssignment = async (rubricId, assignmentIds) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/rubric/link-rubric-to-assignment`,
			{ rubricId, assignmentIds }
		);
		//   showStatusToast({
		//     status: "Success",
		//     message: "Rubric linked to assignments successfully"
		//   });
		return response.data;
	} catch (error) {
		handleError(error);
		throw error;
	}
};
