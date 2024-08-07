/**
 * @module auth
 * @desc This module handles the routes related to authentication in the application.
 */
import express from "express";
import {
	register,
	login,
	logout,
	forgotPassword,
	resetPassword,
	resendVerificationEmail,
	confirmEmail,
	isEmailVerifiedJWT,
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

/**
 * @async
 * @route POST /auth/register
 * @desc Registers a new user and sends a verification email.
 * @function register
 * @param {Object} req - The request object contains the email, password, name, and role of the user.
 * @returns {Object} - The response object with status and message.
 */
router.route("/register").post(register);

/**
 * @async
 * @route POST /auth/login
 * @desc Logs in a user.
 * @function login
 * @param {Object} req - The request object contains the email and password of the user. and checks if the user is already logged in.
 * @returns {Object} - The response object with status, message, and user role.
 */
router.route("/login").post(login);

/**
 * @async
 * @route POST /auth/logout
 * @desc Logs out the currently logged in user.
 * @function logout
 * @param {Object} req - The request object to check if the user is still logged in.
 * @returns {Object} - The response object with status and message.
 */
router.route("/logout").post(logout);

/**
 * @async
 * @route POST /auth/resend-verification
 * @desc Resends a verification email to the user.
 * @function resendVerificationEmail
 * @param {Object} req - The request object containing the email of the user.
 * @returns {Object} - The response object with status and message.
 */
router.route("/resend-verification").post(resendVerificationEmail);

/**
 * @async
 * @route POST /auth/confirm-email
 * @desc Confirms the email address of a user.
 * @function confirmEmail
 * @param {Object} req - The request object containing the token.
 * @returns {Object} - The response object with status and message.
 */
router.route("/confirm-email").post(confirmEmail);

/**
 * @async
 * @route POST /auth/is-email-verified-jwt
 * @desc Checks if the email address is verified using a JWT token. if not verified, the user cannot change the password.
 * @function isEmailVerifiedJWT
 * @param {Object} req - The request object containing the token.
 * @returns {Object} - The response object with status and message.
 */
router.route("/is-email-verified-jwt").post(isEmailVerifiedJWT);

/**
 * @async
 * @route POST /auth/forgot-password
 * @desc Sends a forgot password email to the user.
 * @function forgotPassword
 * @param {Object} req - The request object containing the email of the user.
 * @returns {Object} - The response object with status and message.
 */
router.route("/forgot-password").post(forgotPassword);

/**
 * @async
 * @route POST /auth/reset-password
 * @desc Resets the password for a user.
 * @function resetPassword
 * @param {Object} req - The request object containing the new token generated and new password.
 * @returns {Object} - The response object with status and message.
 */
router.route("/reset-password").post(resetPassword);

/**
 * @async
 * @route GET /auth/current-user
 * @desc Fetches the information of the currently logged in user.
 * If the session does not exist, it returns an error.
 * If the user is not authenticated, it destroys the session and returns an error.
 * @function currentUser
 * @param {Object} req - The request object to check if the user is authenticated or a session exists.
 * @returns {Object} - The response object with user info, status, and message.
 */
router.route("/current-user").get(currentUser);

/**
 * @async
 * @route GET /auth/role-request
 * @desc Fetches all role requests.
 * @function getAllRoleRequests
 * @returns {Object} - The response object with status, message, and requests.
 */
/**
 * @async
 * @route POST /auth/role-request
 * @desc Applies for a new role request.
 * @function applyForNewRoleRequest
 * @param {Object} req - The request object containing the email and role of the user.
 * @returns {Object} - The response object with status and message.
 */
router
	.route("/role-request")
	.post(applyForNewRoleRequest)
	.get(ensureUser, ensureAdmin, getAllRoleRequests);

/**
 * @async
 * @route DELETE /auth/role-request/:roleRequestId
 * @desc Deletes a role request.
 * @function deleteRoleRequest
 * @param {Object} req - The request object containing the role request ID in headers.
 * @returns {Object} - The response object with status and message.
 */

/**
 * @async
 * @route PUT /auth/role-request/:roleRequestId
 * @desc Updates the status of a role request.
 * @function updateRoleRequestStatus
 * @param {Object} req - The request object containing the role request ID in the headers and status in the body.
 * @returns {Object} - The response object with status and message.
 */
router
	.route("/role-request/:roleRequestId")
	.delete(ensureUser, ensureAdmin, deleteRoleRequest)
	.put(ensureUser, ensureAdmin, updateRoleRequestStatus); // May switch to patch?

/**
 * @async
 * @route POST /auth/role-request/approve/:roleRequestId
 * @desc Approves a role request.
 * @function approveRoleRequest
 * @param {Object} req - The request object containing the role request ID in headers.
 * @returns {Object} - The response object with status and message.
 */
router
	.route("/role-request/approve/:roleRequestId")
	.post(ensureUser, ensureAdmin, approveRoleRequest);

/**
 * @async
 * @route POST /auth/role-request/deny/:roleRequestId
 * @desc Denies a role request.
 * @function denyRoleRequest
 * @param {Object} req - The request object containing the role request ID in headers.
 * @returns {Object} - The response object with status and message.
 */
router
	.route("/role-request/deny/:roleRequestId")
	.post(ensureUser, ensureAdmin, denyRoleRequest);

export default router;