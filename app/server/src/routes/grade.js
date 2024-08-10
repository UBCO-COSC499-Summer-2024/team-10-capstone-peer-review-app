/**
 * @module routes/grade
 * @file This file defines the routes for grading operations.
 */
import express from "express";
import {  
  getGrades,
  getSubmissionGrade,
  createGrade,
  updateGrade,
  deleteGrade
} from "../controllers/gradeController.js";

const router = express.Router();

/**
 * @route GET /grade
 * @desc Get grades for a specific student
 * @function getGrades
 * @returns {JSON} The response object with the grades
 */
router.get("/", (req, res) => {
  res.status(200).send("Grade route is working!");
});

/**
 * @route GET /grade/grades
 * @desc Get grades for a specific student
 * @function getGrades
 * @returns {JSON} The response object with the grades
 */
router.get("/grades", getGrades);

/**
 * @route GET /grade/submissionGrade
 * @desc Get grade for a specific submission
 * @function getSubmissionGrade
 * @param {Object} req - The request object containing the submissionId in the body
 * @returns {JSON} The response object with the grade
 */
router.get("/submissionGrade", getSubmissionGrade);

/**
 * @route POST /grade/createGrade
 * @desc Create a new criterion grade
 * @function createGrade
 * @param {Object} req - The request object containing the criterion grade in the body
 * @returns {JSON} The response object with the newly created criterion grade
 */
router.post("/createGrade", createGrade);

/**
 * @route PUT /grade/updateGrade
 * @desc Update a criterion grade
 * @function updateGrade
 * @param {Object} req - The request object containing the updated criterion grade in the body
 * @returns {JSON} The response object with the updated criterion grade
 */
router.put("/updateGrade", updateGrade);

/**
 * @route DELETE /grade/deleteGrade
 * @desc Delete a criterion grade
 * @function deleteGrade
 * @param {Object} req - The request object containing the gradeId in the body
 * @returns {JSON} The response object with a message indicating success or failure
 */
router.delete("/deleteGrade", deleteGrade);



export default router;