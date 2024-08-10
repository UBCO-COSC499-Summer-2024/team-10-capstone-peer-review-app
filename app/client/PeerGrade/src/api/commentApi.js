// These functions handle adding comments to an assignment and retrieving comments for a specific assignment. Here is a brief explanation and the refined code:

// addCommentToAssignment: Sends a POST request to add a comment to a specific assignment, using the assignment ID, comment content, and student ID.
// getCommentsForAssignment: Sends a GET request to retrieve all comments for a specific assignment using the assignment ID.


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