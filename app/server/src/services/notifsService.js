import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";
import pkg from '@prisma/client';
import classService from "./classService.js";

const { PrismaClientKnownRequestError } = pkg;

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
