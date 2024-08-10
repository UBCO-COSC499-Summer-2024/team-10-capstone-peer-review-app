/**
 * @module enrollRequestService
 * @desc Provides functions for managing enrollment requests.
 */

import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

/**
 * @async
 * @function createEnrollRequest
 * @desc Creates a new enrollment request.
 * @param {number} userId - The ID of the user making the request.
 * @param {number} classId - The ID of the class for which the request is being made.
 * @param {string} senderMessage - The message sent by the user making the request.
 * @returns {Promise<Object>} The created enrollment request.
 * @throws {apiError} If an enrollment request for the same user and class already exists, or if the user is already in the class.
 */
export async function createEnrollRequest(userId, classId, senderMessage) {
	try {
		const existingRequest = await prisma.enrollRequest.findUnique({
			where: {
				UniqueEnrollRequestPerUser: {
					userId,
					classId
				}
			}
		});

		// Check if there is already an enrollment request for this user and class
		if (existingRequest) {
			throw new apiError(
				"An enrollment request for this class already exists",
				400
			);
		}

		// Check if the user is already in the class
		const userInClass = await prisma.userInClass.findUnique({
			where: {
				UserInClassId: {
					userId,
					classId
				}
			}
		});

		// If the user is already in the class, throw an error
		if (userInClass) {
			throw new apiError("User is already in this class!", 400);
		}

		const enrollRequest = await prisma.enrollRequest.create({
			data: {
				userId,
				classId,
				senderMessage
			}
		});

		return enrollRequest;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to create enrollment request", 500);
		}
	}
}

/**
 * @async
 * @function getAllEnrollRequests
 * @desc Retrieves all enrollment requests.
 * @returns {Promise<Array>} An array of enrollment requests.
 * @throws {apiError} If there is an error fetching the enrollment requests.
 */
export async function getAllEnrollRequests() {
	try {
		const requests = await prisma.enrollRequest.findMany({
			include: { user: true, class: true }
		});
		return requests;
	} catch (error) {
		throw new apiError("Error fetching enrollment requests", 500);
	}
}

/**
 * @async
 * @function getEnrollRequestsForClass
 * @desc Retrieves all enrollment requests for a specific class.
 * @param {number} classId - The ID of the class.
 * @returns {Promise<Array>} An array of enrollment requests.
 * @throws {apiError} If there is an error fetching the enrollment requests for the class.
 */
export async function getEnrollRequestsForClass(classId) {
	try {
		const requests = await prisma.enrollRequest.findMany({
			where: { classId },
			include: { user: true }
		});
		return requests;
	} catch (error) {
		throw new apiError("Error fetching enrollment requests for class", 500);
	}
}

/**
 * @async
 * @function getEnrollRequestsForUser
 * @desc Retrieves all enrollment requests for a specific user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} An array of enrollment requests.
 * @throws {apiError} If there is an error fetching the enrollment requests for the user.
 */
export async function getEnrollRequestsForUser(userId) {
	try {
		const requests = await prisma.enrollRequest.findMany({
			where: { userId },
			include: { class: true }
		});
		return requests;
	} catch (error) {
		throw new apiError("Error fetching enrollment requests for user", 500);
	}
}

/**
 * @async
 * @function updateEnrollRequestStatus
 * @desc Updates the status and receiver message of an enrollment request.
 * @param {number} enrollRequestId - The ID of the enrollment request.
 * @param {string} status - The new status of the enrollment request.
 * @param {string} receiverMessage - The message sent by the receiver of the request.
 * @returns {Promise<Object>} The updated enrollment request.
 * @throws {apiError} If there is an error updating the enrollment request or if the user is already in the class.
 */
export async function updateEnrollRequestStatus(
	enrollRequestId,
	status,
	receiverMessage
) {
	try {
		const updatedRequest = await prisma.enrollRequest.update({
			where: { enrollRequestId },
			data: { status, recipientMessage: receiverMessage }
		});

		// If the request is approved, add the user to the class
		if (status === "APPROVED") {
			const userInClass = await prisma.userInClass.findUnique({
				where: {
					UserInClassId: {
						userId: updatedRequest.userId,
						classId: updatedRequest.classId
					}
				}
			});

			// If the user is not already in the class, add them, else throw an error
			if (!userInClass) {
				await prisma.userInClass.create({
					data: {
						userId: updatedRequest.userId,
						classId: updatedRequest.classId
					}
				});
			} else {
				throw new apiError("User is already in class", 400);
			}
		}

		return updatedRequest;
	} catch (error) {
		if (error.code === "P2025") {
			throw new apiError("Enrollment request not found", 404);
		}
		if (error instanceof apiError) {
			throw error;
		}
		throw new apiError("Error updating enrollment request", 500);
	}
}

/**
 * @async
 * @function deleteEnrollRequest
 * @desc Deletes an enrollment request.
 * @param {number} enrollRequestId - The ID of the enrollment request.
 * @param {number} userId - The ID of the user making the request.
 * @throws {apiError} If the enrollment request is not found or if the user is not authorized to delete the request.
 */
export async function deleteEnrollRequest(enrollRequestId) {
	try {
		const request = await prisma.enrollRequest.findUnique({
			where: { enrollRequestId }
		});

		if (!request) {
			throw new apiError("Enrollment request not found", 404);
		}

		await prisma.enrollRequest.delete({
			where: { enrollRequestId }
		});
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Error deleting enrollment request", 500);
		}
	}
}

export default {
	createEnrollRequest,
	getAllEnrollRequests,
	getEnrollRequestsForClass,
	getEnrollRequestsForUser,
	updateEnrollRequestStatus,
	deleteEnrollRequest
};
