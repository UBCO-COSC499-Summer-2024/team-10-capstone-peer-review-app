// Import necessary modules and services
import classService from "../services/classService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

// Controller methods for class operations

export const getClassById = asyncErrorHandler(async (req, res) => {
	const classId = req.params.classId;
	const classData = await classService.getClassById(classId);
	return res.status(200).json({
		status: "Success",
		data: classData
	});
});

export const createClass = asyncErrorHandler(async (req, res) => { 
    const instructorId = req.user.userId
    console.log(instructorId);
	const classInfo = req.body;
	const newClass = await classService.createClass(classInfo, instructorId);
	return res.status(201).json({
		status: "Success",
		message: "Class successfully created",
		data: newClass
	});
});

export const updateClass = asyncErrorHandler(async (req, res) => {
	const classId = req.params.classId;
	const updateData = req.body;
	const updatedClass = await classService.updateClass(classId, updateData);
	return res.status(200).json({
		status: "Success",
		message: "Class successfully updated",
		data: updatedClass
	});
});

export const deleteClass = asyncErrorHandler(async (req, res) => {
	const classId = req.params.classId;
	await classService.deleteClass(classId);
	return res.status(200).json({
		status: "Success",
		message: "Class successfully deleted"
	});
});

export const addStudentToClass = asyncErrorHandler(async (req, res) => {
	const { classId, studentId } = req.body;
	const updatedClass = await classService.addStudentToClass(classId, studentId);
	return res.status(200).json({
		status: "Success",
		message: "Student successfully added to class",
		data: updatedClass
	});
});

export const removeStudentFromClass = asyncErrorHandler(async (req, res) => {
	const { classId, studentId } = req.body;
	const updatedClass = await classService.removeStudentFromClass(
		classId,
		studentId
	);
	return res.status(200).json({
		status: "Success",
		message: "Student successfully removed from class",
		data: updatedClass
	});
});

// Export all controller methods
export default {
	getClassById,
	createClass,
	updateClass,
	deleteClass,
	addStudentToClass,
	removeStudentFromClass
};
