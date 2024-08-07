/**
 * @module usersRoutes
 * @file This file defines the routes for user operations.
 */
import express from "express";
import {
	getAllUsers,
	getUsersByRole,
	getUserClasses,
	getUserAssignments,
	getAllGroups,
	getGroups,
	updateProfile,
	getAdminReports,
	getInstructorReports,
	sendReportToInstructor,
	sendReportToAdmin,
	getSentReports,
	unResolveReport,
	resolveReport,
	deleteReport
} from "../controllers/userController.js";

import {
	ensureUser,
	ensureAdmin,
	ensureInstructorOrAdmin
} from "../middleware/ensureUserTypes.js";

const router = express.Router();

router.get("/", (req, res) => {
	res.status(200).send("User route is working!");
});

/**
 * @route GET /users/all
 * @desc Get all users
 * @function getAllUsers
 * @middleware ensureAdmin
 * @param {Object} req - The request object
 * @returns {Object} - The response object with the user data
 */
router.route("/all").get(ensureAdmin, getAllUsers);

// This is primarly used in the ForgotPassword component
/**
 * @route GET /users/role/:role
 * @desc Get users by role
 * @function getUsersByRole
 * @middleware ensureInstructorOrAdmin
 * @param {Object} req - The request object containing the role
 * @returns {Object} - The response object with the user data
 */
router
	.route("/role/:role")
	.get(ensureInstructorOrAdmin, getUsersByRole);

// Classes & Groups
/**
 * @route POST /users/get-classes
 * @desc Get classes for a user
 * @function getUserClasses
 * @middleware ensureUser
 * @param {Object} req - The request object containing the userId
 * @returns {Object} - The response object with the class data
 */
router.route("/get-classes").post(getUserClasses);

/**
 * @route POST /users/get-assignments
 * @desc Get assignments for a user
 * @function getUserAssignments
 * @middleware ensureUser
 * @param {Object} req - The request object containing the userId
 * @returns {Object} - The response object with the assignment data
 */
router.route("/get-assignments").post(getUserAssignments);

/**
 * @route POST /users/get-groups
 * @desc Get groups for a user
 * @function getGroups
 * @middleware ensureUser
 * @param {Object} req - The request object containing the userId
 * @returns {Object} - The response object with the group data
 */
router.route("/get-groups").post(getGroups);

/**
 * @route POST /users/get-all-groups
 * @desc Get all groups
 * @function getAllGroups
 * @middleware ensureAdmin
 * @param {Object} req - The request object
 * @returns {Object} - The response object with the group data
 */

router.route("/get-all-groups").post(ensureAdmin, getAllGroups);

/**
 * @route POST /users/update-profile
 * @desc Update user profile
 * @function updateProfile
 * @middleware ensureUser
 * @param {Object} req - The request object containing the updated user data
 * @returns {Object} - The response object with the updated user data
 */

router.route("/update-profile").post(updateProfile);

// Reports

/**
 * @route POST /users/send-report-to-instructor
 * @desc Send a report to an instructor
 * @function sendReportToInstructor
 * @param {Object} req - The request object containing the report data
 * @returns {Object} - The response object with the report data
 */
router.route("/send-report-to-instructor").post(sendReportToInstructor);

/**
 * @route POST /users/send-report-to-admin
 * @desc Send a report to an admin
 * @function sendReportToAdmin
 * @param {Object} req - The request object containing the report data
 * @returns {Object} - The response object with the report data
 */
router.route("/send-report-to-admin").post(sendReportToAdmin);

/**
 * @route POST /users/resolve-report
 * @desc Resolve a report
 * @function resolveReport
 * @middleware ensureInstructorOrAdmin
 * @param {Object} req - The request object containing the reportId
 * @returns {Object} - The response object with the report data
 */
router.route("/resolve-report").post(ensureInstructorOrAdmin, resolveReport);

/**
 * @route POST /users/unresolve-report
 * @desc Unresolve a report
 * @function unResolveReport
 * @middleware ensureInstructorOrAdmin
 * @param {Object} req - The request object containing the reportId
 * @returns {Object} - The response object with the report data
 */
router.route("/unresolve-report").post(ensureInstructorOrAdmin, unResolveReport);

/**
 * @route POST /users/delete-report
 * @desc Delete a report
 * @function deleteReport
 * @middleware ensureInstructorOrAdmin
 * @param {Object} req - The request object containing the reportId
 * @returns {Object} - The response object with the report data
 */
router.route("/delete-report").post(ensureInstructorOrAdmin, deleteReport);

/**
 * @route POST /users/get-admin-reports
 * @desc Get all admin reports
 * @function getAdminReports
 * @middleware ensureAdmin
 * @param {Object} req - The request object
 * @returns {Object} - The response object with the report data
 */
router.route("/get-admin-reports").post(ensureAdmin, getAdminReports);

/**
 * @route POST /users/get-instructor-reports
 * @desc Get all instructor reports
 * @function getInstructorReports
 * @middleware ensureInstructorOrAdmin
 * @param {Object} req - The request object
 * @returns {Object} - The response object with the report data
 */
router.route("/get-instructor-reports").post(ensureInstructorOrAdmin, getInstructorReports);

/**
 * @route POST /users/get-sent-reports
 * @desc Get all sent reports
 * @function getSentReports
 * @middleware ensureUser
 * @param {Object} req - The request object
 * @returns {Object} - The response object with the report data
 */
router.route("/get-sent-reports").post(getSentReports);

export default router;
