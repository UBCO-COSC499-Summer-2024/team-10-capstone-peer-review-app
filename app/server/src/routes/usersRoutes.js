import express from "express";
import {
	getAllUsers,
	getUsersByRole,
	getUserClasses,
	getUserAssignments,
	getAllGroups,
	getGroups,
	updateProfile,
	getAdminReports,
	getInstructorReports,
	sendReportToInstructor,
	sendReportToAdmin,
	getSentReports,
	unResolveReport,
	resolveReport,
	deleteReport
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

router.route("/all").get(ensureAdmin, getAllUsers);

// This is primarly used in the ForgotPassword component
router
	.route("/role/:role")
	.get(ensureInstructorOrAdmin, getUsersByRole);

// Classes & Groups
router.route("/get-classes").post(getUserClasses);
router.route("/get-assignments").post(getUserAssignments);
router.route("/get-groups").post(getGroups);
router.route("/get-all-groups").post(ensureAdmin, getAllGroups);

router.route("/update-profile").post(updateProfile);

// Reports
router.route("/send-report-to-instructor").post(sendReportToInstructor);
router.route("/send-report-to-admin").post(sendReportToAdmin);
router.route("/resolve-report").post(ensureInstructorOrAdmin, resolveReport);
router.route("/unresolve-report").post(ensureInstructorOrAdmin, unResolveReport);
router.route("/delete-report").post(ensureInstructorOrAdmin, deleteReport);

router.route("/get-admin-reports").post(ensureAdmin, getAdminReports);
router.route("/get-instructor-reports").post(ensureInstructorOrAdmin, getInstructorReports);
router.route("/get-sent-reports").post(getSentReports);

export default router;
