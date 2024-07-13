// src/api/submitApi.js

import axios from 'axios';

const BASE = '/api'; // Adjust this URL as needed

export const getStudentSubmission = async () => {
  try {
    const response = await axios.get(`${BASE}/submit/studentSubmission`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getSubmissionsForAssignment = async (assignmentId) => {
  try {
    const response = await axios.post(`${BASE}/submit/submissionsForAssignment`, { assignmentId });
    return response.data;
  } catch (error) {
    throw error.response.data;
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
      console.log('response:', response);

      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        throw { message: "No response received from server" };
      } else {
        // Something happened in setting up the request that triggered an Error
        throw { message: error.message };
      }
    }
  };

export const updateSubmission = async (submissionId, submission) => {
  try {
    const response = await axios.put(`${BASE}/submit/updateSubmission`, { submissionId, submission });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteSubmission = async (submissionId) => {
  try {
    const response = await axios.delete(`${BASE}/submit/deleteSubmission`, { data: { submissionId } });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};