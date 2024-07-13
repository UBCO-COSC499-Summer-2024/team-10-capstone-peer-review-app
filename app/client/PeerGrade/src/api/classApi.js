import axios from "axios";
import showStatusToast from "@/utils/showToastStatus";

const BASE_URL = "/api"; // Use environment variable if available

export const getAllClasses = async () => {
	try {
		const response = await axios.get(`${BASE_URL}/classes/all`);
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const getInstructorByClassId = async (classId) => {
	try {
		const response = await axios.get(
			`${BASE_URL}/classes/${classId}/instructor`
		);
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const getStudentsByClassId = async (classId) => {
	try {
		const response = await axios.get(`${BASE_URL}/classes/${classId}/students`);
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const getClassesByUserId = async (userId) => {
	try {
		const response = await axios.post(`${BASE_URL}/users/get-classes`, {
			userId
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const getClassById = async (classId) => {
	try {
		const response = await axios.get(`${BASE_URL}/classes/${classId}`);
		// Not sure if this was intentional? .data.data? ask mahir soon about it, it was intentional but look into code that calls it
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const getCategoriesByClassId = async (classId) => {
	try {
		const response = await axios.get(
			`${BASE_URL}/classes/${classId}/categories`
		);
		// Not sure if this was intentional? .data.data?
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

// Groups
export const getAllGroupsByClass = async (classId) => {
	try {
		const response = await axios.post(`${BASE_URL}/classes/get-groups`, {
			classId
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const createGroup = async (classId, groupData) => {
	try {
		const response = await axios.post(`${BASE_URL}/classes/add-group`, {
			classId,
			groupData
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const deleteGroup = async (groupId) => {
	try {
		const response = await axios.post(`${BASE_URL}/classes/remove-group`, {
			groupId
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const updateGroup = async (groupId, updateData) => {
	try {
		const response = await axios.post(`${BASE_URL}/classes/update-group`, {
			groupId,
			updateData
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const joinGroup = async (groupId) => {
	try {
		const response = await axios.post(`${BASE_URL}/classes/join-group`, {
			groupId
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const leaveGroup = async (groupId) => {
	try {
		const response = await axios.post(`${BASE_URL}/classes/leave-group`, {
			groupId
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const addGroupMember = async (groupId, userId) => {
	try {
		const response = await axios.post(`${BASE_URL}/classes/add-group-member`, {
			groupId,
			userId
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const deleteGroupMember = async (groupId, userId) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/classes/remove-group-member`,
			{
				groupId,
				userId
			}
		);
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const getUsersNotInGroups = async (classId) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/classes/users-not-in-groups`,
			{
				classId
			}
		);
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const getAllAssignments = async (userId) => {
	try {
		const response = await axios.post(`${BASE_URL}/users/get-assignments`, {
			userId
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const createClass = async (newClass) => {
	try {
		const response = await axios.post(`${BASE_URL}/classes/create`, newClass);
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const updateClass = async (classId, updateData) => {
	try {
		const response = await axios.put(
			`${BASE_URL}/classes/${classId}`,
			updateData
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

export const deleteClass = async (classId) => {
	try {
		const response = await axios.delete(`${BASE_URL}/classes/${classId}`);
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const addStudentToClass = async (classId, studentId) => {
	try {
		const response = await axios.post(`${BASE_URL}/classes/add-student`, {
			classId,
			studentId
		});
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const addStudentsByEmail = async (classId, emails) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/classes/add-students-by-email`,
			{
				classId,
				emails
			}
		);
		return response.data;
	} catch (error) {
		handleError(error);
		return error.response.data;
	}
};

export const removeStudentFromClass = async (classId, studentId) => {
	try {
		const response = await axios.post(`${BASE_URL}/classes/remove-student`, {
			classId,
			studentId
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
		showStatusToast({
			status: "Error",
			message: "An unexpected error occurred. Please try again."
		});
	}
}
