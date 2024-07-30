/**
 * @module studentController
 * @desc Controller methods for student operations, rubrics operations, criterion operations, and criterion grade operations.
 */

import express from "express";
import studentService from "../services/studentService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

/**
 * @async
 * @function getStudentAssignment
 * @desc Get the assignment of a student.
 * @param {Object} req - The request object contains the studentId when the user is logged in
 * @returns {Object} The assignment data of the student.
 */
export const getStudentAssignment = asyncErrorHandler(async (req, res) => {
	const studentId = req.user.userId;
	const studentData = await studentService.getStudentAssignment(studentId);
	return res.status(200).json({
		status: "Success",
		data: studentData
	});
});

/**
 * @async
 * @function getClassesHavingStudent
 * @desc Get the classes in which a student is enrolled.
 * @param {Object} req - The request object contains the studentId when the user is logged in
 * @returns {Object} The classes in which the student is enrolled.
 */
export const getClassesHavingStudent = asyncErrorHandler(async (req, res) => {
	const studentId = req.user.userId;
	const classes = await studentService.getClassesHavingStudent(studentId);
	return res.status(200).json({
		status: "Success",
		data: classes
	});
});

/**
 * @async
 * @function getClassById
 * @desc Get a class by its ID.
 * @param {Object} req - The request object contains the classId in the parameters.
 * @returns {Object} The class data.
 */
export const getClassById = asyncErrorHandler(async (req, res) => {
	const classId = req.params.classId;
	const classData = await studentService.getClassById(classId);
	return res.status(200).json({
		status: "Success",
		data: classData
	});
});

/**
 * @async
 * @function getAssignment
 * @desc Get an assignment by student ID and assignment ID.
 * @param {Object} req - The request object contains the studentId if the user is logged in and assignmentId.
 * @returns {Object} The assignment data.
 */
export const getAssignment = asyncErrorHandler(async (req, res) => {
	const { studentId } = req.user.userId;
	const { assignmentId } = req.body;
	const assignmentData = await studentService.getAssignment(studentId, assignmentId);
	return res.status(200).json({
		status: "Success",
		data: assignmentData
	});
});

/**
 * @async
 * @function getClassAssignment
 * @desc Get an assignment by student ID and class ID.
 * @param {Object} req - The request object contains the studentId if the user is logged in and classId.
 * @returns {Object} The assignment data.
 */
export const getClassAssignment = asyncErrorHandler(async (req, res) => {
	const { studentId } = req.user.userId;
	const { classId } = req.body;
	const assignmentData = await studentService.getClassAssignment(studentId, classId);
	return res.status(200).json({
		status: "Success",
		data: assignmentData
	});
});

/**
 * @async
 * @function getRubricsInAssignment
 * @desc Get the rubrics for an assignment.
 * @param {Object} req - The request object contains the assignmentId.
 * @returns {Object} The rubric data.
 */
export const getRubricsInAssignment = asyncErrorHandler(async (req, res) => {
	const { assignmentId } = req.body;
	const rubricData = await studentService.getRubricsForAssignment(assignmentId);
	return res.status(200).json({
		status: "Success",
		data: rubricData
	});
});

/**
 * @async
 * @function getCriterionInRubric
 * @desc Get the criterion for a rubric.
 * @param {Object} req - The request object contains the rubricId.
 * @returns {Object} The criterion data.
 */
export const getCriterionInRubric = asyncErrorHandler(async (req, res) => {
	const { rubricId } = req.body;
	const criterionData = await studentService.getCriterionForRubric(rubricId);
	return res.status(200).json({
		status: "Success",
		data: criterionData
	});
});

/**
 * @async
 * @function addCriterionGrade
 * @desc Add a criterion grade to a rubric.
 * @param {Object} req - The request object contains the rubricId and criterion data.
 * @returns {Object} The updated class data.
 */
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

/**
 * @async
 * @function removeCriterionGrade
 * @desc Remove a criterion grade from a rubric.
 * @param {Object} req - The request object contains the criterionId.
 * @returns {Object} The updated class data.
 */
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

/**
 * @async
 * @function updateCriterionGrade
 * @desc Update a criterion grade in a rubric.
 * @param {Object} req - The request object contains the criterionId and update data.
 * @returns {Object} The updated class data.
 */
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

/**
 * @async
 * @function getCriterionGrade
 * @desc Get the criterion grade for a rubric.
 * @param {Object} req - The request object contains the rubricId.
 * @returns {Object} The criterion data.
 */
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

/**
 * @async
 * @function updateGroupInClass
 * @desc Update a group in a class.
 * @param {Object} req - The request object contains the studentId if the student is logged in, groupId, groupName, and groupDescription.
 * @returns {Object} The updated class data.
 */
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

/**
 * @async
 * @function getGroupInClass
 * @desc Get a group in a class.
 * @param {Object} req - The request object contains the classId and groupId
 * @returns {Object} The group data.
 */
export const getGroupInClass = asyncErrorHandler(async (req, res) => {
	const { classId, groupId } = req.body;
	const groupData = await studentService.getGroupInClass(classId, groupId);
	return res.status(200).json({
		status: "Success",
		data: groupData
	});
});

/**
 * @async
 * @function getGroupsInClass
 * @desc Get all groups in a class.
 * @param {Object} req - The request object contains the classId.
 * @returns {Object} The group data.
 */
export const getGroupsInClass = asyncErrorHandler(async (req, res) => {
	const { classId } = req.body;
	const groupData = await studentService.getGroupsInClass(classId);
	return res.status(200).json({
		status: "Success",
		data: groupData
	});
});

/**
 * @async
 * @function getGroupMembers
 * @desc Get the members of a group.
 * @param {Object} req - The request object contains the groupId.
 * @returns {Object} The group members data.
 */
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
