// Import necessary modules and services
import reviewService from "../services/reviewService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

// Controller methods for review operations

export const getPeerReviews = asyncErrorHandler(async (req, res) => {
	const submissionId = req.body.submissionId;
	const studentData = await reviewService.getPeerReviews(submissionId);
	return res.status(200).json({
		status: "Success",
		data: studentData
	});
});

export const getInstructorReview = asyncErrorHandler(async (req, res) => {
	const submissionId = req.body.submissionId;
	const instructorData = await reviewService.getInstructorReview(submissionId);
	return res.status(200).json({
		status: "Success",
		data: instructorData
	});
});

export const getAllReviews = asyncErrorHandler(async (req, res) => {
	const submissionId = req.body.submissionId;
	const reviews = await reviewService.getAllReviews(submissionId);
	console.log("reviews", reviews);
	return res.status(200).json({
		status: "Success",
		data: reviews
	});
});

export const updateReview = asyncErrorHandler(async (req, res) => {
	console.log("req.body", req.body);
	const { review, reviewId } = req.body;
	const updatedReview = await reviewService.updateReview(reviewId, review);
	return res.status(200).json({
		status: "Success",
		data: updatedReview
	});
});

export const deleteReview = asyncErrorHandler(async (req, res) => {
	const reviewId = req.body.reviewId;
	const deletedReview = await reviewService.deleteReview(reviewId);
	return res.status(200).json({
		status: "Success",
		data: deletedReview
	});
});

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

export const getReviewDetails = asyncErrorHandler(async (req, res) => {
	const { reviewId } = req.params;
	const reviewDetails = await reviewService.getReviewDetails(reviewId);
	return res.status(200).json({
		status: "Success",
		data: reviewDetails
	});
});

export const getReviewsAssigned = asyncErrorHandler(async (req, res) => {
	const userId = req.user.userId;
	const reviewsAssigned = await reviewService.getReviewsAssigned(userId);
	return res.status(200).json({
		status: "Success",
		data: reviewsAssigned
	});
});

export const getReviewsReceived = asyncErrorHandler(async (req, res) => {
	const userId = req.user.userId;
	const reviewsReceived = await reviewService.getReviewsReceived(userId);
	return res.status(200).json({
		status: "Success",
		data: reviewsReceived
	});
});

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
	createReview,
	updateReview,
	deleteReview,
	getReviewDetails,
	getReviewsAssigned,
	getReviewsReceived,
	getReviewById
};
