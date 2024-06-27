import express from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
  confirmEmail,
  currentUser // Import the new controller method
} from "../controllers/authController.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/resend-verification").post(resendVerificationEmail);
router.route("/confirm-email").post(confirmEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/current-user").get(currentUser); // Add the new route

export default router;
