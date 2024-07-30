/**
 * Controller module for handling enroll request operations.
 * @module enrollRequestController
 */

import enrollRequestService from "../services/enrollRequestService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

/**
 * Create an enroll request.
 * @async
 * @function createEnrollRequest
 * @desc Creates an enroll request with the provided classId, senderMessage, and userId.
 * @param {Object} req - The request object containing the classId and senderMessage in the body and the userId if the user is still logged in.
 * @returns {Object} The response object with status, message, and data.
 */
export const createEnrollRequest = asyncErrorHandler(async (req, res) => {
	const { classId, senderMessage } = req.body;
	const userId = req.user.userId;
	const enrollRequest = await enrollRequestService.createEnrollRequest(
		userId,
		classId,
		senderMessage
	);
	return res.status(200).json({
		status: "Success",
		message: "Enrollment request created",
		data: enrollRequest
	});
});

/**
 * Get all enroll requests.
 * @async
 * @function getAllEnrollRequests
 * @desc Retrieves all enroll requests.
 * @returns {Object} The response object with status, message, and data.
 */
export const getAllEnrollRequests = asyncErrorHandler(async (req, res) => {
	const requests = await enrollRequestService.getAllEnrollRequests();
	return res.status(200).json({
		status: "Success",
		message: "Enrollment requests retrieved",
		data: requests
	});
});

/**
 * Get enroll requests for a class.
 * @async
 * @function getEnrollRequestsForClass
 * @desc Retrieves enroll requests for a specific class.
 * @param {Object} req - The request object containing the classId in the parameters.
 * @returns {Object} The response object with status, message, and data.
 */
export const getEnrollRequestsForClass = asyncErrorHandler(async (req, res) => {
	const { classId } = req.params;
	const requests =
		await enrollRequestService.getEnrollRequestsForClass(classId);
	return res.status(200).json({
		status: "Success",
		message: "Enrollment requests for class retrieved",
		data: requests
	});
});

/**
 * Get enroll requests for a user.
 * @async
 * @function getEnrollRequestsForUser
 * @desc Retrieves enroll requests for a specific user.
 * @param {Object} req - The request object containing the userId if the user is still logged in.
 * @returns {Object} The response object with status, message, and data.
 */
export const getEnrollRequestsForUser = asyncErrorHandler(async (req, res) => {
	const userId = req.user.userId;
	const requests = await enrollRequestService.getEnrollRequestsForUser(userId);
	return res.status(200).json({
		status: "Success",
		message: "Enrollment requests for user retrieved",
		data: requests
	});
});

/**
 * Update the status of an enroll request.
 * @async
 * @function updateEnrollRequestStatus
 * @desc Updates the status and receiverMessage of an enroll request.
 * @param {Object} req - The request object containing the enrollRequestId in the parameters and the status and receiverMessage in the body.
 * @returns {Object} The response object with status, message, and data.
 */
export const updateEnrollRequestStatus = asyncErrorHandler(async (req, res) => {
	const { enrollRequestId } = req.params;
	const { status, receiverMessage } = req.body;
	const updatedRequest = await enrollRequestService.updateEnrollRequestStatus(
		enrollRequestId,
		status,
		receiverMessage
	);
	return res.status(200).json({
		status: "Success",
		message: "Enrollment request status updated",
		data: updatedRequest
	});
});

/**
 * Delete an enroll request.
 * @async
 * @function deleteEnrollRequest
 * @desc Deletes an enroll request with the provided enrollRequestId and userId.
 * @param {Object} req - The request object containing the enrollRequestId in the parameters and the userId if the user is still logged in.
 * @returns {Object} The response object with status and message.
 */
export const deleteEnrollRequest = asyncErrorHandler(async (req, res) => {
	const { enrollRequestId } = req.params;
	const userId = req.body.userId;
	await enrollRequestService.deleteEnrollRequest(enrollRequestId, userId);
	return res.status(200).json({
		status: "Success",
		message: "Enrollment request deleted"
	});
});

export default {
	createEnrollRequest,
	updateEnrollRequestStatus,
	deleteEnrollRequest,
	getAllEnrollRequests,
	getEnrollRequestsForClass,
	getEnrollRequestsForUser
};
