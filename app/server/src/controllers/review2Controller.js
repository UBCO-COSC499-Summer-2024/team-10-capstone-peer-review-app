// Import necessary modules and services
import express from "express";
import reviewService from "../services/review2Service.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
//import { user } from "../../../../../../../node_modules/pg/lib/defaults.js";


// Controller methods for review operations

export const getSubmissionCriteria = asyncErrorHandler(async (req, res) => {
    const submissionId = req.body.submissionId;
    const submissionCriteria = await reviewService.getSubmissionCriteria(submissionId);
    return res.status(200).json({
        status: "Success",
        data: submissionCriteria
    });
});


// get the reviews done on a submission
export const getReviews = asyncErrorHandler(async (req, res) => {
    const submissionId = req.body.submissionId;
    const review = await reviewService.getAllReviews(submissionId);
    return res.status(200).json({
        status: "Success",
        data: review
    });
});

// get all reviews for a student on a submission (peer or instructor check) through an instructor
export const getStudentReviews = asyncErrorHandler(async (req, res) => {
    const submissionId = req.body.submissionId;
    const studentId = req.body.studentId;
    const studentReviews = await reviewService.getStudentReviews(submissionId, studentId);
    return res.status(200).json({
        status: "Success",
        data: studentReviews
    });
});


// get all submissions open for reviews of an assignment
export const getOpenReviewsAssignment = asyncErrorHandler(async (req, res) => {
    const userId = req.user.userId;
    const assignmentId = req.body.assignmentId;
    const openReviews = await reviewService.getOpenToReviewAssignment(userId, assignmentId);
    return res.status(200).json({
        status: "Success",
        data: openReviews
    });
});

// get all submissions closed for reviews of an assignment
export const getClosedReviewsAssignment = asyncErrorHandler(async (req, res) => {
    const userId = req.user.userId;
    const assignmentId = req.body.assignmentId;
    const closedReviews = await reviewService.getClosedReviewsAssignment(userId, assignmentId);
    return res.status(200).json({
        status: "Success",
        data: closedReviews
    });
});

// get all submissions open for reviews in a class (peer or instructor check)
export const getOpenReviewsClass = asyncErrorHandler(async (req, res) => {
    const classId = req.body.classId;
    const openReviews = await reviewService.getOpenReviewsClass(classId);
    return res.status(200).json({
        status: "Success",
        data: openReviews
    });
});

// get all closed reviews in a class (peer or instructor check)
export const getClosedReviewsClass = asyncErrorHandler(async (req, res) => {
    const classId = req.body.classId;
    const closedReviews = await reviewService.getClosedReviewsClass(classId);
    return res.status(200).json({
        status: "Success",
        data: closedReviews
    });
});


// get student grade for an assignment
export const getStudentGradeAsg = asyncErrorHandler(async (req, res) => {
    const {studentId, assignmentId } = req.body;
    const averageGrade = await reviewService.getStudentGradeAsg(studentId, assignmentId);
    return res.status(200).json({
        status: "Success",
        data: averageGrade
    });
});

// get student grade for a class
export const getStudentGradeClass = asyncErrorHandler(async (req, res) => {
    const {studentId, classId } = req.body;
    const averageGrade = await reviewService.getStudentGradeClass(studentId, classId);
    return res.status(200).json({
        status: "Success",
        data: averageGrade
    });
});

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
    console.log('reviews', reviews);
    return res.status(200).json({
        status: "Success",
        data: reviews
    });
});

export const createReview = asyncErrorHandler(async (req, res) => {
    const userId = req.user.userId;
    const { submissionId, criterionGrades } = req.body;
    const newReview = await reviewService.createReviewForSubmission(userId, submissionId, criterionGrades);
    return res.status(200).json({
        status: "Success",
        data: newReview
    });
});

export const updateReview = asyncErrorHandler(async (req, res) => {
    const userId = req.user.userId;
    const {reviewId, criterionGrades} = req.body;
    const updatedReview = await reviewService.updateReview(userId, reviewId, criterionGrades);
    return res.status(200).json({
        status: "Success",
        data: updatedReview
    });
});


export const deleteReview = asyncErrorHandler(async (req, res) => {
    const userId = req.user.userId;
    const reviewId = req.body.reviewId;
    const deletedReview = await reviewService.deleteReview(userId, reviewId);
    return res.status(200).json({
        status: "Success",
        data: deletedReview
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

export const getUserReviews = asyncErrorHandler(async (req, res) => {
    const { userId } = req.body;
    console.log('Received userId:', userId);
    if (!userId) {
        return res.status(400).json({
            status: "Error",
            message: "userId is required"
        });
    }
    const userReviews = await reviewService.getUserReviews(userId);
    return res.status(200).json({
        status: "Success",
        data: userReviews
    });
});

export const getReviewById = asyncErrorHandler(async (req, res) => {
    const { reviewId } = req.body;
    console.log('Received reviewId:', reviewId);
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
        console.error('Error in getReviewById:', error);
        throw error;
    }
});

// Export all controller methods
export default {
    getSubmissionCriteria,
    getReviews,
    getOpenReviewsAssignment,
    getClosedReviewsAssignment,
    getOpenReviewsClass,
    getClosedReviewsClass,
    getStudentReviews,
    getStudentGradeAsg,
    getStudentGradeClass,
    getPeerReviews,
    getInstructorReview,
    createReview,
    updateReview,
    deleteReview,
    getReviewDetails,
    getUserReviews,
    getReviewById
};
