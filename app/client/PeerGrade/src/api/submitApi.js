import axios from 'axios';
import showStatusToast from '@/utils/showToastStatus';

const BASE = '/api'; // Adjust this URL as needed

export const getStudentSubmission = async () => {
  try {
    const response = await axios.post(`${BASE}/submit/studentSubmissions`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error.response?.data || error;
  }
};

export const getStudentSubmissionForAssignment = async (studentId, assignmentId) => {
  try {
    const response = await axios.post(`${BASE}/submit/studentSubmissionsForAssignment`, { userId: studentId, assignmentId });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error.response?.data || error;
  }
};

export const getSubmissionsForAssignment = async (assignmentId) => {
  console.log('assignmentId:', assignmentId);
  try {
    const response = await axios.post(`${BASE}/submit/submissionsForAssignment`, { assignmentId });
    console.log('response', response);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error.response?.data || error;
  }
};

export const createSubmission = async (studentId, assignmentId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('studentId', studentId);
    formData.append('assignmentId', assignmentId);

    const response = await axios.post(`${BASE}/submit/createSubmission`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.status === 'Success') {
      showStatusToast({
        status: 'Success',
        message: 'Submission created successfully.'
      });
    } else {
      showStatusToast({
        status: 'Error',
        message: response.data.message || 'Failed to create submission.'
      });
    }

    return response.data;
  } catch (error) {
    handleError(error);
    throw error.response?.data || error;
  }
};

export const updateSubmission = async (submissionId, submission) => {
  try {
    const response = await axios.put(`${BASE}/submit/updateSubmission`, { submissionId, submission });
    showStatusToast({
      status: 'Success',
      message: 'Submission updated successfully.'
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error.response.data;
  }
};

export const deleteSubmission = async (submissionId) => {
  try {
    const response = await axios.delete(`${BASE}/submit/deleteSubmission`, { data: { submissionId } });
    showStatusToast({
      status: 'Success',
      message: 'Submission deleted successfully.'
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error.response.data;
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
      status: 'Error',
      message: 'An unexpected error occurred. Please try again.'
    });
  }
}
