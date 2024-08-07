/**
 * Controller methods for class operations.
 * @module classController
 */

import classService from "../services/classService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

/**
 * @async
 * @desc Get all classes.
 * @function getAllClasses
 * @returns {Object} - The response object with the retrieved classes.
 */
export const getAllClasses = asyncErrorHandler(async (req, res) => {
	const classes = await classService.getAllClasses();
	return res.status(200).json({
		status: "Success",
		message: "Classes retrieved",
		data: classes
	});
});

/**
 * @async
 * @desc Get all classes that the user is not in.
 * @function getAllClassesUserIsNotIn
 * @param {Object} req - The request object containing the user ID if logged in.
 * @returns {Object} - The response object with the retrieved classes.
 */
export const getAllClassesUserIsNotIn = asyncErrorHandler(async (req, res) => {
	const userId = req.user.userId;
	const classes = await classService.getAllClassesUserIsNotIn(userId);
	return res.status(200).json({
		status: "Success",
		message: "Classes retrieved",
		data: classes
	});
});

/**
 * @async
 * @desc Get the instructor of a class.
 * @function getInstructorByClass
 * @param {Object} req - The request object containing the class ID in the parameters.
 * @returns {Object} - The response object with the retrieved instructor.
 */
export const getInstructorByClass = asyncErrorHandler(async (req, res) => {
	const classId = req.params.classId;
	const instructor = await classService.getInstructorByClass(classId);
	return res.status(200).json({
		status: "Success",
		message: "Instructor retrieved",
		data: instructor
	});
});

/**
 * @async
 * @desc Get the students of a class.
 * @function getStudentsByClass
 * @param {Object} req - The request object containing the class ID in the parameters.
 * @returns {Object} - The response object with the retrieved students.
 */
export const getStudentsByClass = asyncErrorHandler(async (req, res) => {
	const classId = req.params.classId;
	const students = await classService.getStudentsByClass(classId);
	return res.status(200).json({
		status: "Success",
		message: "Students retrieved",
		data: students
	});
});

/**
 * @async
 * @desc Get the classes taught by an instructor.
 * @function getClassesByInstructor
 * @param {Object} req - The request object containing the user ID of the instructor if logged in.
 * @returns {Object} - The response object with the retrieved classes.
 */
export const getClassesByInstructor = asyncErrorHandler(async (req, res) => {
	const instructorId = req.user.userId;
	const classes = await classService.getClassesByInstructor(instructorId);
	return res.status(200).json({
		status: "Success",
		data: classes
	});
});

/**
 * @async
 * @desc Get a class by its ID.
 * @function getClassById
 * @param {Object} req - The request object containing the class ID in the parameters.
 * @returns {Object} - The response object with the retrieved class.
 */
export const getClassById = asyncErrorHandler(async (req, res) => {
	const classId = req.params.classId;
	const classData = await classService.getClassById(classId);
	return res.status(200).json({
		status: "Success",
		data: classData
	});
});

/**
 * @async
 * @desc Create a new class.
 * @function createClass
 * @param {Object} req - The request object containing the class information in the body
 * and having the user ID of the instructor if logged in.
 * @returns {Object} - The response object with the newly created class.
 */
export const createClass = asyncErrorHandler(async (req, res) => {
	const instructorId = req.user.userId;
	const classInfo = req.body;
	console.log(classInfo);
	const newClass = await classService.createClass(classInfo, instructorId);
	return res.status(201).json({
		status: "Success",
		message: "Class successfully created",
		data: newClass
	});
});

/**
 * @async
 * @desc Update a class.
 * @function updateClass
 * @param {Object} req - The request object containing the class ID in the parameters and the update data in the body.
 * @returns {Object} - The response object with the updated class.
 */
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

/**
 * @async
 * @desc Delete a class.
 * @function deleteClass
 * @param {Object} req - The request object containing the class ID in the parameters.
 * @returns {Object} - The response object indicating the success of the deletion.
 */
export const deleteClass = asyncErrorHandler(async (req, res) => {
	const classId = req.params.classId;
	await classService.deleteClass(classId);
	return res.status(200).json({
		status: "Success",
		message: "Class successfully deleted"
	});
});

/**
 * @async
 * @desc Add a student to a class.
 * @function addStudentToClass
 * @param {Object} req - The request object containing the class ID and student ID in the body.
 * @returns {Object} - The response object with the updated class.
 */
export const addStudentToClass = asyncErrorHandler(async (req, res) => {
	const { classId, studentId } = req.body;
	const updatedClass = await classService.addStudentToClass(classId, studentId);
	return res.status(200).json({
		status: "Success",
		message: "Student successfully added to class",
		data: updatedClass
	});
});

/**
 * @async
 * @desc Add students to a class by their email addresses.
 * @function addStudentsByEmail
 * @param {Object} req - The request object containing the class ID and student emails in the body.
 * @returns {Object} - The response object with the processing results.
 */
export const addStudentsByEmail = asyncErrorHandler(async (req, res) => {
	const { classId, emails } = req.body;
	const results = await classService.addStudentsByEmail(classId, emails);
	return res.status(200).json({
		status: "Success",
		message: "Students processed",
		data: results
	});
});

/**
 * @async
 * @desc Remove a student from a class.
 * @function removeStudentFromClass
 * @param {Object} req - The request object containing the class ID and student ID in the body.
 * @returns {Object} - The response object with the updated class.
 */
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

/**
 * @async
 * @desc Add a group to a class.
 * @function addGroupToClass
 * @param {Object} req - The request object containing the class ID and group data in the body.
 * @returns {Object} - The response object with the updated group.
 */
export const addGroupToClass = asyncErrorHandler(async (req, res) => {
	const { classId, groupData } = req.body;
	const updatedGroup = await classService.addGroupToClass(classId, groupData);
	return res.status(200).json({
		status: "Success",
		message: "Group successfully added to class",
		data: updatedGroup
	});
});

/**
 * @async
 * @desc Remove a group from a class.
 * @function removeGroupFromClass
 * @param {Object} req - The request object containing the group ID in the body.
 * @returns {Object} - The response object with the updated group.
 */
export const removeGroupFromClass = asyncErrorHandler(async (req, res) => {
	const { groupId } = req.body;
	const updatedGroup = await classService.removeGroupFromClass(groupId);
	return res.status(200).json({
		status: "Success",
		message: "Group successfully removed from class",
		data: updatedGroup
	});
});

/**
 * @async
 * @desc Update a group in a class.
 * @function updateGroupInClass
 * @param {Object} req - The request object containing the group ID and update data in the body.
 * @returns {Object} - The response object with the updated group.
 */
export const updateGroupInClass = asyncErrorHandler(async (req, res) => {
	const { groupId, updateData } = req.body;
	const updatedGroup = await classService.updateGroupInClass(
		groupId,
		updateData
	);
	return res.status(200).json({
		status: "Success",
		message: "Group successfully updated in class",
		data: updatedGroup
	});
});

/**
 * @async
 * @desc Get a group in a class.
 * @function getGroupInClass
 * @param {Object} req - The request object containing the class ID and group ID in the body.
 * @returns {Object} - The response object with the retrieved group.
 */
export const getGroupInClass = asyncErrorHandler(async (req, res) => {
	const { classId, groupId } = req.body;
	const groupData = await classService.getGroupInClass(classId, groupId);
	return res.status(200).json({
		status: "Success",
		data: groupData
	});
});

/**
 * @async
 * @desc Get all groups in a class.
 * @function getGroupsInClass
 * @param {Object} req - The request object containing the class ID in the body.
 * @returns {Object} - The response object with the retrieved groups.
 */
export const getGroupsInClass = asyncErrorHandler(async (req, res) => {
	const { classId } = req.body;
	const groupData = await classService.getGroupsInClass(classId);
	return res.status(200).json({
		status: "Success",
		data: groupData
	});
});

/**
 * @async
 * @desc Get the members of a group.
 * @function getGroupMembers
 * @param {Object} req - The request object containing the group ID in the body.
 * @returns {Object} - The response object with the retrieved group members.
 */
export const getGroupMembers = asyncErrorHandler(async (req, res) => {
	const { groupId } = req.body;
	const groupMembers = await classService.getGroupMembers(groupId);
	return res.status(200).json({
		status: "Success",
		data: groupMembers
	});
});

/**
 * @async
 * @desc Add a member to a group.
 * @function addGroupMember
 * @param {Object} req - The request object containing the group ID and user ID of the group member in the body.
 * @returns {Object} - The response object with the updated group.
 */
export const addGroupMember = asyncErrorHandler(async (req, res) => {
	const { groupId, userId } = req.body;
	const updatedGroup = await classService.addGroupMember(groupId, userId);
	return res.status(200).json({
		status: "Success",
		message: "Member successfully added to group",
		data: updatedGroup
	});
});

/**
 * @async
 * @desc Remove a member from a group.
 * @function removeGroupMember
 * @param {Object} req - The request object containing the group ID and user ID of the group member in the body.
 * @returns {Object} - The response object with the updated group.
 */
export const removeGroupMember = asyncErrorHandler(async (req, res) => {
	const { groupId, userId } = req.body;
	const updatedGroup = await classService.removeGroupMember(groupId, userId);
	return res.status(200).json({
		status: "Success",
		message: "Member successfully removed from group",
		data: updatedGroup
	});
});

/**
 * @async
 * @desc Join a group.
 * @function addGroupMember
 * @param {Object} req - The request object containing the group ID in the body and the user ID of the group member if logged in.
 * @returns {Object} - The response object with the updated group.
 */
export const joinGroup = asyncErrorHandler(async (req, res) => {
	const { groupId } = req.body;
	const userId = req.user.userId;
	const updatedGroup = await classService.addGroupMember(groupId, userId);
	return res.status(200).json({
		status: "Success",
		message: "Successfully joined group",
		data: updatedGroup
	});
});

/**
 * @async
 * @desc Leave a group.
 * @function removeGroupMember
 * @param {Object} req - The request object containing the group ID in the body and the user ID of the group member if logged in.
 * @returns {Object} - The response object with the updated group.
 */
export const leaveGroup = asyncErrorHandler(async (req, res) => {
	const { groupId } = req.body;
	const userId = req.user.userId;
	const updatedGroup = await classService.removeGroupMember(groupId, userId);
	return res.status(200).json({
		status: "Success",
		message: "Successfully left group",
		data: updatedGroup
	});
});

/**
 * @async
 * @desc Check if a user is in a group in a class.
 * @function isUserInGroup
 * @param {Object} req - The request object containing the class ID and user ID in the body.
 * @returns {Object} - The response object indicating whether the user is in the group or not.
 */
export const isUserInGroup = asyncErrorHandler(async (req, res) => {
	const { classId, userId } = req.body;
	const isUsrInGrp = await classService.isUserInGroup(classId, userId);
	return res.status(200).json({
		status: "Success",
		data: isUsrInGrp
	});
});

/**
 * @async
 * @desc Get the students who are not in any group in a class.
 * @function getStudentsNotInAnyGroup
 * @param {Object} req - The request object containing the class ID in the body.
 * @returns {Object} - The response object with the retrieved students.
 */
export const getStudentsNotInAnyGroup = asyncErrorHandler(async (req, res) => {
	const { classId } = req.body;
	const usrsNotInGrps = await classService.getStudentsNotInAnyGroup(classId);
	return res.status(200).json({
		status: "Success",
		data: usrsNotInGrps
	});
});

/**
 * @async
 * @desc Get the categories of a class by its ID.
 * @function getCategoriesByClassId
 * @param {Object} req - The request object containing the class ID in the parameters.
 * @returns {Object} - The response object with the retrieved categories.
 */
export const getCategoriesByClassId = asyncErrorHandler(async (req, res) => {
	const { classId } = req.params;
	const categories = await classService.getCategoriesByClassId(classId);
	console.log(categories);
	res.status(200).json({ status: "Success", data: categories });
});

// Export all controller methods
export default {
	getAllClasses,
	getAllClassesUserIsNotIn,
	getClassesByInstructor,
	getClassById,
	createClass,
	updateClass,
	deleteClass,

	addStudentToClass,
	addStudentsByEmail,
	removeStudentFromClass,

	addGroupToClass,
	removeGroupFromClass,
	updateGroupInClass,
	getGroupInClass,
	getGroupsInClass,
	getGroupMembers,
	addGroupMember,
	removeGroupMember,
	isUserInGroup,
	getStudentsNotInAnyGroup,

	getCategoriesByClassId
};
