
/**
 * @module userController
 * @desc Controller for handling user-related operations
 */

import userService from "../services/userService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

/**
 * @async
 * @desc Get all users
 * @function getAllUsers
 * @param {Object} req - The request object
 * @param {Function} next - The next middleware function for error handling
 * @returns {Object} - The response object with all users
 */
export const getAllUsers = asyncErrorHandler(async (req, res, next) => {
	const users = await userService.getAllUsers();
	res.status(200).json({
		status: "Success",
		message: "All users fetched",
		data: users
	});
});

/**
 * @async
 * @desc Get users by role
 * @function getUsersByRole
 * @param {Object} req - The request object containing the role in the parameters
 * @param {Function} next - The next middleware function for error handling
 * @returns {Object} - The response object with users of the specified role
 */
export const getUsersByRole = asyncErrorHandler(async (req, res, next) => {
	const role = req.params.role;
	const users = await userService.getUsersByRole(role);
	res.status(200).json({
		status: "Success",
		message: `Users with role ${role} fetched`,
		data: users
	});
});

/**
 * @async
 * @desc Get user classes
 * @function getUserClasses
 * @param {Object} req - The request object containing the userId if the user is still logged in
 * @returns {Object} - The response object with user classes
 */
export const getUserClasses = asyncErrorHandler(async (req, res) => {
	console.log("getUserClasses endpoint hit");
	const userId = req.body.userId;
	const classes = await userService.getUserClasses(userId);
	res.status(200).json({
		status: "Success",
		message: "User classes fetched",
		data: classes
	});
});

/**
 * @async
 * @desc Get user assignments
 * @function getUserAssignments
 * @param {Object} req - The request object containing the userId if the user is still logged in
 * @returns {Object} - The response object with user assignments
 */
export const getUserAssignments = asyncErrorHandler(async (req, res) => {
	console.log("getUserAssignments endpoint hit");
	const userId = req.body.userId;
	const assignments = await userService.getUserAssignments(userId);
	res.status(200).json({
		status: "Success",
		message: "User assignments fetched",
		data: assignments
	});
});

/**
 * @async
 * @desc Get groups
 * @function getGroups
 * @param {Object} req - The request object containing the userId if the user is still logged in
 * @returns {Object} - The response object with user groups
 */
export const getGroups = asyncErrorHandler(async (req, res) => {
	const userId = req.body.userId;
	const groupData = await userService.getGroups(userId);
	res.status(200).json({
		status: "Success",
		message: "User groups fetched",
		data: groupData
	});
});

/**
 * @async
 * @desc Get all groups
 * @function getAllGroups
 * @returns {Object} - The response object with all groups
 */
export const getAllGroups = asyncErrorHandler(async (req, res) => {
	const groupsData = await userService.getAllGroups();
	return res.status(200).json({
		status: "Success",
		message: "All groups fetched",
		data: groupsData
	});
});

/**
 * @async
 * @desc Update user profile
 * @function updateProfile
 * @param {Object} req - The request object containing the userId and updateData
 * @returns {Object} - The response object with updated user profile
 */
export const updateProfile = asyncErrorHandler(async (req, res) => {
	const { userId, updateData } = req.body;
	const profileData = await userService.updateProfile(userId, updateData);
	res.status(200).json({
		status: "Success",
		message: "User profile updated",
		data: profileData
	});
});

/**
 * @async
 * @desc Get admin reports
 * @function getAdminReports
 * @returns {Object} - The response object with admin reports
 */
export const getAdminReports = asyncErrorHandler(async (req, res) => {
	const reports = await userService.getAdminReports();
	res.status(200).json({
		status: "Success",
		message: "Admin reports fetched",
		data: reports
	});
});

/**
 * @async
 * @desc Get instructor reports
 * @function getInstructorReports
 * @param {Object} req - The request object containing the instructorId if the instructor is still logged in
 * @returns {Object} - The response object with instructor reports
 */
export const getInstructorReports = asyncErrorHandler(async (req, res) => {
	const instructorId = req.user.userId;
	const reports = await userService.getInstructorReports(instructorId);
	res.status(200).json({
		status: "Success",
		message: "Instructor reports fetched",
		data: reports
	});
});

/**
 * @async
 * @desc Get sent reports
 * @function getSentReports
 * @param {Object} req - The request object containing the userId if the user is still logged in
 * @returns {Object} - The response object with sent reports
 */
export const getSentReports = asyncErrorHandler(async (req, res) => {
	const userId = req.user.userId;
	const reports = await userService.getSentReports(userId);
	res.status(200).json({
		status: "Success",
		message: "Sent reports fetched",
		data: reports
	});
});

/**
 * @async
 * @desc Send report to instructor
 * @function sendReportToInstructor
 * @param {Object} req - The request object containing the title, content, and instructorId and userId if the user is still logged in
 * @returns {Object} - The response object with the sent report
 */
export const sendReportToInstructor = asyncErrorHandler(async (req, res) => {
	const userId = req.user.userId;
	const { title, content, instructorId } = req.body;
	const report = await userService.sendReportToInstructor(userId, title, content, instructorId);
	res.status(200).json({
		status: "Success",
		message: "Report sent to instructor",
		data: report
	});
});

/**
 * @async
 * @desc Send report to admin
 * @function sendReportToAdmin
 * @param {Object} req - The request object containing the title and content and userId if the user is still logged in
 * @returns {Object} - The response object with the sent report
 */
export const sendReportToAdmin = asyncErrorHandler(async (req, res) => {
	const senderId = req.user.userId;
	const { title, content } = req.body;
	const report = await userService.sendReportToAdmin(senderId, title, content);
	res.status(200).json({
		status: "Success",
		message: "Report sent to admin",
		data: report
	});
});

/**
 * @async
 * @desc Resolve report
 * @function resolveReport
 * @param {Object} req - The request object containing the reportId
 * @returns {Object} - The response object with the resolved report
 */
export const resolveReport = asyncErrorHandler(async (req, res) => {
	const { reportId } = req.body;
	const report = await userService.resolveReport(reportId);
	res.status(200).json({
		status: "Success",
		message: "Report marked as resolved",
		data: report
	});
});

/**
 * @async
 * @desc Unresolve report
 * @function unResolveReport
 * @param {Object} req - The request object containing the reportId
 * @returns {Object} - The response object with the unresolved report
 */
export const unResolveReport = asyncErrorHandler(async (req, res) => {
	const { reportId } = req.body;
	const report = await userService.unResolveReport(reportId);
	res.status(200).json({
		status: "Success",
		message: "Report marked as not resolved",
		data: report
	});
});

/**
 * @async
 * @desc Delete report
 * @function deleteReport
 * @param {Object} req - The request object containing the reportId
 * @returns {Object} - The response object with the deleted report
 */
export const deleteReport = asyncErrorHandler(async (req, res) => {
	const { reportId } = req.body;
	const report = await userService.deleteReport(reportId);
	res.status(200).json({
		status: "Success",
		message: "Report deleted",
		data: report
	});
});

export default {
	getAllUsers,
	getUsersByRole,
	getUserClasses,
	getUserAssignments,
	getAllGroups,
	getGroups,
	updateProfile,
	getAdminReports,
	getInstructorReports,
	getSentReports,
	sendReportToInstructor,
	sendReportToAdmin,
	resolveReport,
	unResolveReport,
	deleteReport
};
