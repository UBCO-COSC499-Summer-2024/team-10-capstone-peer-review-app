import assignService from "../services/assignService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const BASE_URL = "http://localhost:8080/"; //ngix storage (replace with cloud storage once developed)

const upload = multer({ storage: multer.memoryStorage() });
const UPLOAD_PATH = "/usr/server/uploads";

export const addAssignmentToClass = [
	upload.single("file"), // Handle single file upload

	asyncErrorHandler(async (req, res) => {
		const classId = req.body.classId;
		const categoryId = req.body.categoryId;
		const assignmentData = JSON.parse(req.body.assignmentData);

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
				assignmentFilePath: fileUrl // Add file URL to assignment data
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

export const removeAssignmentFromClass = asyncErrorHandler(async (req, res) => {
	const { assignmentId } = req.body;
	const updatedClass =
		await assignService.removeAssignmentFromClass(assignmentId);
	return res.status(200).json({
		status: "Success",
		message: "Assignment successfully removed from class",
		data: updatedClass
	});
});

export const updateAssignmentInClass = asyncErrorHandler(async (req, res) => {
	const { classId, assignmentId, updateData } = req.body;
	const updatedClass = await assignService.updateAssignmentInClass(
		classId,
		assignmentId,
		updateData
	);
	return res.status(200).json({
		status: "Success",
		message: "Assignment successfully updated in class",
		data: updatedClass
	});
});

export const getAssignmentInClass = asyncErrorHandler(async (req, res) => {
	const { classId, assignmentId } = req.body;
	const assignmentData = await assignService.getAssignmentInClass(
		classId,
		assignmentId
	);
	return res.status(200).json({
		status: "Success",
		data: assignmentData
	});
});

export const getAllAssignmentsByClassId = asyncErrorHandler(
	async (req, res) => {
		const { classId } = req.body;
		const assignments = await assignService.getAllAssignmentsByClassId(classId);
		return res.status(200).json({
			status: "Success",
			data: assignments
		});
	}
);

// Export all controller methods
export default {
	addAssignmentToClass,
	removeAssignmentFromClass,
	updateAssignmentInClass,
	getAssignmentInClass,
	getAllAssignmentsByClassId
};
