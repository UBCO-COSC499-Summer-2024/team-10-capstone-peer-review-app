import axios from "axios";
import showStatusToast from "@/utils/showToastStatus";

const BASE_URL = "/api"; // Use environment variable if available

export const addAssignmentToClass = async (classId, assignmentData) => {
    try {
        const response = await axios.post(`${BASE_URL}/assignment/${classId}/assignments`, assignmentData);
        return response.data;
    } catch (error) {
        handleError(error);
        return error.response.data;
    }
};

export const updateAssignmentInClass = async (classId, assignmentId, updateData) => {
    try {
        const response = await axios.put(`${BASE_URL}/assignment/${classId}/assignments/${assignmentId}`, updateData);
        return response.data;
    } catch (error) {
        handleError(error);
        return error.response.data;
    }
};

export const removeAssignmentFromClass = async (classId, assignmentId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/assignment/${classId}/assignments/${assignmentId}`);
        return response.data;
    } catch (error) {
        handleError(error);
        return error.response.data;
    }
};

export const getAssignmentInClass = async (classId, assignmentId) => {
    try {
        console.log(classId, assignmentId)
        const response = await axios.post(`${BASE_URL}/assignment/get-assignment`, {
            classId,
            assignmentId
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        handleError(error);
        return error.response.data;
    }
};

export const getAllAssignmentsByClassId = async (classId) => {
    try {
        const response = await axios.post(`${BASE_URL}/assignment/get-class-assignments`, {
            classId
        });
        return response.data;
    } catch (error) {
        handleError(error);
        return error.response.data;
    }
};

export const addAssignmentToCategory = async (classId, categoryId, assignmentData) => {
    try {
      const response = await axios.post(`${BASE_URL}/assignment/${classId}/categories/${categoryId}/assignments`, assignmentData);
      return response.data.data;
    } catch (error) {
      handleError(error);
      throw error;
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


