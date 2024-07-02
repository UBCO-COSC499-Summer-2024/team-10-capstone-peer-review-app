import axios from "axios";
import showStatusToast from "@/utils/showToastStatus";

const BASE_URL = "/api"; // Use environment variable if available

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
      return response.data.data;
    } catch (error) {
      handleError(error);
      return error.response.data;
    }
  };
  
export const getCategoriesByClassId = async (classId) => {
    try {
      const response = await axios.get(`${BASE_URL}/classes/${classId}/categories`);
      return response.data.data;
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

export const deleteClass = async (classId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/classes/${classId}`);
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
