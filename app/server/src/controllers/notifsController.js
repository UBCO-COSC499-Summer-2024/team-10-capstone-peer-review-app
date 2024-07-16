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

export default {
    getNotifications,
	getNotification,
	updateNotification,
	deleteNotification
};
