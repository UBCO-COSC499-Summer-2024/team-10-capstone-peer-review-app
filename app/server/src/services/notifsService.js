/**
 * @module notifsService
*/

import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";
import pkg from '@prisma/client';
import classService from "./classService.js";

const { PrismaClientKnownRequestError } = pkg;

/**
 * @desc Retrieves notifications for a specific user in descending order.
 * @async
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array>} - An array of notifications.
 * @throws {apiError} - If there is an error fetching the notifications.
 */
export async function getNotifications(userId) {
	try {
		const notifs = await prisma.notification.findMany({
			where: {
				receiverId: userId
			},
			orderBy: {
			  createdAt: 'desc', // Sorting by createdAt in descending order (most recent first)
			},
		});
		return notifs;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to fetch notifications", 500);
		}
	}
}

/**
 * @desc Retrieves a specific notification by its ID.
 * @async
 * @param {string} notificationId - The ID of the notification.
 * @returns {Promise<Object>} - The notification object.
 * @throws {apiError} - If there is an error fetching the notification.
 */
export async function getNotification(notificationId) {
	try {
		const notif = await prisma.notification.findUnique({
			where: {
				notificationId: notificationId
			}
		});
		return notif;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to fetch notification", 500);
		}
	}
}

/**
 * @desc Updates a specific notification by its ID.
 * @async
 * @param {string} notificationId - The ID of the notification.
 * @param {Object} updateData - The data to update the notification with.
 * @returns {Promise<Object>} - The updated notification object.
 * @throws {apiError} - If there is an error updating the notification.
 */
export async function updateNotification(notificationId, updateData) {
	try {
		const updatedNotif = await prisma.notification.update({
			where: {
				notificationId: notificationId
			},
			data: updateData
		});
		return updatedNotif;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to update notification", 500);
		}
	}
}

/**
 * @desc Deletes a specific notification by its ID.
 * @async
 * @param {string} notificationId - The ID of the notification.
 * @throws {apiError} - If there is an error deleting the notification.
 */
export async function deleteNotification(notificationId) {
	try {
		await prisma.notification.delete({
			where: {
				notificationId: notificationId
			}
		});
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to delete notification", 500);
		}
	}
}

/**
 * @desc Sends a notification to a specific user.
 * @async
 * @param {string} userId - The ID of the sender.
 * @param {string} title - The title of the notification.
 * @param {string} content - The content of the notification.
 * @param {string} receiverId - The ID of the receiver.
 * @param {string} type - The type of the notification.
 * @returns {Promise<Object>} - A success message.
 * @throws {apiError} - If there is an error sending the notification.
 */
export async function sendNotificationToUser(userId, title, content, receiverId, type) {
	try {
		const usersWithRole = await prisma.user.findUnique({
			where: { userId: receiverId }
		});

		await prisma.notification.create({
			data: {
				receiverId: receiverId,
				title: title,
				content: content,
				senderId: userId,
				type: type || null
			} 
		});

		return { status: "Success", message: "Notification sent to user successfully" };
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to send notification to the user", 500);
		}
	}
}

/**
 * @desc Sends a notification to all users in a specific class.
 * @async
 * @param {string} userId - The ID of the sender.
 * @param {string} title - The title of the notification.
 * @param {string} content - The content of the notification.
 * @param {string} classId - The ID of the class.
 * @param {string} type - The type of the notification.
 * @returns {Promise<Object>} - A success message.
 * @throws {apiError} - If there is an error sending the notification.
 */
export async function sendNotificationToClass(userId, title, content, classId, type) {
	try {
		const usersInClass = await classService.getStudentsByClass(classId);
		
		const notifications = usersInClass.map(user => ({
			receiverId: user.userId,
			title: title,
			content: content,
			senderId: userId,
			type: type || "announcement"
		}));

		await prisma.notification.createMany({ data: notifications });

		return { status: "Success", message: "Notifications sent to class successfully" };
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to send notification to the class", 500);
		}
	}
}

/**
 * @desc Sends a notification to all users in a specific group.
 * @async
 * @param {string} userId - The ID of the sender.
 * @param {string} title - The title of the notification.
 * @param {string} content - The content of the notification.
 * @param {string} groupId - The ID of the group.
 * @param {string} type - The type of the notification.
 * @returns {Promise<Object>} - A success message.
 * @throws {apiError} - If there is an error sending the notification.
 */
export async function sendNotificationToGroup(userId, title, content, groupId, type) {
	try {
		const group = await prisma.group.findUnique({
			where: {
				groupId: groupId
			},
			include: {
				students: true
			}
		});

		// Check if the group exists or has students
		if (!group) {
			throw new apiError("Group not found", 404);
		} else if (group.students.length === 0) {
			throw new apiError("No users found to send notifications to in the group", 404);
		}

		const notifications = group.students.map(user => ({
			receiverId: user.userId,
			title: title,
			content: content,
			senderId: userId,
			type: type || "group"
		}));

		await prisma.notification.createMany({ data: notifications });

		return { status: "Success", message: "Notifications sent to group successfully" };
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to send notification to the group", 500);
		}
	}
}

/**
 * @desc Sends a notification to all users with a specific role.
 * @async
 * @param {string} userId - The ID of the sender.
 * @param {string} title - The title of the notification.
 * @param {string} content - The content of the notification.
 * @param {string} role - The role of the users.
 * @param {string} type - The type of the notification.
 * @returns {Promise<Object>} - A success message.
 * @throws {apiError} - If there is an error sending the notification.
 */
export async function sendNotificationToRole(userId, title, content, role, type) {
	try {
		const usersWithRole = await prisma.user.findMany({
			where: { role: role }
		});

		const notifications = usersWithRole.map(user => ({
			receiverId: user.userId,
			title: title,
			content: content,
			senderId: userId,
			type: type || role
		}));

		await prisma.notification.createMany({ data: notifications });

		return { status: "Success", message: "Notifications sent to role successfully" };
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to send notification to everyone of the role " + role, 500);
		}
	}
}

/**
 * @desc Sends a notification to all users except the current user.
 * @async
 * @param {string} userId - The ID of the sender.
 * @param {string} title - The title of the notification.
 * @param {string} content - The content of the notification.
 * @param {string} type - The type of the notification.
 * @returns {Promise<Object>} - A success message.
 * @throws {apiError} - If there is an error sending the notification.
 */
export async function sendNotificationToAll(userId, title, content, type) {
	try {
		const users = await prisma.user.findMany({
			where: {
				userId: {
					not: userId
			  	}
			}
		});

		const notifications = users.map(user => ({
			receiverId: user.userId,
			title: title,
			content: content,
			senderId: userId,
		}));

		await prisma.notification.createMany({ data: notifications });

		return { status: "Success", message: "Notifications sent to every user (excluding current user)" };
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to send notification to everyone", 500);
		}
	}
}

export default {
    getNotifications,
	getNotification,
	updateNotification,
	deleteNotification,
	sendNotificationToUser,
	sendNotificationToClass,
	sendNotificationToGroup,
	sendNotificationToRole,
	sendNotificationToAll
};
