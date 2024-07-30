import axios from "axios";

const BASE_URL = "/api";

export const addCommentToAssignment = async (assignmentId, content, studentId) => {
  try {
    const response = await axios.post(`${BASE_URL}/assignment/${assignmentId}/comments`, { content, studentId });
    return response.data;
  } catch (error) {
    console.error("Error in addCommentToAssignment API call:", error.response?.data || error.message);
    throw error;
  }
};


export const getCommentsForAssignment = async (assignmentId) => {
  try {
    const response = await axios.get(`${BASE_URL}/assignment/${assignmentId}/comments`);
    return response.data;
  } catch (error) {
    console.error("Error in getCommentsForAssignment API call:", error);
    throw error;
  }
};