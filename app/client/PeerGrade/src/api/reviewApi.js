import axios from "axios";
import showStatusToast from "@/utils/showToastStatus";

const BASE_URL = '/api';

const reviewAPI = {
  // Review operations
  getPeerReviews: async (submissionId) => {
    try {
      const response = await axios.post(`${BASE_URL}/review/studentReview`, { submissionId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getInstructorReview: async (submissionId) => {
    console.log('submissionId', submissionId);
    try {
      const response = await axios.post(`${BASE_URL}/review/instructorReview`, { submissionId });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // No instructor review found, return null instead of throwing an error
        return { data: null };
      }
      // For other errors, throw as usual
      throw error;
    }
  },

  getUserReviews: async (userId) => {
    try {
        const response = await axios.post(`${BASE_URL}/review/userReviews`, { userId });
        return response.data;
    } catch (error) {
        console.error("Error fetching user reviews:", error.response?.data || error.message);
        throw error;
    }
},

  getAllReviews: async (submissionId) => {
    try {
      const response = await axios.post(`${BASE_URL}/review/allReviews`, { 
        submissionId,
        include: {
          criterionGrades: {
            include: {
              criterion: true
            }
          }
        }
      });
      console.log('response', response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createReview: async (userId, review) => {
    try {
        const response = await axios.post(`${BASE_URL}/review/createReview`, {userId, review});
        return response.data;
    } catch (error) {
        console.error("Error creating review:", error.response?.data || error.message);
        throw error;
    }
},

updateReview: async (reviewId, review) => {
  console.log('reviewId', reviewId);
  console.log('review', review);
  try {
    const response = await axios.put(`${BASE_URL}/review/updateReview`, {
      reviewId, 
      review 
    });
    return response.data;
  } catch (error) {
    console.error("Error updating review:", error.response?.data || error.message);
    throw error;
  }
},

  deleteReview: async (reviewId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/review/deleteReview`, { data: { reviewId } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Grading operations
  getGrades: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/grade/grades`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSubmissionGrade: async (submissionId) => {
    try {
      const response = await axios.get(`${BASE_URL}/grade/submissionGrade`, { params: { submissionId } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },



getReviewDetails: async (reviewId) => {
    try {
        const response = await axios.get(`${BASE_URL}/review/reviewDetails/${reviewId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
},

  updateGrade: async (gradeId, grade) => {
    try {
      const response = await axios.put(`${BASE_URL}/grade/updateGrade`, { gradeId, grade });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteGrade: async (gradeId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/grade/deleteGrade`, { data: { gradeId } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
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

export default reviewAPI;