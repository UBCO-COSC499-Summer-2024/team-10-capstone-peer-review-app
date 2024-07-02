// Import necessary modules and services
import express from "express";
import reviewService from "../services/reviewService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

// Controller methods for review operations

export const getStudentReview = asyncErrorHandler(async (req, res) => {
    const studentId = req.user.userId;
    const submissionId = req.body.submissionId;
    const studentData = await reviewService.getStudentReview(studentId, submissionId);
    return res.status(200).json({
        status: "Success",
        data: studentData
    });
});

export const getInstructorReview = asyncErrorHandler(async (req, res) => {
    const instructorId = req.user.userId;
    const submissionId = req.body.submissionId;
    const instructorData = await reviewService.getInstructorReview(instructorId, submissionId);
    return res.status(200).json({
        status: "Success",
        data: instructorData
    });
});

export const getAllReviews = asyncErrorHandler(async (req, res) => {
    const submissionId = req.body.submissionId;
    const reviews = await reviewService.getAllReviews(submissionId);
    return res.status(200).json({
        status: "Success",
        data: reviews
    });
});

export const createReview = asyncErrorHandler(async (req, res) => {
    const review = req.body;
    const newReview = await reviewService.createReview(review);
    return res.status(200).json({
        status: "Success",
        data: newReview
    });
});

export const updateReview = asyncErrorHandler(async (req, res) => {
    const {review, reviewId} = req.body;
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

// Export all controller methods
export default {
    getStudentReview,
    getInstructorReview,
    getAllReviews,
    createReview,
    updateReview,
    deleteReview
};
