// Import necessary modules and services
import express from "express";
import studentService from "../services/studentService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

// Controller methods for student operations

export const getStudentAssignment = asyncErrorHandler(async (req, res) => {
	const studentId = req.user.userId;
	const studentData = await studentService.getStudentAssignment(studentId);
	return res.status(200).json({
		status: "Success",
		data: studentData
	});
});


export const getClassesHavingStudent = asyncErrorHandler(async (req, res) => {
	const studentId = req.user.userId;
	const classes = await studentService.getClassesHavingStudent(studentId);
	return res.status(200).json({
		status: "Success",
		data: classes
	});
});

export const getClassById = asyncErrorHandler(async (req, res) => {
	const classId = req.params.classId;
	const classData = await studentService.getClassById(classId);
	return res.status(200).json({
		status: "Success",
		data: classData
	});
});

export const getAssignment = asyncErrorHandler(async (req, res) => {
	const { studentId } = req.user.userId;
	const { assignmentId } = req.body;
	const assignmentData = await studentService.getAssignment(studentId, assignmentId);
	return res.status(200).json({
		status: "Success",
		data: assignmentData
	});
});

export const getClassAssignment = asyncErrorHandler(async (req, res) => {
	const { studentId } = req.user.userId;
	const { classId } = req.body;
	const assignmentData = await studentService.getClassAssignment(studentId, classId);
	return res.status(200).json({
		status: "Success",
		data: assignmentData
	});
});




// Controller methods for rubrics operations

export const getRubricsInAssignment = asyncErrorHandler(async (req, res) => {
	const { assignmentId } = req.body;
	const rubricData = await studentService.getRubricsForAssignment(assignmentId);
	return res.status(200).json({
		status: "Success",
		data: rubricData
	});
});

// Controller methods for criterion operations

export const getCriterionInRubric = asyncErrorHandler(async (req, res) => {
	const { rubricId } = req.body;
	const criterionData = await studentService.getCriterionForRubric(
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
	const updatedClass = await studentService.createCriterionForRubric(
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
	const updatedClass = await studentService.deleteCriterionForRubric(
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
	const updatedClass = await studentService.updateCriterionForRubric(
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
	const criterionData = await studentService.getCriterionForRubric(
		rubricId
	);
	return res.status(200).json({
		status: "Success",
		data: criterionData
	});
});


export const updateGroupInClass = asyncErrorHandler(async (req, res) => {
	const studentId = req.user.userId;
	const { groupId, groupName, groupDescription } = req.body;
	const updatedClass = await studentService.updateGroupInClass(studentId, groupId, groupName, groupDescription);
	return res.status(200).json({
		status: "Success",
		message: "Group successfully updated in class",
		data: updatedClass
	});
});

export const getGroupInClass = asyncErrorHandler(async (req, res) => {
	const { classId, groupId } = req.body;
	const groupData = await studentService.getGroupInClass(classId, groupId);
	return res.status(200).json({
		status: "Success",
		data: groupData
	});
});

export const getGroupsInClass = asyncErrorHandler(async (req, res) => {
	const { classId } = req.body;
	const groupData = await studentService.getGroupsInClass(classId);
	return res.status(200).json({
		status: "Success",
		data: groupData
	});
});

export const getGroupMembers = asyncErrorHandler(async (req, res) => {
	const { groupId } = req.body;
	const groupMembers = await studentService.getGroupMembers(groupId);
	return res.status(200).json({
		status: "Success",
		data: groupMembers
	});
});



// Export all controller methods
export default {
	getClassesHavingStudent,
	getClassById,

	getAssignment,
    getStudentAssignment,
	getClassAssignment,

	getRubricsInAssignment,

	getCriterionInRubric,

	addCriterionGrade,
	removeCriterionGrade,
	updateCriterionGrade,
	getCriterionGrade,

	updateGroupInClass,
	getGroupInClass,
	getGroupsInClass,
	getGroupMembers
};
