/**
 * @module assignment
 * @desc This module handles the routes related to assignments in the application.
 */

import express from "express";
import {
  addAssignmentToClass,
  removeAssignmentFromClass,
  updateAssignmentInClass,
  getAssignmentInClass,
  getAllAssignments,
  getAllAssignmentsByClassId,
  extendDeadlineForStudent,
  deleteExtendedDeadlineForStudent,
  addAssignmentWithRubric
} from "../controllers/assignController.js";

import { addComment, getComments } from "../controllers/commentController.js";

import { ensureUser, ensureInstructor, ensureAdmin, ensureInstructorOrAdmin } from "../middleware/ensureUserTypes.js";

const router = express.Router();

/**
 * @async
 * @route POST /assignment/add-assignment
 * @desc Add an assignment to a class.
 * @function addAssignmenToClass
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructorOrAdmin - Ensure the user is an instructor or admin.
 * @param {Object} req - Get the classId, categoryId, and assignmentData from the request object.
 * @returns {Object} - The response object containing the status, message, and new assignment data.
 */
router.route("/add-assignment")
  .post(ensureUser, ensureInstructorOrAdmin, addAssignmentToClass);

/**
 * @async
 * @route POST /assignment/remove-assignment
 * @desc Remove an assignment from a class.
 * @function removeAssignmentFromClass
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructorOrAdmin - Ensure the user is an instructor or admin.
 * @param {Object} req - Get the assignmentId from the body.
 * @returns {Object} - The response object containing the status, message, and data.
 */
router.route("/remove-assignment")
  .post(ensureUser, ensureInstructorOrAdmin, removeAssignmentFromClass);

/**
 * @async
 * @route POST /assignment/update-assignment
 * @desc Update an assignment in a class.
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructorOrAdmin - Ensure the user is an instructor or admin.
 * @function updateAssignmentInClass
 * @param {Object} req - Get the classId, assignmentId, categoryId, and assignmentData from the body.
 * @returns {Object} - The response object containing the status, message, and data.
 */
router.route("/update-assignment")
  .post(ensureUser, ensureInstructorOrAdmin, updateAssignmentInClass);

/**
 * @async
 * @route POST /assignment/get-assignment
 * @desc Get an assignment in a class.
 * @middleware ensureUser - Ensure the user is logged in.
 * @function getAssignmentInClass
 * @param {Object} req - Get the classId and assignmentId from the body.
 * @returns {Object} - The response object containing the status and data.
 */
router.route("/get-assignment")
  .post(ensureUser, getAssignmentInClass);

/**
 * @async
 * @route POST /assignment/get-all-assignments
 * @desc Get all assignments.
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureAdmin - Ensure the user is admin
 * @function getAllAssignments
 * @returns {Object} - The response object containing the status and assignments.
 */
router.route("/get-all-assignments")
  .post(ensureUser, ensureAdmin, getAllAssignments);

/**
 * @async
 * @route POST /assignment/get-class-assignments
 * @desc Get all assignments by class ID.
 * @middleware ensureUser - Ensure the user is logged in.
 * @function getAllAssignmentsByClassId
 * @param {Object} req - The request object containing the class ID and the logged-in user ID.
 * @returns {Object} - The response object containing the status and assignment objects.
 */
router.route("/get-class-assignments")
  .post(ensureUser, getAllAssignmentsByClassId);

/**
 * @async
 * @route POST /assignment/extend-deadline
 * @desc Extend the deadline for a student.
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructorOrAdmin - Ensure the user is an instructor or admin.
 * @function extendDeadlineForStudent
 * @param {Object} req - get the studentId, assignmentId, and newDueDate from the body.
 * @returns {Object} - The response object containing the status, message, and updated assignment data.
 */
router.route("/extend-deadline")
  .post(ensureUser, ensureInstructorOrAdmin, extendDeadlineForStudent);

/**
 * @async
 * @route POST /assignment/delete-extended-deadline
 * @desc Delete the extended deadline for a student.
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructorOrAdmin - Ensure the user is an instructor or admin.
 * @function deleteExtendedDeadlineForStudent
 * @param {Object} req - Get the studentId and assignmentId from the body.
 * @returns {Object} - The response object containing the status, message, and deleted extension confirmation.
 */
router.route("/delete-extended-deadline")
  .post(ensureUser, ensureInstructorOrAdmin, deleteExtendedDeadlineForStudent);

/**
 * @async
 * @route POST /assignment/add-assignment-with-rubric
 * @desc Add an assignment with a rubric.
 * @middleware ensureUser - Ensure the user is logged in.
 * @middleware ensureInstructorOrAdmin - Ensure the user is an instructor or admin.
 * @function addAssignmentWithRubric
 * @param {Object} req - Get the classId, categoryId, assignmentData, rubricData, and creatorId from the body.
 * @returns {Object} - The response object containing the status, message, and data.
 */
router.route("/add-assignment-with-rubric")
  .post(ensureUser, ensureInstructorOrAdmin, addAssignmentWithRubric);

/**
 * @async
 * @route /assignment/:assignmentId/comments
 * @desc It extracts the assignmentId and userId from the request object. It calls the commentService to get the comments for the assignment and sends a success response with the comments.
 * @middleware ensureUser - Ensure the user is logged in.
 * @function getComments
 * @param {Object} req - The request object containing the assignmentId from the parameters and the userID if the user is still logged in.
 * @returns {Object} The response object with a success status and the comments.
 */
router.route("/:assignmentId/comments")
  .get(ensureUser, getComments)
  /**
 * @async
 * @route /assignment/:assignmentId/comments
 * @desc It extracts the assignmentId, content, studentId, and userId from the request object. If the studentId is missing, it sends a 400 error response. Otherwise, it calls the commentService to add the comment to the assignment and sends a success response with the added comment.
 * @middleware ensureUser - Ensure the user is logged in.
 * @function addComment
 * @param {Object} req - The request object containing the assignmentId from the parameters, content and studentId in the body, and userID if the user is still logged in.
 * @returns {Object} The response object with a success status and the added comment.
 */
  .post(ensureUser, addComment);

export default router;