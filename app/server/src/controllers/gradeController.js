// Import necessary modules and services
import express from "express";
import gradeService from "../services/gradeService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

// Controller methods for grading operations

export const getGrades = asyncErrorHandler(async (req, res) => {
    const studentId = req.user.userId;
    const grades = await gradeService.getGrades(studentId);
    return res.status(200).json({
        status: "Success",
        data: grades
    });
});

export const getSubmissionGrade = asyncErrorHandler(async (req, res) => {
    const submissionId = req.body.submissionId;
    const grade = await gradeService.getSubmissionGrade(submissionId);
    return res.status(200).json({
        status: "Success",
        data: grade
    });
});

export const createGrade = asyncErrorHandler(async (req, res) => {
    const grade = req.body;
    const newGrade = await gradeService.createGrade(grade);
    return res.status(200).json({
        status: "Success",
        data: newGrade
    });
});

export const updateGrade = asyncErrorHandler(async (req, res) => {
    const {grade, gradeId} = req.body;
    const updatedGrade = await gradeService.updateGrade(gradeId, grade);
    return res.status(200).json({
        status: "Success",
        data: updatedGrade
    });
});

export const deleteGrade = asyncErrorHandler(async (req, res) => {
    const gradeId = req.body.gradeId;
    const deletedGrade = await gradeService.deleteGrade(gradeId);
    return res.status(200).json({
        status: "Success",
        data: deletedGrade
    });
});

// Export all controller methods
export default {
    getGrades,
    getSubmissionGrade,
    createGrade,
    updateGrade,
    deleteGrade
};
