/**
 * @module routes/classes
 * @desc This module handles the routes related to classes in the application.
 */

import express from "express";
import {
	getClassesByInstructor,
	getInstructorByClass,
	getClassById,
	getAllClasses,
	getAllClassesUserIsNotIn, 
	createClass,
	updateClass,
	deleteClass,
	addStudentToClass,
	addStudentsByEmail,
	removeStudentFromClass,
	getStudentsByClass,
	addGroupToClass,
	removeGroupFromClass,
	updateGroupInClass,
	getGroupInClass,
	getGroupsInClass,
	getGroupMembers,
	addGroupMember,
	removeGroupMember,
	joinGroup,
	leaveGroup,
	isUserInGroup,
	getStudentsNotInAnyGroup,
	getCategoriesByClassId
} from "../controllers/classController.js";

import {
	ensureUser,
	ensureInstructor,
	ensureAdmin,
	ensureInstructorOrAdmin
} from "../middleware/ensureUserTypes.js";

const router = express.Router();

// Class Routes
/**
 * @async
 * @route GET /classes/all
 * @desc Get all classes
 * @function getAllClasses
 * @middleware ensureUser - Ensure the user is logged in.
 * @returns {Array} - An array of all classes
 */
router.route("/all").get(ensureUser, getAllClasses);

/**
 * @async
 * @route GET /classes/my-classes
 * @desc Get all classes taught by the instructor
 * @function getClassesByInstructor
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructor - Ensure the user is an instructor.
 * @returns {Array} - An array of all classes taught by the instructor
 */
router
	.route("/my-classes")
	.get(ensureUser, ensureInstructor, getClassesByInstructor);

/**
 * @async
 * @route GET /classes/not-enrolled
 * @desc Get all classes the user is not enrolled in
 * @function getAllClassesUserIsNotIn
 * @middleware ensureUser - Ensure the user is logged in.
 * @returns {Array} - An array of all classes the user is not enrolled in
 */
router.route("/not-enrolled").get(ensureUser, getAllClassesUserIsNotIn);

/**
 * @async
 * @route POST /classes/create
 * @desc Create a class
 * @function createClass
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructorOrAdmin - Ensure the user is an instructor or admin.
 * @param {Object} req - The request object containing the class data.
 * @returns {Object} - The response object containing the status, message, and new class data.
 */
router.route("/create").post(ensureUser, ensureInstructorOrAdmin, createClass);

/**
 * @async
 * @route GET or PUT or DELETE /classes/:classId
 * @desc Get, update, or delete a class by ID
 * @function getClassById, updateClass, deleteClass
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructorOrAdmin - Ensure the user is an instructor or admin.
 * @param {Object} req - The request object containing the class ID.
 * @returns {Object} - The response object containing the status, message, and class data.
 */
router
	.route("/:classId")
	.get(ensureUser, getClassById)
	.put(ensureUser, ensureInstructorOrAdmin, updateClass)
	.delete(ensureUser, ensureInstructorOrAdmin, deleteClass);

/**
 * @async
 * @route GET /classes/:classId/students
 * @desc Get all students in a class
 * @function getStudentsByClass
 * @middleware ensureUser - Ensure the user is logged in.
 * @param {Object} req - The request object containing the class ID.
 * @returns {Array} - An array of all students in the class
 */
router.route("/:classId/students").get(ensureUser, getStudentsByClass);

/**
 * @async
 * @route GET /classes/:classId/instructor
 * @desc Get the instructor of a class
 * @function getInstructorByClass
 * @middleware ensureUser - Ensure the user is logged in.
 * @param {Object} req - The request object containing the class ID.
 * @returns {Object} - The response object containing the status and instructor data.
 */
router.route("/:classId/instructor").get(ensureUser, getInstructorByClass);

// Student Routes
/**
 * @async
 * @route POST /classes/add-student
 * @desc Add a student to a class
 * @function addStudentToClass
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructorOrAdmin - Ensure the user is an instructor or admin.
 * @param {Object} req - The request object containing the class ID and student ID.
 * @returns {Object} - The response object containing the status and message.
 */
router
	.route("/add-student")
	.post(ensureUser, ensureInstructorOrAdmin, addStudentToClass);

/**
 * @async
 * @route POST /classes/add-students-by-email
 * @desc Add students to a class by email
 * @function addStudentsByEmail
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructorOrAdmin - Ensure the user is an instructor or admin.
 * @param {Object} req - The request object containing the class ID and student emails.
 * @returns {Object} - The response object containing the status and message.
*/
router
	.route("/add-students-by-email")
	.post(ensureUser, ensureInstructorOrAdmin, addStudentsByEmail);

/**
 * @async
 * @route POST /classes/remove-student
 * @desc Remove a student from a class
 * @function removeStudentFromClass
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructorOrAdmin - Ensure the user is an instructor or admin.
 * @param {Object} req - The request object containing the class ID and student ID.
 * @returns {Object} - The response object containing the status and message.
 * */
router
	.route("/remove-student")
	.post(ensureUser, ensureInstructorOrAdmin, removeStudentFromClass);

// Group Routes
/**
 * @async
 * @route POST /classes/add-group
 * @desc Add a group to a class
 * @function addGroupToClass
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructorOrAdmin - Ensure the user is an instructor or admin.
 * @param {Object} req - The request object containing the class ID and group data.
 * @returns {Object} - The response object containing the status and message.
 */
router.route("/add-group").post(ensureUser, addGroupToClass);

/**
 * @async
 * @route POST /classes/remove-group
 * @desc Remove a group from a class
 * @function removeGroupFromClass
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructorOrAdmin - Ensure the user is an instructor or admin.
 * @param {Object} req - The request object containing the class ID and group ID.
 * @returns {Object} - The response object containing the status and message.
 * */
router
	.route("/remove-group")
	.post(ensureUser, ensureInstructorOrAdmin, removeGroupFromClass);

/**
 * @async
 * @route POST /classes/join-group
 * @desc Join a group in a class
 * @function joinGroup
 * @middleware ensureUser - Ensure the user is logged in.
 * @param {Object} req - The request object containing the user ID and group ID.
 * @returns {Object} - The response object containing the status and message.
 */
router.route("/join-group").post(ensureUser, joinGroup);

/**
 * @async
 * @route POST /classes/leave-group
 * @desc Leave a group in a class
 * @function leaveGroup
 * @middleware ensureUser - Ensure the user is logged in.
 * @param {Object} req - The request object containing the user ID and group ID.
 * @returns {Object} - The response object containing the status and message.
 */

router.route("/leave-group").post(ensureUser, leaveGroup);

/**
 * @async
 * @route POST /classes/update-group
 * @desc Update a group in a class
 * @function updateGroupInClass
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructorOrAdmin - Ensure the user is an instructor or admin.
 * @param {Object} req - The request object containing the class ID and group data.
 * @returns {Object} - The response object containing the status and message.
 */

router
	.route("/update-group")
	.post(ensureUser, ensureInstructorOrAdmin, updateGroupInClass);

/**
 * @async
 * @route POST /classes/get-group
 * @desc Get a group in a class
 * @function getGroupInClass
 * @middleware ensureUser - Ensure the user is logged in.
 * @param {Object} req - The request object containing the class ID and group ID.
 * @returns {Object} - The response object containing the status and group data.
 */
router
	.route("/get-group")
	.post(ensureUser, ensureInstructorOrAdmin, getGroupInClass);

/**
 * @async
 * @route POST /classes/get-groups
 * @desc Get all groups in a class
 * @function getGroupsInClass
 * @middleware ensureUser - Ensure the user is logged in.
 * @param {Object} req - The request object containing the class ID.
 * @returns {Array} - An array of all groups in the class
 */

router.route("/get-groups").post(ensureUser, getGroupsInClass);

/**
 * @async
 * @route POST /classes/get-group-members
 * @desc Get all members of a group in a class
 * @function getGroupMembers
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructor - Ensure the user is an instructor.
 * @param {Object} req - The request object containing the class ID and group ID.
 * @returns {Array} - An array of all members in the group
 */

router
	.route("/get-group-members")
	.post(ensureUser, ensureInstructor, getGroupMembers);

/**
 * @async
 * @route POST /classes/add-group-member
 * @desc Add a member to a group in a class
 * @function addGroupMember
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructor - Ensure the user is an instructor.
 * @param {Object} req - The request object containing the group ID, and user ID.
 * @returns {Object} - The response object containing the status and message.
 */
router
	.route("/add-group-member")
	.post(ensureUser, ensureInstructor, addGroupMember);

/**
 * @async
 * @route POST /classes/remove-group-member
 * @desc Remove a member from a group in a class
 * @function removeGroupMember
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructor - Ensure the user is an instructor.
 * @param {Object} req - The request object containing the group ID, and user ID.
 * @returns {Object} - The response object containing the status and message.
 */
router
	.route("/remove-group-member")
	.post(ensureUser, ensureInstructor, removeGroupMember);

/**
 * @async
 * @route POST /classes/is-user-in-group
 * @desc Check if a user is in a group
 * @function isUserInGroup
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructorOrAdmin - Ensure the user is an instructor or admin.
 * @param {Object} req - The request object containing the group ID and user ID.
 * @returns {Object} - The response object containing the status and message.
 */
router
	.route("/is-user-in-group")
	.post(ensureUser, ensureInstructorOrAdmin, isUserInGroup);

/**
 * @async
 * @route POST /classes/users-not-in-groups
 * @desc Get all students not in any group
 * @function getStudentsNotInAnyGroup
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructorOrAdmin - Ensure the user is an instructor or admin.
 * @returns {Array} - An array of all students not in any group
 */

router
	.route("/users-not-in-groups")
	.post(ensureUser, ensureInstructorOrAdmin, getStudentsNotInAnyGroup);

/**
 * @async
 * @route GET /classes/:classId/categories
 * @desc Get all categories in a class
 * @function getCategoriesByClassId
 * @middleware ensureUser - Ensure the user is logged in.
 * @param {Object} req - The request object containing the class ID.
 * @returns {Array} - An array of all categories in the class
 */
router.route("/:classId/categories").get(ensureUser, getCategoriesByClassId);

export default router;
