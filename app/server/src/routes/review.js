/**
 * @module routes/review
 * @file This file defines the routes for review operations.
 */
import express from "express";
import {
	getInstructorReview,
	getAllReviews,
	getReviewsForAssignment,
	createReview,
	assignRandomPeerReviews,
	updateReview,
	deleteReview,
	getPeerReviews,
	getReviewDetails,
	getReviewsAssigned,
	getReviewsReceived,
	getReviewById
} from "../controllers/reviewController.js";

import { ensureInstructor } from "../middleware/ensureUserTypes.js";

const router = express.Router();

/**
 * @route POST /review/studentReview
 * @desc Get peer reviews for a student
 * @function getPeerReviews
 * @param {Object} req - The request object containing the studentId
 * @returns {Object} - The response object with peer reviews data
 */
router.post("/studentReview", getPeerReviews);

/**
 * @route POST /review/instructorReview
 * @desc Get instructor review for a student
 * @function getInstructorReview
 * @param {Object} req - The request object containing the studentId
 * @returns {Object} - The response object with instructor review data
 */
router.post("/instructorReview", getInstructorReview);

/**
 * @route GET /review/received
 * @desc Get reviews received by an instructor
 * @function getReviewsReceived
 * @returns {Object} - The response object with reviews data
 */
router.get("/received", getReviewsReceived);

/**
 * @route GET /review/assigned
 * @desc Get reviews assigned to an instructor
 * @function getReviewsAssigned
 * @returns {Object} - The response object with reviews data
 */
router.get("/assigned", getReviewsAssigned);

/**
 * @route GET /review/assignment/:assignmentId
 * @desc Get reviews for an assignment
 * @function getReviewsForAssignment
 * @param {Object} req - The request object containing the assignmentId
 * @returns {Object} - The response object with reviews data
 */
router.get("/assignment/:assignmentId", getReviewsForAssignment);

/**
 * @route POST /review/allReviews
 * @desc Get all reviews for a submission
 * @function getAllReviews
 * @param {Object} req - The request object containing the submissionId
 * @returns {Object} - The response object with all reviews data
 */
router.post("/allReviews", getAllReviews);

/**
 * @route POST /review/reviewId
 * @desc Get a review by its ID
 * @function getReviewById
 * @param {Object} req - The request object containing the reviewId
 * @returns {Object} - The response object with the review data
 */
router.post("/reviewId", getReviewById);

/**
 * @route POST /review/createReview
 * @desc Create a new review
 * @function createReview
 * @param {Object} req - The request object containing the review data
 * @returns {Object} - The response object with the newly created review
 */
router.post("/createReview", ensureInstructor, createReview);

/**
 * @route POST /review/assignPeerReviews
 * @desc Assign peer reviews to students
 * @function assignRandomPeerReviews
 * @returns {Object} - The response object with the assigned peer reviews
 */
router.post("/assignPeerReviews", assignRandomPeerReviews);

/**
 * @route GET /review/reviewDetails/:reviewId
 * @desc Get details of a review
 * @function getReviewDetails
 * @param {Object} req - The request object containing the reviewId
 * @returns {Object} - The response object with the review details
 */
router.get("/reviewDetails/:reviewId", getReviewDetails);

/**
 * @route PUT /review/updateReview
 * @desc Update a review
 * @function updateReview
 * @param {Object} req - The request object containing the updated review data
 * @returns {Object} - The response object with the updated review
 */
router.put("/updateReview", updateReview);

/**
 * @route DELETE /review/deleteReview
 * @desc Delete a review
 * @function deleteReview
 * @param {Object} req - The request object containing the reviewId
 * @returns {Object} - The response object with the deleted review
 */
router.delete("/deleteReview", ensureInstructor, deleteReview);

export default router;
