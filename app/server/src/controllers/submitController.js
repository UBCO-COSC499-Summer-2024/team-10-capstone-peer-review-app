import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import submitService from "../services/submitService.js";

const BASE_URL = "http://localhost:8080/submissions/"; // nginx storage (replace with cloud storage once developed)
const UPLOAD_PATH = '/usr/server/uploads/submissions';

const upload = multer({ storage: multer.memoryStorage() });

export const createSubmission = [
    upload.single('file'),
    asyncErrorHandler(async (req, res) => {
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

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

        const newSubmission = await submitService.createSubmission(studentId, assignmentId, fileUrl);
        
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


export const getStudentSubmission = asyncErrorHandler(async (req, res) => {
	const studentId = req.user.userId;
	const studentData = await submitService.getStudentSubmission(studentId);
	return res.status(200).json({
		status: "Success",
		data: studentData
	});
});

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

export const createSubmission = asyncErrorHandler(async (req, res) => {
	const studentId = req.user.userId;
	const { assignmentId, submissionFilePath } = req.body;
	const newSubmission = await submitService.createSubmission(
		studentId,
		assignmentId,
		submissionFilePath
	);
	return res.status(200).json({
		status: "Success",
		data: newSubmission
	});
});

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
