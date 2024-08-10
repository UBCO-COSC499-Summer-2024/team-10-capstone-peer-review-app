
/**
 * @module notifsController
 * @desc Controller for handling notifications related operations
 */

import notifsService from "../services/notifsService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

/**
 * @async
 * @desc Get all notifications for a user
 * @function getNotifications
 * @param {Object} req - The request object containing the userId
 * @returns {Object} - The response object with notifications data
 */
export const getNotifications = asyncErrorHandler(async (req, res) => {
	const userId = req.body.userId;
	const notifsData = await notifsService.getNotifications(userId);
	res.status(200).json({
		status: "Success",
		message: "Notifications fetched",
		data: notifsData
	});
});

/**
 * @async
 * @desc Get a specific notification by its ID
 * @function getNotification
 * @param {Object} req - The request object containing the notificationId
 * @returns {Object} - The response object with the notification data
 */
export const getNotification = asyncErrorHandler(async (req, res) => {
	const notificationId = req.params.notificationId;
	const notifData = await notifsService.getNotification(notificationId);
	res.status(200).json({
		status: "Success",
		message: "Notification fetched",
		data: notifData
	});
});

/**
 * @async
 * @desc Update a notification by its ID
 * @function updateNotification
 * @param {Object} req - The request object containing the notificationId and the updated data
 * @returns {Object} - The response object with the updated notification data
 */
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

/**
 * @async
 * @desc Delete a notification by its ID
 * @function deleteNotification
 * @param {Object} req - The request object containing the notificationId
 * @returns {Object} - The response object indicating the success of the deletion
 */
export const deleteNotification = asyncErrorHandler(async (req, res) => {
	const notificationId = req.params.notificationId;
	const notifData = await notifsService.deleteNotification(notificationId);
	res.status(200).json({
		status: "Success",
		message: "Notification deleted"
	});
});

/**
 * @async
 * @desc Send a notification to a specific user
 * @function sendNotificationToUser
 * @param {Object} req - The request object containing the userId, title, content, and receiverId
 * @returns {Object} - The response object indicating the success of sending the notification
 */
export const sendNotificationToUser = asyncErrorHandler(async (req, res) => {
	const { userId, title, content, receiverId } = req.body;
	const notifData = await notifsService.sendNotificationToUser(userId, title, content, receiverId);
	res.status(200).json({
		status: "Success",
		message: "Notification sent to user"
	});
});

/**
 * @async
 * @desc Send a notification to all members of a specific class
 * @function sendNotificationToClass
 * @param {Object} req - The request object containing the userId, title, content, and classId
 * @returns {Object} - The response object indicating the success of sending the notification
 */
export const sendNotificationToClass = asyncErrorHandler(async (req, res) => {
	const { userId, title, content, classId } = req.body;
	const notifData = await notifsService.sendNotificationToClass(userId, title, content, classId);
	res.status(200).json({
		status: "Success",
		message: "Notification sent to all members of the class"
	});
});

/**
 * @async
 * @desc Send a notification to all members of a specific group
 * @function sendNotificationToGroup
 * @param {Object} req - The request object containing the userId, title, content, and groupId
 * @returns {Object} - The response object indicating the success of sending the notification
 */
export const sendNotificationToGroup = asyncErrorHandler(async (req, res) => {
	const { userId, title, content, groupId } = req.body;
	const notifData = await notifsService.sendNotificationToGroup(userId, title, content, groupId);
	res.status(200).json({
		status: "Success",
		message: "Notification sent to all members of the group"
	});
});

/**
 * @async
 * @desc Send a notification to all members of a specific role
 * @function sendNotificationToRole
 * @param {Object} req - The request object containing the userId, title, content, and role
 * @returns {Object} - The response object indicating the success of sending the notification
 */
export const sendNotificationToRole = asyncErrorHandler(async (req, res) => {
	const { userId, title, content, role } = req.body;
	const notifData = await notifsService.sendNotificationToRole(userId, title, content, role);
	res.status(200).json({
		status: "Success",
		message: "Notification sent to all members of the role"
	});
});

/**
 * @async
 * @desc Send a notification to all users (excluding the current user)
 * @function sendNotificationToAll
 * @param {Object} req - The request object containing the userId, title, and content
 * @returns {Object} - The response object indicating the success of sending the notification
 */
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
