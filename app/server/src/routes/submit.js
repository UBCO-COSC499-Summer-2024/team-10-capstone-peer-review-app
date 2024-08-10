/**
 * @module submit.js
 * @fileoverview This file contains the routes for the submission of assignments.
 */
import express from "express";
import {
  getStudentSubmission,
  getSubmissionsForAssignment,
  createSubmission,
  updateSubmission,
  deleteSubmission
} from "../controllers/submitController.js";

import { ensureInstructorOrAdmin } from "../middleware/ensureUserTypes.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Submit route is working!");
});

/**
 * @route POST /submit/studentSubmissions
 * @desc Get all submissions for a student
 * @function getStudentSubmission
 * @param {Object} req - The request object containing the studentId
 * @returns {Object} - The response object with the submission data
 */
router.post("/studentSubmissions", getStudentSubmission);
/**
 * @route POST /submit/studentSubmissionsForAssignment
 * @desc Get all submissions for a student for a specific assignment
 * @function getStudentSubmissionForAssignment
 * @param {Object} req - The request object containing the studentId and assignmentId
 * @returns {Object} - The response object with the submission data
 */
router.post("/studentSubmissionsForAssignment", getSubmissionsForAssignment);

/**
 * @route POST /submit/submissionsForAssignment
 * @desc Get all submissions for a specific assignment
 * @function getSubmissionsForAssignment
 * @param {Object} req - The request object containing the assignmentId
 * @returns {Object} - The response object with the submission data
 */
router.post("/submissionsForAssignment", getSubmissionsForAssignment);

/**
 * @route POST /submit/createSubmission
 * @desc Create a submission
 * @function createSubmission
 * @param {Object} req - The request object containing the submission data
 * @returns {Object} - The response object
 */
router.post("/createSubmission", createSubmission);

/**
 * @route PUT /submit/updateSubmission
 * @desc Update a submission
 * @function updateSubmission
 * @param {Object} req - The request object containing the submissionId and submission data
 * @returns {Object} - The response object
 */
router.put("/updateSubmission", updateSubmission);

/**
 * @route DELETE /submit/deleteSubmission
 * @desc Delete a submission
 * @param {Object} req - The request object containing the submissionId
 * @function deleteSubmission
 * @returns {Object} - The response object
 */
router.delete("/deleteSubmission", ensureInstructorOrAdmin, deleteSubmission);


export default router;