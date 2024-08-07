/**
 * @module gradeController
 * @desc Controller methods for grading operations
 */

// Import necessary modules and services
import express from "express";
import gradeService from "../services/gradeService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

/**
 * @async
 * @function getGrades
 * @desc Get grades for a specific student
 * @param {Object} req - The request object containing the studentId if the student is still logged in
 * @returns {Object} The response object with the grades
 */
export const getGrades = asyncErrorHandler(async (req, res) => {
    const studentId = req.user.userId;
    const grades = await gradeService.getGrades(studentId);
    return res.status(200).json({
        status: "Success",
        data: grades
    });
});

/**
 * @async
 * @function getSubmissionGrade
 * @desc Get grade for a specific submission
 * @param {Object} req - The request object containing the submissionId in the body
 * @returns {Object} The response object with the grade
 */
export const getSubmissionGrade = asyncErrorHandler(async (req, res) => {
    const submissionId = req.body.submissionId;
    const grade = await gradeService.getSubmissionGrade(submissionId);
    return res.status(200).json({
        status: "Success",
        data: grade
    });
});

/**
 * @async
 * @function createGrade
 * @desc Create a new criterion grade
 * @param {Object} req - The request object containing the criterion grade in the body
 * @returns {Object} The response object with the newly created criterion grade
 */
export const createGrade = asyncErrorHandler(async (req, res) => {
    const grade = req.body;
    const newGrade = await gradeService.createGrade(grade);
    return res.status(200).json({
        status: "Success",
        data: newGrade
    });
});

/**
 * @async
 * @function updateGrade
 * @desc Update an existing grade
 * @param {Object} req - The request object containing the grade and gradeId in the body
 * @returns {Object} The response object with the updated grade
 */
export const updateGrade = asyncErrorHandler(async (req, res) => {
    const {grade, gradeId} = req.body;
    const updatedGrade = await gradeService.updateGrade(gradeId, grade);
    return res.status(200).json({
        status: "Success",
        data: updatedGrade
    });
});

/**
 * @async
 * @function deleteGrade
 * @desc Delete a grade
 * @param {Object} req - The request object containing the gradeId in the body
 * @returns {Object} The response object with the deleted grade
 */
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
