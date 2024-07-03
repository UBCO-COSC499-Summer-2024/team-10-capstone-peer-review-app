// Import necessary modules and services
import express from "express";
import submitService from "../services/submitService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

// Controller methods for submit operations

export const getStudentSubmission = asyncErrorHandler(async (req, res) => {
    const studentId = req.user.userId;
    const studentData = await submitService.getStudentSubmission(studentId);
    return res.status(200).json({
        status: "Success",
        data: studentData
    });
});

export const getSubmissionsForAssignment = asyncErrorHandler(async (req, res) => {
    const assignmentId = req.body.assignmentId;
    const assignmentData = await submitService.getSubmissionsForAssignment(assignmentId);
    return res.status(200).json({
        status: "Success",
        data: assignmentData
    });
});

export const createSubmission = asyncErrorHandler(async (req, res) => {
    const studentId = req.user.userId;
    const { assignmentId, submissionFilePath } = req.body;
    const newSubmission = await submitService.createSubmission(studentId, assignmentId, submissionFilePath);
    return res.status(200).json({
        status: "Success",
        data: newSubmission
    });
});

export const updateSubmission = asyncErrorHandler(async (req, res) => {
    const {submissionId, submission} = req.body;
    const updatedSubmission = await submitService.updateSubmission(submissionId, submission);
    return res.status(200).json({
        status: "Success",
        data: updatedSubmission
    });
});

export const deleteSubmission = asyncErrorHandler(async (req, res) => {
    const submissionId = req.body.submissionId;
    const deletedSubmission = await submitService.deleteSubmission(submissionId);
    return res.status(200).json({
        status: "Success",
        data: deletedSubmission
    });
});


// Export all controller methods
export default {
    getStudentSubmission,
    getSubmissionsForAssignment,
    createSubmission,
    updateSubmission,
    deleteSubmission
};
