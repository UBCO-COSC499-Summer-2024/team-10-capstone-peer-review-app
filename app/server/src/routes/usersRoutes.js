import express from "express";
import {
	getAllUsers,
	getUsersByRole,
	getUserClasses,
	getUserAssignments,
	getGroups
} from "../controllers/userController.js";

import {
	ensureUser,
	ensureAdmin,
	ensureInstructorOrAdmin
} from "../middleware/ensureUserTypes.js";

const router = express.Router();

router.get("/", (req, res) => {
	res.status(200).send("User route is working!");
});

router.route("/all").get(ensureUser, ensureAdmin, getAllUsers);

router
	.route("/role/:role")
	.get(ensureUser, ensureInstructorOrAdmin, getUsersByRole);
// This is primarly used in the ForgotPassword component

// Why are these post requests? They should be get requests
router.route("/get-classes").post(getUserClasses);
router.route("/get-assignments").post(getUserAssignments);
router.route("/get-groups").post(getGroups);

export default router;
