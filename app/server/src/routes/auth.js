import express from "express";

import {
	register,
	login,
	logout,
	forgotPassword,
	resetPassword,
	resendVerificationEmail,
	confirmEmail
} from "../controllers/authController.js";

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").post(logout);
// May need to refactor how this works for frontend deployment
router.route("/resend-verification").post(resendVerificationEmail);
// May need to refactor how this works for frontend deployment
router.route("/confirm-email").post(confirmEmail);

router.route("/forgot-password").post(forgotPassword);

router.route("/reset-password").post(resetPassword);

export default router;
