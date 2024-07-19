import axios from "axios";
import showStatusToast from "@/utils/showToastStatus";
import { toast } from "@/components/ui/use-toast";

const BASE_URL = "/api"; // Use environment variable if available

export const addAssignmentToClass = async (formData) => {
    try {
        const response = await axios.post('/api/assignment/add-assignment', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          if (response.data.status === 'Success') {
            toast({
              title: "Assignment Created",
              description: "The assignment and its rubric have been successfully created.",
              status: "success"
            });
          }
          console.log('Updated assignment data:', response.data);

         return response.data;
    } catch (error) {
        handleError(error);
        return error.response.data;
    }
};


export const updateAssignmentInClass = async (classId, assignmentId, updateData) => {
    try {
        const response = await axios.post(`${BASE_URL}/assignment/update-assignment`, {
            classId,
            assignmentId,
            updateData
        });
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
        toast({
            title: "Error",
            description: "An error occurred while fetching assignments. Please try again.",
            status: "error"
        });
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


