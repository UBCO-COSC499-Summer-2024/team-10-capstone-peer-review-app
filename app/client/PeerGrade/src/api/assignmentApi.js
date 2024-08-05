// This code defines several API functions for managing assignments in a class setting. 
// The functionalities include:

// 1. addAssignmentToClass: Adds an assignment to a class with form data handling and validation.
// 2. addAssignmentWithRubric: Adds an assignment with rubric data to a class.
// 3. updateAssignmentInClass: Updates an existing assignment in a class.
// 4. removeAssignmentFromClass: Removes an assignment from a class.
// 5. getAssignmentInClass: Retrieves a specific assignment by class ID and assignment ID.
// 6. getAllAssignments: Retrieves all assignments.
// 7. getAllAssignmentsByClassId: Retrieves all assignments for a specific class ID.
// 8. addAssignmentToCategory: Adds an assignment to a specific category within a class.
// 9. extendDeadlineForStudent: Extends the deadline for a student on a specific assignment.
// 10. deleteExtendedDeadlineForStudent: Deletes an extended deadline for a student on a specific assignment.

// The handleError function is used to handle errors and display appropriate status messages.

import axios from "axios";
import showStatusToast from "@/utils/showToastStatus";

const BASE_URL = "/api"; // Use environment variable if available

export const addAssignmentToClass = async (formData) => {
  try {
    // Get the assignmentData from formData
    const assignmentDataString = formData.get('assignmentData');
    let assignmentData = JSON.parse(assignmentDataString);
    
    assignmentData.maxSubmissions = parseInt(assignmentData.maxSubmissions, 10);


    // Ensure allowedFileTypes is included in assignmentData
    if (!assignmentData.allowedFileTypes || assignmentData.allowedFileTypes.length === 0) {
      console.warn('allowedFileTypes is empty or not set');
    }

    // Log the assignmentData for debugging
    console.log('Assignment Data being sent:', assignmentData);

    const response = await axios.post('/api/assignment/add-assignment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.status === 'Success') {
      showStatusToast({
        status: response.data.status,
        message: "The assignment has been successfully created."
      });
    }
    console.log('Updated assignment data:', response.data);

    return response.data;
  } catch (error) {
    handleError(error);
    return error.response.data;
  }
};

export const addAssignmentWithRubric = async (data) => {
  console.log('Data to add assignment with rubric:', data);
  try {
    const formData = new FormData();
    formData.append('classId', data.classId);
    formData.append('categoryId', data.categoryId);
    formData.append('assignmentData', JSON.stringify(data.assignmentData));
    formData.append('rubricData', JSON.stringify(data.rubricData));
    formData.append('creatorId', data.creatorId);

    if (data.file) {
      formData.append('file', data.file);
    }

    const response = await axios.post('/api/assignment/add-assignment-with-rubric', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding assignment with rubric:', error);
    throw error;
  }
};

export const updateAssignmentInClass = async (formData) => {
    try {
      const response = await axios.post('/api/assignment/update-assignment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.data.status === 'Success') {
        showStatusToast({
          status: response.data.status,
          message: "The assignment has been successfully updated."
        });
      }
      console.log('Updated assignment data:', response.data);
      return response.data;

    } catch (error) {
      handleError(error);
      return error.response.data;
    }
  };

  export const removeAssignmentFromClass = async (assignmentId) => {
    try {
        const response = await axios.post(`${BASE_URL}/assignment/remove-assignment`, {
            assignmentId
        });
        return response.data;
    } catch (error) {
        console.error("Error in removeAssignmentFromClass API call:", error.response?.data || error.message);
        handleError(error);
        throw error;
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

export const getAllAssignments = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/assignment/get-all-assignments`);
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

export const extendDeadlineForStudent = async (assignmentId, studentId, newDueDate) => {
    try {
        const response = await axios.post(`${BASE_URL}/assignment/extend-deadline`, {
            studentId,
            assignmentId,
            newDueDate
        });
        return response.data;
    } catch (error) {
        handleError(error);
        return error.response.data;
    }
};

export const deleteExtendedDeadlineForStudent = async (studentId, assignmentId) => {
    try {
        const response = await axios.post(`${BASE_URL}/assignment/delete-extended-deadline`, {
            studentId,
            assignmentId
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
