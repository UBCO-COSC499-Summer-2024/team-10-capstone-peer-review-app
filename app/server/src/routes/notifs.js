import express from "express";
import {
	getNotifications,
    getNotification,
    updateNotification,
    deleteNotification
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

export default router;
