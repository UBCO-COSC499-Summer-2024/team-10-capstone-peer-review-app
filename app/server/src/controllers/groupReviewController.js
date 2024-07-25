// Import necessary modules and services
import express from "express";
import groupReviewService from "../services/groupReviewService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

// get all group reviews for a submission
export const getGroupReviews = asyncErrorHandler(async (req, res) => {
    const submissionId = req.body.submissionId;
    const groupReviews = await groupReviewService.getGroupReviews(submissionId);
    return res.status(200).json({
        status: "Success",
        data: groupReviews
    });
});

// create a group review on a submission
export const createGroupReviewRubric = asyncErrorHandler(async (req, res) => {
    const userId = req.user.userId;
    const {assignmentId } = req.body;
    const newGroupReview = await groupReviewService.createGroupReviewRubric(userId, assignmentId);
    return res.status(200).json({
        status: "Success",
        data: newGroupReview
    });
});

// create a group review on a submission
export const addGroupReview = asyncErrorHandler(async (req, res) => {
    const userId = req.user.userId;
    const {assignmentId, criterionGrades } = req.body;
    const newGroupReview = await groupReviewService.addGroupReview(userId, assignmentId, criterionGrades);
    return res.status(200).json({
        status: "Success",
        data: newGroupReview
    });
});

// update a group review on a submission
export const updateGroupReview = asyncErrorHandler(async (req, res) => {
    const userId = req.user.userId;
    const {reviewId, criterionGrades } = req.body;
    const updatedGroupReview = await groupReviewService.updateGroupReview(userId, reviewId, criterionGrades);
    return res.status(200).json({
        status: "Success",
        data: updatedGroupReview
    });
});

// delete a group review on a submission
export const deleteGroupReview = asyncErrorHandler(async (req, res) => {
    const userId = req.user.userId;
    const reviewId = req.body.reviewId;
    const deletedGroupReview = await groupReviewService.deleteGroupReview(userId, reviewId);
    return res.status(200).json({
        status: "Success",
        data: deletedGroupReview
    });
});

export default {
    getGroupReviews,
    createGroupReviewRubric,
    addGroupReview,
    updateGroupReview,
    deleteGroupReview
};