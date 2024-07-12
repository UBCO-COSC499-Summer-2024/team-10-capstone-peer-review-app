// Import necessary modules and services
import classService from "../services/classService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

// Controller methods for class operations

export const getAllClasses = asyncErrorHandler(async (req, res) => {
	const classes = await classService.getAllClasses();
	return res.status(200).json({
		status: "Success",
		message: "Classes retrieved",
		data: classes
	});
});

export const getInstructorByClass = asyncErrorHandler(async (req, res) => {
	const classId = req.params.classId;
	const instructor = await classService.getInstructorByClass(classId);
	return res.status(200).json({
		status: "Success",
		message: "Instructor retrieved",
		data: instructor
	});
});

export const getStudentsByClass = asyncErrorHandler(async (req, res) => {
	const classId = req.params.classId;
	const students = await classService.getStudentsByClass(classId);
	return res.status(200).json({
		status: "Success",
		message: "Students retrieved",
		data: students
	});
});

export const getClassesByInstructor = asyncErrorHandler(async (req, res) => {
	const instructorId = req.user.userId;
	const classes = await classService.getClassesByInstructor(instructorId);
	return res.status(200).json({
		status: "Success",
		data: classes
	});
});

export const getClassById = asyncErrorHandler(async (req, res) => {
	const classId = req.params.classId;
	const classData = await classService.getClassById(classId);
	return res.status(200).json({
		status: "Success",
		data: classData
	});
});

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


export const addGroupToClass = asyncErrorHandler(async (req, res) => {
	const { classId, groupData } = req.body;
	const updatedGroup = await classService.addGroupToClass(classId, groupData);
	return res.status(200).json({
		status: "Success",
		message: "Group successfully added to class",
		data: updatedGroup
	});
});

export const removeGroupFromClass = asyncErrorHandler(async (req, res) => {
	const { groupId } = req.body;
	const updatedGroup = await classService.removeGroupFromClass(groupId);
	return res.status(200).json({
		status: "Success",
		message: "Group successfully removed from class",
		data: updatedGroup
	});
});

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

export const getGroupInClass = asyncErrorHandler(async (req, res) => {
	const { classId, groupId } = req.body;
	const groupData = await classService.getGroupInClass(classId, groupId);
	return res.status(200).json({
		status: "Success",
		data: groupData
	});
});

export const getGroupsInClass = asyncErrorHandler(async (req, res) => {
	const { classId } = req.body;
	const groupData = await classService.getGroupsInClass(classId);
	return res.status(200).json({
		status: "Success",
		data: groupData
	});
});

export const getGroupMembers = asyncErrorHandler(async (req, res) => {
	const { groupId } = req.body;
	const groupMembers = await classService.getGroupMembers(groupId);
	return res.status(200).json({
		status: "Success",
		data: groupMembers
	});
});

export const addGroupMember = asyncErrorHandler(async (req, res) => {
	const { groupId, userId } = req.body;
	const updatedGroup = await classService.addGroupMember(groupId, userId);
	return res.status(200).json({
		status: "Success",
		message: "Member successfully added to group",
		data: updatedGroup
	});
});

export const removeGroupMember = asyncErrorHandler(async (req, res) => {
	const { groupId, userId } = req.body;
	const updatedGroup = await classService.removeGroupMember(groupId, userId);
	return res.status(200).json({
		status: "Success",
		message: "Member successfully removed from group",
		data: updatedGroup
	});
});

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

export const isUserInGroup = asyncErrorHandler(async (req, res) => {
	const { classId, userId } = req.body;
	const isUsrInGrp = await classService.isUserInGroup(classId, userId);
	return res.status(200).json({
		status: "Success",
		data: isUsrInGrp
	});
});

export const getStudentsNotInAnyGroup = asyncErrorHandler(async (req, res) => {
	const { classId } = req.body;
	const usrsNotInGrps = await classService.getStudentsNotInAnyGroup(classId);
	return res.status(200).json({
		status: "Success",
		data: usrsNotInGrps
	});
});

export const getCategoriesByClassId = asyncErrorHandler(async (req, res) => {
	const { classId } = req.params;
	const categories = await classService.getCategoriesByClassId(classId);
	console.log(categories);
	res.status(200).json({ status: "Success", data: categories });
});

// Export all controller methods
export default {
	getClassesByInstructor,
	getClassById,
	createClass,
	updateClass,
	deleteClass,

	addStudentToClass,
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
