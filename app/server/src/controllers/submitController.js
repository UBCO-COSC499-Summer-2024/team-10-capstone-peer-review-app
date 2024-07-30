/**
 * @module submitController
 * @desc Controller for handling submission-related operations
 */

import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import submitService from "../services/submitService.js";

const BASE_URL = "http://localhost:8080/submissions/"; // nginx storage (replace with cloud storage once developed)
const UPLOAD_PATH = "/usr/server/uploads/submissions";

const upload = multer({ storage: multer.memoryStorage() });

/**
 * @async
 * @desc Create a new submission for a student for a specific assignment, with a file upload (file is required for submission)
 * @param {Object} req - The request object containing the studentId, assignmentId, and file
 * @function createSubmission	
 * @returns {Object} - The response object or error message when the file is not uploaded
 */
export const createSubmission = [
	upload.single("file"),
	asyncErrorHandler(async (req, res) => {
		console.log("Request headers:", req.headers);
		console.log("Request body:", req.body);
		console.log("Request file:", req.file);

		const studentId = req.body.studentId;
		const assignmentId = req.body.assignmentId;

		let fileUrl = null;
		if (req.file) {
			const uniqueFilename = `${uuidv4()}${path.extname(req.file.originalname)}`;
			console.log("uniqueFilename", uniqueFilename);
			const filePath = path.join(UPLOAD_PATH, uniqueFilename);

			// Ensure the upload directory exists
			fs.mkdirSync(UPLOAD_PATH, { recursive: true });

			// Write the file to the shared volume
			fs.writeFileSync(filePath, req.file.buffer);

			// Construct the URL that Nginx will serve
			fileUrl = `${BASE_URL}${uniqueFilename}`;
		}

		if (!fileUrl) {
			return res.status(400).json({
				status: "Error",
				message: "No file uploaded"
			});
		}

		const newSubmission = await submitService.createSubmission(
			studentId,
			assignmentId,
			fileUrl
		);

		if (newSubmission) {
			return res.status(200).json({
				status: "Success",
				message: "Submission successfully created",
				data: newSubmission
			});
		} else {
			return res.status(500).json({
				status: "Error",
				message: "Failed to create submission"
			});
		}
	})
];

/**
 * @async
 * @desc Get the submission of a student
 * @function getStudentSubmission
 * @param {Object} req - The request object containing the studentId if the student is logged in
 * @returns {Object} - The response object or error message when the studentId is not provided
 */
export const getStudentSubmission = asyncErrorHandler(async (req, res) => {
	const studentId = req.user.userId;
	if (!studentId) {
		return res.status(400).json({
			status: "Error",
			message: "userId is required"
		});
	}
	const studentData = await submitService.getStudentSubmission(studentId);
	return res.status(200).json({
		status: "Success",
		data: studentData
	});
});

/**
 * @async
 * @desc Get the submission of a student for a specific assignment
 * @param {Object} req - The request object containing the studentId if the user is logged in and assignmentId
 * @function getStudentSubmissionForAssignment
 * @returns {Object} - The response object or error message when the studentId is not provided
 */
export const getStudentSubmissionForAssignment = asyncErrorHandler(
	async (req, res) => {
		const studentId = req.body.userId;
		const assignmentId = req.body.assignmentId;
		if (!studentId) {
			return res.status(400).json({
				status: "Error",
				message: "userId is required"
			});
		}
		const studentData = await submitService.getStudentSubmissionForAssignment(
			studentId,
			assignmentId
		);
		return res.status(200).json({
			status: "Success",
			data: studentData
		});
	}
);

/**
 * @async
 * @desc Get all submissions for a specific assignment
 * @param {Object} req - The request object containing the assignmentId
 * @function getSubmissionsForAssignment
 * @returns {Object} - The response object
 */
export const getSubmissionsForAssignment = asyncErrorHandler(
	async (req, res) => {
		const assignmentId = req.body.assignmentId;
		const assignmentData =
			await submitService.getSubmissionsForAssignment(assignmentId);
		return res.status(200).json({
			status: "Success",
			data: assignmentData
		});
	}
);

/**
 * @async
 * @desc Update a submission
 * @function updateSubmission
 * @param {Object} req - The request object containing the submissionId and submission data
 * @returns {Object} - The response object
 */
export const updateSubmission = asyncErrorHandler(async (req, res) => {
	const { submissionId, submission } = req.body;
	const updatedSubmission = await submitService.updateSubmission(
		submissionId,
		submission
	);
	return res.status(200).json({
		status: "Success",
		data: updatedSubmission
	});
});

/**
 * @async
 * @desc Delete a submission
 * @param {Object} req - The request object containing the submissionId
 * @function deleteSubmission
 * @returns {Object} - The response object
 */
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
	getStudentSubmissionForAssignment,
	createSubmission,
	updateSubmission,
	deleteSubmission
};
