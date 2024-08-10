/**
 * @module reviewController
 * @desc Controller methods for review operations
 */

// Import necessary modules and services
import reviewService from "../services/reviewService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import apiError from "../utils/apiError.js";

/**
 * @async
 * @function getPeerReviews
 * @desc Get peer reviews for a submission
 * @param {Object} req - The request object containing the submissionId
 * @returns {Object} - The response object with peer reviews data
 */
export const getPeerReviews = asyncErrorHandler(async (req, res) => {
	const submissionId = req.body.submissionId;
	const studentData = await reviewService.getPeerReviews(submissionId);
	return res.status(200).json({
		status: "Success",
		data: studentData
	});
});

/**
 * @async
 * @function getInstructorReview
 * @desc Get instructor review for a submission
 * @param {Object} req - The request object containing the submissionId
 * @returns {Object} - The response object with instructor review data
 */
export const getInstructorReview = asyncErrorHandler(async (req, res) => {
	const submissionId = req.body.submissionId;
	const instructorData = await reviewService.getInstructorReview(submissionId);
	return res.status(200).json({
		status: "Success",
		data: instructorData
	});
});

/**
 * @async
 * @function getAllReviews
 * @desc Get all reviews for a submission
 * @param {Object} req - The request object containing the submissionId
 * @returns {Object} - The response object with all reviews data
 */
export const getAllReviews = asyncErrorHandler(async (req, res) => {
	const submissionId = req.body.submissionId;
	const reviews = await reviewService.getAllReviews(submissionId);
	console.log("reviews", reviews);
	return res.status(200).json({
		status: "Success",
		data: reviews
	});
});

/**
 * @async
 * @function getReviewsForAssignment
 * @desc Get reviews for an assignment
 * @param {Object} req - The request object containing the assignmentId in the parameters
 * @returns {Object} - The response object with reviews data
 */
export const getReviewsForAssignment = asyncErrorHandler(async (req, res) => {
	const { assignmentId } = req.params;
	const reviews = await reviewService.getReviewsForAssignment(assignmentId);

	return res.status(200).json({
		status: "Success",
		data: reviews
	});
});

/**
 * @async
 * @function updateReview
 * @desc Update a review
 * @param {Object} req - The request object containing the review data and reviewId
 * @returns {Object} - The response object with updated review data
 */
export const updateReview = asyncErrorHandler(async (req, res) => {
	console.log("req.body", req.body);
	const { review, reviewId } = req.body;
	const updatedReview = await reviewService.updateReview(reviewId, review);
	return res.status(200).json({
		status: "Success",
		data: updatedReview
	});
});

/**
 * @async
 * @function deleteReview
 * @desc Delete a review
 * @param {Object} req - The request object containing the reviewId
 * @returns {Object} - The response object with deleted review data
 */
export const deleteReview = asyncErrorHandler(async (req, res) => {
	const reviewId = req.body.reviewId;
	const deletedReview = await reviewService.deleteReview(reviewId);
	return res.status(200).json({
		status: "Success",
		data: deletedReview
	});
});

/**
 * @async
 * @function createReview
 * @desc Create a new review
 * @param {Object} req - The request object containing the review data, userId, and criterionGrades
 * @returns {Object} - The response object with new review data
 */
export const createReview = asyncErrorHandler(async (req, res) => {
	const { userId, review, criterionGrades } = req.body;
	const newReview = await reviewService.createReview(
		userId,
		review,
		criterionGrades
	);
	return res.status(200).json({
		status: "Success",
		data: newReview
	});
});

/**
 * @async
 * @function assignRandomPeerReviews
 * @desc Assign random peer reviews for an assignment
 * @param {Object} req - The request object containing the assignmentId and reviewsPerStudent
 * @returns {Object} - The response object with assigned reviews data
 */
export const assignRandomPeerReviews = asyncErrorHandler(async (req, res) => {
	const { assignmentId, reviewsPerStudent } = req.body;

	const result = await reviewService.assignRandomPeerReviews(
		assignmentId,
		reviewsPerStudent
	);

	return res.status(200).json({
		status: "Success",
		message: `Peer reviews assigned successfully. ${result.assignedReviews} reviews assigned in total.`,
		data: {
			assignedReviews: result.assignedReviews
		}
	});
});

/**
 * @async
 * @function getReviewDetails
 * @desc Get details of a review
 * @param {Object} req - The request object containing the reviewId in the parameters
 * @returns {Object} - The response object with review details data
 */
export const getReviewDetails = asyncErrorHandler(async (req, res) => {
	const { reviewId } = req.params;
	const reviewDetails = await reviewService.getReviewDetails(reviewId);
	return res.status(200).json({
		status: "Success",
		data: reviewDetails
	});
});

/**
 * @async
 * @function getReviewsAssigned
 * @desc Get reviews assigned to a user
 * @param {Object} req - The request object containing the userId if the user is still logged in
 * @returns {Object} - The response object with assigned reviews data
 */
export const getReviewsAssigned = asyncErrorHandler(async (req, res) => {
	const userId = req.user.userId;
	const reviewsAssigned = await reviewService.getReviewsAssigned(userId);
	return res.status(200).json({
		status: "Success",
		data: reviewsAssigned
	});
});

/**
 * @async
 * @function getReviewsReceived
 * @desc Get reviews received by a user
 * @param {Object} req - The request object containing the userId if the user is still logged in
 * @returns {Object} - The response object with received reviews data
 */
export const getReviewsReceived = asyncErrorHandler(async (req, res) => {
	const userId = req.user.userId;
	const reviewsReceived = await reviewService.getReviewsReceived(userId);
	console.log("reviewsReceived", reviewsReceived);
	return res.status(200).json({
		status: "Success",
		data: reviewsReceived
	});
});

/**
 * @async
 * @function getReviewById
 * @desc Get a review by its ID
 * @param {Object} req - The request object containing the reviewId
 * @returns {Object} - The response object with review data
 */
export const getReviewById = asyncErrorHandler(async (req, res) => {
	const { reviewId } = req.body;
	console.log("Received reviewId:", reviewId);
	if (!reviewId) {
		return res.status(400).json({
			status: "Error",
			message: "reviewId is required"
		});
	}
	try {
		const review = await reviewService.getReviewById(reviewId);
		return res.status(200).json({
			status: "Success",
			data: review
		});
	} catch (error) {
		console.error("Error in getReviewById:", error);
		throw error;
	}
});

// Export all controller methods
export default {
	getPeerReviews,
	getInstructorReview,
	getAllReviews,
	getReviewsForAssignment,
	createReview,
	assignRandomPeerReviews,
	updateReview,
	deleteReview,
	getReviewDetails,
	getReviewsAssigned,
	getReviewsReceived,
	getReviewById
};
