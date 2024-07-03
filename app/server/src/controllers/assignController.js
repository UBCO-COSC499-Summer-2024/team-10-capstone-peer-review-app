<<<<<<< HEAD
=======
// Import necessary modules and services
>>>>>>> 60997510de8fb8f6d28253204ccc1f8e2b1da667
import assignService from "../services/assignService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

// Controller methods for assignment operations
export const addAssignmentToClass = asyncErrorHandler(async (req, res) => {
	const { classId, assignmentData } = req.body;
	const updatedClass = await assignService.addAssignmentToClass(
		classId,
		assignmentData
	);
	return res.status(200).json({
		status: "Success",
		message: "Assignment successfully added to class",
		data: updatedClass
	});
});

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
