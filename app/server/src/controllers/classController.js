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

// Controller methods for class operations involving students
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

// Controller methods for assignment operations

export const addAssignmentToClass = asyncErrorHandler(async (req, res) => {
	const { classId, assignmentData } = req.body;
	const updatedClass = await classService.addAssignmentToClass(classId,assignmentData);
	return res.status(200).json({
		status: "Success",
		message: "Assignment successfully added to class",
		data: updatedClass
	});
});

export const removeAssignmentFromClass = asyncErrorHandler(async (req, res) => {
	const { assignmentId } = req.body;
	const updatedClass = await classService.removeAssignmentFromClass(assignmentId);
	return res.status(200).json({
		status: "Success",
		message: "Assignment successfully removed from class",
		data: updatedClass
	});
});

export const updateAssignmentInClass = asyncErrorHandler(async (req, res) => {
	const { classId, assignmentId, updateData } = req.body;
	const updatedClass = await classService.updateAssignmentInClass(
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
	const assignmentData = await classService.getAssignmentInClass(
		classId,
		assignmentId
	);
	return res.status(200).json({
		status: "Success",
		data: assignmentData
	});
});

// Controller methods for rubrics operations

export const addRubricsToAssignment = asyncErrorHandler(async (req, res) => {
	const creatorId = req.user.userId;
	const {assignmentId, rubricData } = req.body;
	const updatedClass = await classService.createRubricsForAssignment(
		creatorId,
		assignmentId,
		rubricData
	);
	return res.status(200).json({
		status: "Success",
		message: "Rubric successfully added to assignment",
		data: updatedClass
	});
});

export const removeRubricsFromAssignment = asyncErrorHandler(async (req, res) => {
	const { rubricId } = req.body;
	const updatedClass = await classService.deleteRubricsForAssignment(rubricId);
	return res.status(200).json({
		status: "Success",
		message: "Rubric successfully removed from assignment",
		data: updatedClass
	});
});

export const updateRubricsInAssignment = asyncErrorHandler(async (req, res) => {
	const { rubricId, updateData } = req.body;
	const updatedClass = await classService.updateRubricsForAssignment(
		rubricId,
		updateData
	);
	return res.status(200).json({
		status: "Success",
		message: "Rubric successfully updated in assignment",
		data: updatedClass
	});
});	

export const getRubricsInAssignment = asyncErrorHandler(async (req, res) => {
	const { assignmentId } = req.body;
	const rubricData = await classService.getRubricsForAssignment(assignmentId);
	return res.status(200).json({
		status: "Success",
		data: rubricData
	});
});

// Controller methods for criterion operations
export const addCriterionToRubric = asyncErrorHandler(async (req, res) => {
	const { rubricId, criterionData } = req.body;
	const updatedClass = await classService.createCriterionForRubric(
		rubricId,
		criterionData
	);
	return res.status(200).json({
		status: "Success",
		message: "Criterion successfully added to rubric",
		data: updatedClass
	});
});

export const removeCriterionFromRubric = asyncErrorHandler(async (req, res) => {
	const { criterionId } = req.body;
	const updatedClass = await classService.deleteCriterionForRubric(
		criterionId
	);
	return res.status(200).json({
		status: "Success",
		message: "Criterion successfully removed from rubric",
		data: updatedClass
	});
});

export const updateCriterionInRubric = asyncErrorHandler(async (req, res) => {
	const { criterionId, updateData } = req.body;
	const updatedClass = await classService.updateCriterionForRubric(
		criterionId,
		updateData
	);
	return res.status(200).json({
		status: "Success",
		message: "Criterion successfully updated in rubric",
		data: updatedClass
	});
});

export const getCriterionInRubric = asyncErrorHandler(async (req, res) => {
	const { rubricId } = req.body;
	const criterionData = await classService.getCriterionForRubric(
		rubricId
	);
	return res.status(200).json({
		status: "Success",
		data: criterionData
	});
});

// Controller methods for criterion Grade operations
export const addCriterionGrade = asyncErrorHandler(async (req, res) => {
	const { rubricId, criterionData } = req.body;
	const updatedClass = await classService.createCriterionForRubric(
		rubricId,
		criterionData
	);
	return res.status(200).json({
		status: "Success",
		message: "Criterion successfully added to rubric",
		data: updatedClass
	});
});

export const removeCriterionGrade = asyncErrorHandler(async (req, res) => {
	const { criterionId } = req.body;
	const updatedClass = await classService.deleteCriterionForRubric(
		criterionId
	);
	return res.status(200).json({
		status: "Success",
		message: "Criterion successfully removed from rubric",
		data: updatedClass
	});
});

export const updateCriterionGrade = asyncErrorHandler(async (req, res) => {
	const { criterionId, updateData } = req.body;
	const updatedClass = await classService.updateCriterionForRubric(
		criterionId,
		updateData
	);
	return res.status(200).json({
		status: "Success",
		message: "Criterion successfully updated in rubric",
		data: updatedClass
	});
});

export const getCriterionGrade = asyncErrorHandler(async (req, res) => {
	const { rubricId } = req.body;
	const criterionData = await classService.getCriterionForRubric(
		rubricId
	);
	return res.status(200).json({
		status: "Success",
		data: criterionData
	});
});

// Export all controller methods
export default {
	getClassById,
	createClass,
	updateClass,
	deleteClass,
	
	addStudentToClass,
	removeStudentFromClass,

	addAssignmentToClass,
	removeAssignmentFromClass,
	updateAssignmentInClass,
	getAssignmentInClass,

	addRubricsToAssignment,
	removeRubricsFromAssignment,
	updateRubricsInAssignment,
	getRubricsInAssignment,

	addCriterionToRubric,
	removeCriterionFromRubric,
	updateCriterionInRubric,
	getCriterionInRubric,

	addCriterionGrade,
	removeCriterionGrade,
	updateCriterionGrade,
	getCriterionGrade
};
