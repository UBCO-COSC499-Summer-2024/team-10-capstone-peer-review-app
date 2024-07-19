import notifsService from "../services/notifsService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

export const getNotifications = asyncErrorHandler(async (req, res) => {
	const userId = req.body.userId;
	const notifsData = await notifsService.getNotifications(userId);
	res.status(200).json({
		status: "Success",
		message: "Notifications fetched",
		data: notifsData
	});
});

export const getNotification = asyncErrorHandler(async (req, res) => {
	const notificationId = req.params.notificationId;
	const notifData = await notifsService.getNotification(notificationId);
	res.status(200).json({
		status: "Success",
		message: "Notification fetched",
		data: notifData
	});
});

export const updateNotification = asyncErrorHandler(async (req, res) => {
	const notificationId = req.params.notificationId;
	const updateData = req.body;
	const notifData = await notifsService.updateNotification(notificationId, updateData);
	res.status(200).json({
		status: "Success",
		message: "Notification updated",
		data: notifData
	});
});

export const deleteNotification = asyncErrorHandler(async (req, res) => {
	const notificationId = req.params.notificationId;
	const notifData = await notifsService.deleteNotification(notificationId);
	res.status(200).json({
		status: "Success",
		message: "Notification deleted"
	});
});

export const sendNotificationToUser = asyncErrorHandler(async (req, res) => {
	const { userId, title, content, receiverId } = req.body;
	const notifData = await notifsService.sendNotificationToUser(userId, title, content, receiverId);
	res.status(200).json({
		status: "Success",
		message: "Notification sent to user"
	});
});

export const sendNotificationToClass = asyncErrorHandler(async (req, res) => {
	const { userId, title, content, classId } = req.body;
	const notifData = await notifsService.sendNotificationToClass(userId, title, content, classId);
	res.status(200).json({
		status: "Success",
		message: "Notification sent to all members of the class"
	});
});

export const sendNotificationToGroup = asyncErrorHandler(async (req, res) => {
	const { userId, title, content, groupId } = req.body;
	const notifData = await notifsService.sendNotificationToGroup(userId, title, content, groupId);
	res.status(200).json({
		status: "Success",
		message: "Notification sent to all members of the group"
	});
});

export const sendNotificationToRole = asyncErrorHandler(async (req, res) => {
	const { userId, title, content, role } = req.body;
	const notifData = await notifsService.sendNotificationToRole(userId, title, content, role);
	res.status(200).json({
		status: "Success",
		message: "Notification sent to all members of the role"
	});
});

export const sendNotificationToAll = asyncErrorHandler(async (req, res) => {
	const { userId, title, content } = req.body;
	const notifData = await notifsService.sendNotificationToAll(userId, title, content);
	res.status(200).json({
		status: "Success",
		message: "Notification sent to all users (excluding current user)"
	});
});

export default {
    getNotifications,
	getNotification,
	updateNotification,
	deleteNotification,
	sendNotificationToUser,
	sendNotificationToClass,
	sendNotificationToGroup,
	sendNotificationToRole
};
