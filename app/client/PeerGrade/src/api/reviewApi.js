// getReviewById: Fetch a review by its ID
// getPeerReviews: Fetch peer reviews for a submission
// getReviewsForAssignment: Fetch all reviews for an assignment
// getInstructorReview: Fetch the instructor's review for a submission
// getReviewsAssigned: Fetch reviews assigned to the user
// getReviewsReceived: Fetch reviews received by the user
// getAllReviews: Fetch all reviews for a submission, including criterion grades
// createReview: Create a new review
// assignRandomPeerReviews: Assign peer reviews randomly for an assignment
// updateReview: Update a review by its ID
// deleteReview: Delete a review by its ID
// getGrades: Fetch all grades
// getSubmissionGrade: Fetch the grade for a specific submission
// getReviewDetails: Fetch detailed information for a specific review
// updateGrade: Update a grade by its ID
// deleteGrade: Delete a grade by its ID


import axios from "axios";
import showStatusToast from "@/utils/showToastStatus";

const BASE_URL = "/api";

const reviewAPI = {
	getReviewById: async (reviewId) => {
		console.log("Sending request for reviewId:", reviewId);
		try {
			const response = await axios.post(`${BASE_URL}/review/reviewId`, {
				reviewId
			});
			return response.data;
		} catch (error) {
			handleError(error);
			throw error;
		}
	},

	// Review operations
	getPeerReviews: async (submissionId) => {
		try {
			const response = await axios.post(`${BASE_URL}/review/studentReview`, {
				submissionId
			});
			return response.data;
		} catch (error) {
			handleError(error);
			throw error;
		}
	},

	// Add this method to your reviewAPI object

	getReviewsForAssignment: async (assignmentId) => {
		try {
			const response = await axios.get(
				`${BASE_URL}/review/assignment/${assignmentId}`
			);
			return response.data;
		} catch (error) {
			handleError(error);
			throw error;
		}
	},

	getInstructorReview: async (submissionId) => {
		console.log("submissionId", submissionId);
		try {
			const response = await axios.post(`${BASE_URL}/review/instructorReview`, {
				submissionId
			});
			return response.data;
		} catch (error) {
			if (error.response && error.response.status === 404) {
				// No instructor review found, return null instead of throwing an error
				return { data: null };
			}
			handleError(error);
			throw error;
		}
	},

	getReviewsAssigned: async () => {
		try {
			const response = await axios.get(`${BASE_URL}/review/assigned`);
			return response.data;
		} catch (error) {
			handleError(error);
			throw error;
		}
	},

	getReviewsReceived: async () => {
		try {
			const response = await axios.get(`${BASE_URL}/review/received`);
			return response.data;
		} catch (error) {
			handleError(error);
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
			console.log("response", response);
			return response.data;
		} catch (error) {
			handleError(error);
			throw error;
		}
	},

	createReview: async (userId, review) => {
		try {
			const response = await axios.post(`${BASE_URL}/review/createReview`, {
				userId,
				review
			});
			showStatusToast({
				status: "Success",
				message: "Review created successfully."
			});
			return response.data;
		} catch (error) {
			handleError(error);
			throw error;
		}
	},

	assignRandomPeerReviews: async (assignmentId, reviewsPerStudent) => {
		try {
			const response = await axios.post(
				`${BASE_URL}/review/assignPeerReviews`,
				{
					assignmentId,
					reviewsPerStudent
				}
			);
			showStatusToast({
				status: "Success",
				message: response.data.message || "Peer reviews assigned successfully."
			});
			return response.data;
		} catch (error) {
			handleError(error);
			throw error;
		}
	},

	updateReview: async (reviewId, review) => {
		console.log("reviewId", reviewId);
		console.log("review", review);
		try {
			const response = await axios.put(`${BASE_URL}/review/updateReview`, {
				reviewId,
				review
			});
			showStatusToast({
				status: "Success",
				message: "Review updated successfully."
			});
			return response.data;
		} catch (error) {
			handleError(error);
			throw error;
		}
	},

	deleteReview: async (reviewId) => {
		try {
			const response = await axios.delete(`${BASE_URL}/review/deleteReview`, {
				data: { reviewId }
			});
			showStatusToast({
				status: "Success",
				message: "Review deleted successfully."
			});
			return response.data;
		} catch (error) {
			handleError(error);
			throw error;
		}
	},

	// Grading operations
	getGrades: async () => {
		try {
			const response = await axios.get(`${BASE_URL}/grade/grades`);
			return response.data;
		} catch (error) {
			handleError(error);
			throw error;
		}
	},

	getSubmissionGrade: async (submissionId) => {
		try {
			const response = await axios.get(`${BASE_URL}/grade/submissionGrade`, {
				params: { submissionId }
			});
			return response.data;
		} catch (error) {
			handleError(error);
			throw error;
		}
	},

	getReviewDetails: async (reviewId) => {
		try {
			const response = await axios.get(
				`${BASE_URL}/review/reviewDetails/${reviewId}`
			);
			return response.data;
		} catch (error) {
			handleError(error);
			throw error;
		}
	},

	updateGrade: async (gradeId, grade) => {
		try {
			const response = await axios.put(`${BASE_URL}/grade/updateGrade`, {
				gradeId,
				grade
			});
			showStatusToast({
				status: "Success",
				message: "Grade updated successfully."
			});
			return response.data;
		} catch (error) {
			handleError(error);
			throw error;
		}
	},

	deleteGrade: async (gradeId) => {
		try {
			const response = await axios.delete(`${BASE_URL}/grade/deleteGrade`, {
				data: { gradeId }
			});
			showStatusToast({
				status: "Success",
				message: "Grade deleted successfully."
			});
			return response.data;
		} catch (error) {
			handleError(error);
			throw error;
		}
	}
};

const handleError = (error) => {
	if (error.response && error.response.data) {
		console.log("error.response.data", error.response.data);
		showStatusToast({
			status: error.response.data.status,
			message: error.response.data.message
		});
	} else {
		console.log("error", error);
		showStatusToast({
			status: "Error",
			message: "An unexpected error occurred. Please try again."
		});
	}
};

export default reviewAPI;
