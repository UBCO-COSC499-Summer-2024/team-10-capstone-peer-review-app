import assignService from "../services/assignService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import multer from 'multer';

// Configure Multer for file upload
const upload = multer({ dest: 'uploads/' });

export const addAssignmentToClass = [
    upload.single('file'), // Handle single file upload
    asyncErrorHandler(async (req, res) => {
        const classId = req.body.classId;
		const categoryId = req.body.categoryId;
        const assignmentData = JSON.parse(req.body.assignmentData);
        const fileUrl = req.file ? `uploads/${req.file.filename}` : null; // Construct file URL

        const newAssignment = await assignService.addAssignmentToClass(classId, categoryId, {
            ...assignmentData,
            assignmentFilePath: fileUrl // Add file URL to assignment data
        });

        if (newAssignment) {
            return res.status(200).json({
                status: 'Success',
                message: 'Assignment successfully added to class and category',
                data: newAssignment
            });
        } else {
            return res.status(500).json({
                status: 'Error',
                message: 'Failed to add assignment to class and category'
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
