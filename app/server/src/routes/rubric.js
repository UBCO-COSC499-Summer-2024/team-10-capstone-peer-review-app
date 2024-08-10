/**
 * @module routes/rubric
 * @file This file defines the routes for rubric operations.
 */
import express from "express";
import {
	addCriterionToRubric,
	removeCriterionFromRubric,
	updateCriterionInRubric,
	getCriterionInRubric,
	addRubricsToAssignment,
	getAllRubrics,
	getAllRubricsInClass,
	getRubricById,
	deleteRubricsFromAssignment,
	updateRubricsForAssignment,
	getRubricsInAssignment,
	addCriterionRating,
	linkRubricToAssignments
} from "../controllers/rubricController.js";

import {
	ensureUser,
	ensureInstructorOrAdmin,
	ensureAdmin
} from "../middleware/ensureUserTypes.js";

const router = express.Router();

// Rubric Routes
//console.log("rubric router");

/**
 * @route POST /rubric/add-rubrics
 * @function addRubricsToAssignment
 * @desc Add rubrics to an assignment
 * @middleware ensureUser, ensureInstructorOrAdmin
 * @param {Object} req - The request object containing the rubric data
 * @returns {Object} - The response object with the rubric data
 */
router
	.route("/add-rubrics")
	.post(ensureUser, ensureInstructorOrAdmin, addRubricsToAssignment);

/**
 * @route POST /rubric/remove-rubric
 * @function deleteRubricsFromAssignment
 * @desc Remove rubrics from an assignment
 * @middleware ensureUser, ensureInstructorOrAdmin
 * @param {Object} req - The request object containing the rubric data
 * @returns {Object} - The response object with the rubric data
 */

router.route("/remove-rubric").post(deleteRubricsFromAssignment);

/**
 * @route POST /rubric/update-rubrics
 * @function updateRubricsForAssignment
 * @desc Update rubrics in an assignment
 * @middleware ensureUser, ensureInstructorOrAdmin
 * @param {Object} req - The request object containing the rubric data
 * @returns {Object} - The response object with the rubric data
 */
router
	.route("/update-rubrics")
	.post(ensureUser, ensureInstructorOrAdmin, updateRubricsForAssignment);

/**
 * @route POST /rubric/get-rubrics
 * @function getRubricsInAssignment
 * @desc Get rubrics in an assignment
 * @middleware ensureUser
 * @param {Object} req - The request object containing the assignmentId
 * @returns {Object} - The response object with the rubric data
 */
router.route("/get-rubrics").post(ensureUser, getRubricsInAssignment);

/**
 * @route POST /rubric/get-all-rubrics
 * @function getAllRubrics
 * @desc Get all rubrics
 * @middleware ensureUser, ensureInstructorOrAdmin
 * @returns {Object} - The response object with the rubric data
 * @param {Object} req - The request object
 */
router
	.route("/get-all-rubrics")
	.post(ensureUser, ensureInstructorOrAdmin, getAllRubrics);

/**
 * @route POST /rubric/get-rubrics-in-class
 * @function getAllRubricsInClass
 * @desc Get all rubrics in a class
 * @middleware ensureUser, ensureInstructorOrAdmin
 * @returns {Object} - The response object with the rubric data
 * @param {Object} req - The request object
 */
router
	.route("/get-rubrics-in-class")
	.post(ensureUser, ensureInstructorOrAdmin, getAllRubricsInClass);

/**
 * @route POST /rubric/get-rubric-by-id
 * @function getRubricById
 * @desc Get a rubric by its ID
 * @middleware ensureUser
 * @param {Object} req - The request object containing the rubricId
 * @returns {Object} - The response object with the rubric data
 */
router.route("/get-rubric-by-id").post(getRubricById);

// Criterion Routes

/**
 * @route POST /rubric/add-criterion
 * @function addCriterionToRubric
 * @desc Add a criterion to a rubric
 * @middleware ensureUser, ensureInstructorOrAdmin
 * @param {Object} req - The request object containing the criterion data
 * @returns {Object} - The response object with the criterion data
 */
router
	.route("/add-criterion")
	.post(ensureUser, ensureInstructorOrAdmin, addCriterionToRubric);

/**
 * @route POST /rubric/remove-criterion
 * @function removeCriterionFromRubric
 * @desc Remove a criterion from a rubric
 * @middleware ensureUser, ensureInstructorOrAdmin
 * @param {Object} req - The request object containing the criterion data
 * @returns {Object} - The response object with the criterion data
 */
router
	.route("/remove-criterion")
	.post(ensureUser, ensureInstructorOrAdmin, removeCriterionFromRubric);

/**
 * @route POST /rubric/update-criterion
 * @function updateCriterionInRubric
 * @desc Update a criterion in a rubric
 * @middleware ensureUser, ensureInstructorOrAdmin
 * @param {Object} req - The request object containing the criterion data
 * @returns {Object} - The response object with the criterion data
 */
router
	.route("/update-criterion")
	.post(ensureUser, ensureInstructorOrAdmin, updateCriterionInRubric);

/**
 * @route POST /rubric/get-criterion
 * @function getCriterionInRubric
 * @desc Get a criterion in a rubric
 * @middleware ensureUser
 * @param {Object} req - The request object containing the criterion data
 * @returns {Object} - The response object with the criterion data
 */
router
	.route("/get-criterion")
	.post(ensureUser, ensureInstructorOrAdmin, getCriterionInRubric);

/**
 * @route POST /rubric/add-criterion-rating
 * @function addCriterionRating
 * @desc Add a rating to a criterion
 * @middleware ensureUser, ensureInstructorOrAdmin
 * @param {Object} req - The request object containing the rating data
 * @returns {Object} - The response object with the rating data
 */
router
	.route("/add-criterion-rating")
	.post(ensureUser, ensureInstructorOrAdmin, addCriterionRating);

/**
 * @route POST /rubric/link-rubric-to-assignment
 * @function linkRubricToAssignments
 * @desc Link a rubric to an assignment
 * @middleware ensureUser, ensureInstructorOrAdmin
 * @param {Object} req - The request object containing the rubric data
 * @returns {Object} - The response object with the rubric data
 */

router
	.route("/link-rubric-to-assignment")
	.post(ensureUser, ensureInstructorOrAdmin, linkRubricToAssignments);

export default router;
