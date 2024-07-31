/**
 * @module routes/enroll-requests
 * @file This file defines the routes for the enroll requests.
 */
import express from "express";
import {
	createEnrollRequest,
	getAllEnrollRequests,
	getEnrollRequestsForClass,
	getEnrollRequestsForUser,
	updateEnrollRequestStatus,
	deleteEnrollRequest
} from "../controllers/enrollRequestController.js";

import { ensureInstructorOrAdmin } from "../middleware/ensureUserTypes.js";

const router = express.Router();

/**
 * @route POST or GET /enroll-requests
 * @desc Create a new enroll request
 * @function createEnrollRequest or getAllEnrollRequests
 * @middleware ensureInstructorOrAdmin
 * @returns {JSON} a message indicating success or failure
 */
router
	.route("/")
	.post(createEnrollRequest)
	.get(ensureInstructorOrAdmin, getAllEnrollRequests);

/**
 * @route GET /enroll-requests/class/:classId
 * @desc Get all enroll requests for a class
 * @function getEnrollRequestsForClass
 * @middleware ensureInstructorOrAdmin
 * @returns {JSON} a list of enroll requests
 */
router
	.route("/class/:classId")
	.get(ensureInstructorOrAdmin, getEnrollRequestsForClass);

/**
 * @route GET /enroll-requests/user
 * @desc Get all enroll requests for a user
 * @function getEnrollRequestsForUser
 * @middleware ensureInstructorOrAdmin
 * @returns {JSON} a list of enroll requests
 */
router.route("/user").get(getEnrollRequestsForUser);

/**
 * @route PUT or DELETE /enroll-requests/:enrollRequestId
 * @desc Update or delete an enroll request
 * @function updateEnrollRequestStatus or deleteEnrollRequest
 * @middleware ensureInstructorOrAdmin
 * @returns {JSON} a message indicating success or failure
 */
router
	.route("/:enrollRequestId")
	.put(ensureInstructorOrAdmin, updateEnrollRequestStatus)
	.delete(deleteEnrollRequest);

export default router;
