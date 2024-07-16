import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";
import pkg from '@prisma/client';

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

export default {
    getNotifications,
	getNotification,
	updateNotification,
	deleteNotification
};
