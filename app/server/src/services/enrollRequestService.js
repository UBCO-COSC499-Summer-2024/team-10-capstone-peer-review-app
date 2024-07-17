import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

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

		if (existingRequest) {
			throw new apiError(
				"An enrollment request for this class already exists",
				400
			);
		}

		const userInClass = await prisma.userInClass.findUnique({
			where: {
				UserInClassId: {
					userId,
					classId
				}
			}
		});

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
		throw new apiError(error.message, 500);
	}
}

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

export async function updateEnrollRequestStatus(
	enrollRequestId,
	status,
	receiverMessage
) {
	try {
		const updatedRequest = await prisma.enrollRequest.update({
			where: { enrollRequestId },
			data: { status, receiverMessage }
		});

		if (status === "APPROVED") {
			const userInClass = await prisma.userInClass.findUnique({
				where: {
					UserInClassId: {
						userId: updatedRequest.userId,
						classId: updatedRequest.classId
					}
				}
			});

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

		if (status === "DENIED") {
			const userInClass = await prisma.userInClass.findUnique({
				where: {
					UserInClassId: {
						userId: updatedRequest.userId,
						classId: updatedRequest.classId
					}
				}
			});

			if (userInClass) {
				await prisma.userInClass.delete({
					where: {
						UserInClassId: {
							userId: updatedRequest.userId,
							classId: updatedRequest.classId
						}
					}
				});
			}
		}

		return updatedRequest;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw error;
		}
	}
}

export async function deleteEnrollRequest(enrollRequestId, userId) {
	try {
		const request = await prisma.enrollRequest.findUnique({
			where: { enrollRequestId }
		});
		console.log(request);
		console.log(userId);
		if (!request || request.userId !== userId) {
			throw new apiError("Enrollment request not found or unauthorized", 404);
		}

		await prisma.enrollRequest.delete({
			where: { enrollRequestId }
		});
	} catch (error) {
		console.log(error);
		throw new apiError("Error deleting enrollment request", 500);
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
