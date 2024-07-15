import enrollRequestService from "../services/enrollRequestService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

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

export const getAllEnrollRequests = asyncErrorHandler(async (req, res) => {
	const requests = await enrollRequestService.getAllEnrollRequests();
	return res.status(200).json({
		status: "Success",
		message: "Enrollment requests retrieved",
		data: requests
	});
});

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

export const getEnrollRequestsForUser = asyncErrorHandler(async (req, res) => {
	const userId = req.user.userId;
	const requests = await enrollRequestService.getEnrollRequestsForUser(userId);
	return res.status(200).json({
		status: "Success",
		message: "Enrollment requests for user retrieved",
		data: requests
	});
});

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
