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

router
	.route("/:notificationId")
	.get(getNotification)
	.delete(deleteNotification)
	.put(ensureAdmin, updateNotification);

router.route("/get-notifications").post(getNotifications);

router.route("/send-to-user").post(ensureInstructorOrAdmin, sendNotificationToUser);
router.route("/send-to-class").post(ensureInstructorOrAdmin, sendNotificationToClass);
router.route("/send-to-group").post(sendNotificationToGroup);
router.route("/send-to-role").post(ensureAdmin, sendNotificationToRole);
router.route("/send-to-all").post(ensureAdmin, sendNotificationToAll);

export default router;
