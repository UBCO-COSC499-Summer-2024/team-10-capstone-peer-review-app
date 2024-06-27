import {
	register,
	login,
	logout,
	forgotPassword,
	resetPassword,
	resendVerificationEmail,
	confirmEmail,
	getAllRoleRequests,
	deleteRoleRequest,
	approveRoleRequest,
	denyRoleRequest,
	updateRoleRequestStatus,
	applyForNewRoleRequest
} from "../controllers/authController.js";

import { ensureUser, ensureAdmin } from "../middleware/ensureUserTypes.js";

import express from "express";

const router = express.Router();

// General Auth routes for User flow at start
router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").post(logout);

router.route("/resend-verification").post(resendVerificationEmail);

router.route("/confirm-email").post(confirmEmail);

router.route("/forgot-password").post(forgotPassword);

router.route("/reset-password").post(resetPassword);

router
	.route("/role-request")
	.post(applyForNewRoleRequest)
	.get(ensureUser, ensureAdmin, getAllRoleRequests);

router
	.route("/role-request/:requestId")
	.delete(ensureUser, ensureAdmin, deleteRoleRequest)
	.put(ensureUser, ensureAdmin, updateRoleRequestStatus); // May switch to patch?

router
	.route("/role-request/approve/:requestId")
	.post(ensureUser, ensureAdmin, approveRoleRequest);

router
	.route("/role-request/deny/:requestId")
	.post(ensureUser, ensureAdmin, denyRoleRequest);

export default router;
