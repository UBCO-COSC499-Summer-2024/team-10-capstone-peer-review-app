/**
 * @module routes/notifs
 * @file This file defines the routes for notification operations.
 */
import express from "express";
import {
	getNotifications,
    getNotification,
    updateNotification,
    deleteNotification,
	sendNotificationToClass,
	sendNotificationToGroup,
	sendNotificationToRole,
    sendNotificationToAll,
    sendNotificationToUser
} from "../controllers/notifsController.js";

import {
	ensureAdmin,
	ensureInstructorOrAdmin
} from "../middleware/ensureUserTypes.js";

const router = express.Router();


router.get("/", (req, res) => {
	res.status(200).send("Notif route is working!");
});

/**
 * @route GET or DELETE or PUT /notifs/:notificationId
 * @desc Get, delete, or update a notification
 * @function getNotification or deleteNotification or updateNotification
 * @returns {JSON} The response object with the notification data
 */
router
	.route("/:notificationId")
	.get(getNotification)
	.delete(deleteNotification)
	.put(ensureAdmin, updateNotification);

/**
 * @route POST /notifs/get-notifications
 * @desc Get all notifications for a user
 * @function getNotifications
 * @param {Object} req - The request object containing the userId
 * @returns {Object} - The response object with notifications data
 */
router.route("/get-notifications").post(getNotifications);

/**
 * @route POST /notifs/send-to-user
 * @desc Send a notification to a user
 * @function sendNotificationToUser
 * @param {Object} req - The request object containing the userId and the notification data
 * @returns {Object} - The response object with the notification data
 */
router.route("/send-to-user").post(ensureInstructorOrAdmin, sendNotificationToUser);
/**
 * @route POST /notifs/send-to-class
 * @desc Send a notification to a class
 * @function sendNotificationToClass
 * @param {Object}
 * @returns {Object} - The response object with the notification data
 * @middleware ensureInstructorOrAdmin
 */
router.route("/send-to-class").post(ensureInstructorOrAdmin, sendNotificationToClass);
/**
 * @route POST /notifs/send-to-group
 * @desc Send a notification to a group
 * @function sendNotificationToGroup
 * @param {Object}
 * @returns {Object} - The response object with the notification data
 */
router.route("/send-to-group").post(sendNotificationToGroup);
/**
 * @route POST /notifs/send-to-role
 * @desc Send a notification to a role
 * @function sendNotificationToRole
 * @param {Object}
 * @returns {Object} - The response object with the notification data
 */
router.route("/send-to-role").post(ensureAdmin, sendNotificationToRole);
/**
 * @route POST /notifs/send-to-all
 * @desc Send a notification to all users
 * @function sendNotificationToAll
 * @param {Object}
 * @returns {Object} - The response object with the notification data
 */
router.route("/send-to-all").post(ensureAdmin, sendNotificationToAll);

export default router;
