import express from "express";
import {
	register,
	login,
	logout,
	forgotPassword,
	resetPassword,
	resendVerificationEmail,
	confirmEmail,
	currentUser,
	getAllRoleRequests,
	deleteRoleRequest,
	approveRoleRequest,
	denyRoleRequest,
	updateRoleRequestStatus,
	applyForNewRoleRequest
} from "../controllers/authController.js";

import { ensureUser, ensureAdmin } from "../middleware/ensureUserTypes.js";

const router = express.Router();

// General Auth routes for User flow at start
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/resend-verification").post(resendVerificationEmail);
router.route("/confirm-email").post(confirmEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/current-user").get(currentUser); // Add the new route

router
	.route("/role-request")
	.post(applyForNewRoleRequest)
	.get(ensureUser, ensureAdmin, getAllRoleRequests);

router
	.route("/role-request/:roleRequestId")
	.delete(ensureUser, ensureAdmin, deleteRoleRequest)
	.put(ensureUser, ensureAdmin, updateRoleRequestStatus); // May switch to patch?

router
	.route("/role-request/approve/:roleRequestId")
	.post(ensureUser, ensureAdmin, approveRoleRequest);

router
	.route("/role-request/deny/:roleRequestId")
	.post(ensureUser, ensureAdmin, denyRoleRequest);

export default router;