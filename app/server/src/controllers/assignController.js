/**
 * Controller methods for assignment operations.
 * @module assignController
 */
import assignService from "../services/assignService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

/**
 * Controller functions for handling assignment related requests.
 * These functions are called by the routes and handle the logic of the request.
 */

const BASE_URL = "http://localhost:8080/"; //ngix storage (replace with cloud storage once developed)

const upload = multer({ storage: multer.memoryStorage() });
const UPLOAD_PATH = "/usr/server/uploads";

/**
 * @async
 * @desc Add an assignment to a class.
 * @function addAssignmenToClass
 * @param {Object} req - Get the classId, categoryId, and assignmentData from the request object.
 * @returns {Object} - The response object containing the status, message, and new assignment data.
 */
export const addAssignmentToClass = [
	upload.single("file"),
	asyncErrorHandler(async (req, res) => {
		const classId = req.body.classId;
		const categoryId = req.body.categoryId;
		const assignmentData = JSON.parse(req.body.assignmentData);

		console.log('Received assignment data:', assignmentData);  // Add this line for debugging

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
			fileUrl = `${BASE_URL}/${uniqueFilename}`;
		}

		const newAssignment = await assignService.addAssignmentToClass(
			classId,
			categoryId,
			{
				...assignmentData,
				assignmentFilePath: fileUrl,
				rubricId: assignmentData.rubricId,  // Ensure this is passed correctly
				allowedFileTypes: assignmentData.allowedFileTypes,  
			}
		);

		if (newAssignment) {
			return res.status(200).json({
				status: "Success",
				message: "Assignment successfully added to class and category",
				data: newAssignment
			});
		} else {
			return res.status(500).json({
				status: "Error",
				message: "Failed to add assignment to class and category"
			});
		}
	})
];

/**
 * @async
 * @desc Remove an assignment from a class.
 * @function removeAssignmentFromClass
 * @param {Object} req - Get the assignmentId from the body.
 * @returns {Object} - The response object containing the status, message, and data.
 */
export const removeAssignmentFromClass = asyncErrorHandler(async (req, res) => {
	const { assignmentId } = req.body;
	try {
		const deletedAssignment = await assignService.removeAssignmentFromClass(assignmentId);
		return res.status(200).json({
			status: "Success",
			message: "Assignment successfully removed from class",
			data: deletedAssignment
		});
	} catch (error) {
		console.error("Error in removeAssignmentFromClass controller:", error);
		return res.status(error.statusCode || 500).json({
			status: "Error",
			message: error.message || "An unexpected error occurred"
		});
	}
});

/**
 * @async
 * @desc Update an assignment in a class.
 * @function updateAssignmentInClass
 * @param {Object} req - Get the classId, assignmentId, categoryId, and assignmentData from the body.
 * @returns {Object} - The response object containing the status, message, and data.
 */
export const updateAssignmentInClass = [
	upload.single("file"),
	asyncErrorHandler(async (req, res) => {
	  const classId = req.body.classId;
	  const assignmentId = req.body.assignmentId;
	  const categoryId = req.body.categoryId;
	  const assignmentData = JSON.parse(req.body.assignmentData);
  
	  console.log('Received assignment data for update:', assignmentData);  // Add this line for debugging
  
	  let fileUrl = null;
	  if (req.file) {
		const uniqueFilename = `${uuidv4()}${path.extname(req.file.originalname)}`;
		const filePath = path.join(UPLOAD_PATH, uniqueFilename);
  
		// Ensure the upload directory exists
		fs.mkdirSync(UPLOAD_PATH, { recursive: true });
  
		// Write the file to the shared volume
		fs.writeFileSync(filePath, req.file.buffer);
  
		// Construct the URL that Nginx will serve
		fileUrl = `${BASE_URL}/${uniqueFilename}`;
	  }
  
	  const updatedAssignment = await assignService.updateAssignmentInClass(
		classId,
		assignmentId,
		categoryId,
		{
			...assignmentData,
			assignmentFilePath: fileUrl || assignmentData.assignmentFilePath,
			rubricId: assignmentData.rubricId,
			allowedFileTypes: assignmentData.allowedFileTypes,
		}
	})
];

/**
 * @async
 * @desc Get an assignment in a class.
 * @function getAssignmentInClass
 * @param {Object} req - Get the classId and assignmentId from the body.
 * @returns {Object} - The response object containing the status and data.
 */
export const getAssignmentInClass = asyncErrorHandler(async (req, res) => {
	const { classId, assignmentId } = req.body;
	const assignmentData = await assignService.getAssignmentInClass(
		classId,
		assignmentId,
		req.user.userId
	);
	return res.status(200).json({
		status: "Success",
		data: assignmentData
	});
});

/**
 * @async
 * @desc Get all assignments.
 * @function getAllAssignments
 * @returns {Object} - The response object containing the status and assignments.
 */
export const getAllAssignments = asyncErrorHandler(
	async (req, res) => {
		const assignments = await assignService.getAllAssignments();
		return res.status(200).json({
			status: "Success",
			data: assignments
		});
	}
);

/**
 * @async
 * @desc Get all assignments by class ID.
 * @function getAllAssignmentsByClassId
 * @param {Object} req - The request object containing the class ID and the logged-in user ID.
 * @returns {Object} - The response object containing the status and assignment objects.
 */
export const getAllAssignmentsByClassId = asyncErrorHandler(
	async (req, res) => {
		const { classId } = req.body;
		const assignments = await assignService.getAllAssignmentsByClassId(classId, req.user.userId);
		return res.status(200).json({
			status: "Success",
			data: assignments
		});
	}
);

/**
 * @async
 * @desc Extend the deadline for a student.
 * @function extendDeadlineForStudent
 * @param {Object} req - get the studentId, assignmentId, and newDueDate from the body.
 * @returns {Object} - The response object containing the status, message, and updated assignment data.
 */
export const extendDeadlineForStudent = asyncErrorHandler(async (req, res) => {
	const { studentId, assignmentId, newDueDate } = req.body;
	const updatedAssignment = await assignService.extendDeadlineForStudent(
		studentId,
		assignmentId,
		newDueDate
	);
	return res.status(200).json({
		status: "Success",
		message: "Deadline successfully extended for student",
		data: updatedAssignment
	});
});

/**
 * @async
 * @desc Delete the extended deadline for a student.
 * @function deleteExtendedDeadlineForStudent
 * @param {Object} req - Get the studentId and assignmentId from the body.
 * @returns {Object} - The response object containing the status, message, and deleted extension confirmation.
 */
export const deleteExtendedDeadlineForStudent = asyncErrorHandler(async (req, res) => {
	const { studentId, assignmentId } = req.body;
	const deletedExtension = await assignService.deleteExtendedDeadlineForStudent(
		studentId,
		assignmentId
	);
	return res.status(200).json({
		status: "Success",
		message: "Extended deadline successfully deleted",
		data: deletedExtension
	});
});

/**
 * @async
 * @desc Add an assignment with a rubric.
 * @function addAssignmentWithRubric
 * @param {Object} req - Get the classId, categoryId, assignmentData, rubricData, and creatorId from the body.
 * @returns {Object} - The response object containing the status, message, and data.
 */
export const addAssignmentWithRubric = [
	upload.single("file"),
	asyncErrorHandler(async (req, res) => {
		const classId = req.body.classId;
		const categoryId = req.body.categoryId;
		const assignmentData = JSON.parse(req.body.assignmentData);
		const rubricData = JSON.parse(req.body.rubricData);
		const creatorId = req.body.creatorId;

		console.log('Received data in controller:', { classId, categoryId, assignmentData, rubricData, creatorId });

		let fileUrl = null;
		if (req.file) {
			// Handle file upload similar to addAssignmentToClass
			const uniqueFilename = `${uuidv4()}${path.extname(req.file.originalname)}`;
			const filePath = path.join(UPLOAD_PATH, uniqueFilename);
			fs.mkdirSync(UPLOAD_PATH, { recursive: true });
			fs.writeFileSync(filePath, req.file.buffer);
			fileUrl = `${BASE_URL}/${uniqueFilename}`;
		}

		const result = await assignService.addAssignmentWithRubric(
			classId,
			categoryId,
			{ ...assignmentData, assignmentFilePath: fileUrl },
			rubricData,
			creatorId
		);

		return res.status(200).json({
			status: "Success",
			message: "Assignment and rubric successfully added",
			data: result
		});
	})
];

// Export all controller methods
export default {
	addAssignmentToClass,
	removeAssignmentFromClass,
	updateAssignmentInClass,
	getAssignmentInClass,
	getAllAssignments,
	getAllAssignmentsByClassId,
	extendDeadlineForStudent,
	deleteExtendedDeadlineForStudent,
	addAssignmentWithRubric
};
