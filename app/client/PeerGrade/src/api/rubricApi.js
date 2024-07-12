import axios from "axios";
import showStatusToast from "@/utils/showToastStatus";

const BASE_URL = "/api"; // Use environment variable if available

export const getAllRubrics = async () => {
  return await axios.post(`${BASE_URL}/rubric/get-all-rubrics`); // Adjust the endpoint as necessary
};

export const getRubricById = async (rubricId) => {
    console.log(rubricId);
  return await axios.post(`${BASE_URL}/rubric/get-rubric-by-id`, { rubricId }); // Adjust the endpoint as necessary
};

export const addRubricToAssignment = async (data) => {
  const { userId, assignmentId, rubricData } = data;
  console.log('userId:', userId);
  console.log('assignmentId:', assignmentId);
  console.log('rubricData:', rubricData);
  try {
    const response = await axios.post(`${BASE_URL}/rubric/add-rubrics`, { userId, assignmentId, rubricData });
    showStatusToast({
      status: "Success",
      message: "Rubric added successfully"
    });
    return response;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

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
}