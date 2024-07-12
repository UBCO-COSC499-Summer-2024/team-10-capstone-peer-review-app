// Import necessary modules and services
import express from "express";
import reviewService from "../services/reviewService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";


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


// get all open reviews for an assignment
export const getOpenReviewsAssignment = asyncErrorHandler(async (req, res) => {
    const userId = req.user.userId;
    const assignmentId = req.body.assignmentId;
    const openReviews = await reviewService.getOpenToReviewAssignment(userId, assignmentId);
    return res.status(200).json({
        status: "Success",
        data: openReviews
    });
});

// get all closed reviews for a submission
export const getClosedReviewsAssignment = asyncErrorHandler(async (req, res) => {
    const assignmentId = req.body.assignmentId;
    const closedReviews = await reviewService.getClosedReviewsAssignment(assignmentId);
    return res.status(200).json({
        status: "Success",
        data: closedReviews
    });
});

// get all open reviews in a class (peer or instructor check)
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


// get student average grade
export const getStudentAverageGrade = asyncErrorHandler(async (req, res) => {
    const studentId = req.body.studentId;
    const averageGrade = await reviewService.getStudentAverageGrade(studentId);
    return res.status(200).json({
        status: "Success",
        data: averageGrade
    });
});

// get all group reviews for a submission
export const getGroupReviews = asyncErrorHandler(async (req, res) => {
    const submissionId = req.body.submissionId;
    const groupReviews = await reviewService.getGroupReviews(submissionId);
    return res.status(200).json({
        status: "Success",
        data: groupReviews
    });
});

// create a group review on a submission
export const createGroupReview = asyncErrorHandler(async (req, res) => {
    const groupReview = req.body;
    const newGroupReview = await reviewService.createGroupReview(groupReview);
    return res.status(200).json({
        status: "Success",
        data: newGroupReview
    });
});

// update a group review on a submission
export const updateGroupReview = asyncErrorHandler(async (req, res) => {
    const groupReview = req.body;
    const updatedGroupReview = await reviewService.updateGroupReview(groupReview);
    return res.status(200).json({
        status: "Success",
        data: updatedGroupReview
    });
});

// delete a group review on a submission
export const deleteGroupReview = asyncErrorHandler(async (req, res) => {
    const groupReviewId = req.body.reviewId;
    const deletedGroupReview = await reviewService.deleteGroupReview(groupReviewId);
    return res.status(200).json({
        status: "Success",
        data: deletedGroupReview
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

// Export all controller methods
export default {
    getSubmissionCriteria,
    getReviews,
    getOpenReviewsAssignment,
    getClosedReviewsAssignment,
    getOpenReviewsClass,
    getClosedReviewsClass,
    getStudentReviews,
    getStudentAverageGrade,
    getGroupReviews,
    createGroupReview,
    updateGroupReview,
    deleteGroupReview,
    getPeerReviews,
    getInstructorReview,
    createReview,
    updateReview,
    deleteReview
};
