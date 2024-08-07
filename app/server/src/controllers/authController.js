/**
 * Controller methods for authentication operations.
 * @module authController
 */
import apiError from "../utils/apiError.js";
import authService from "../services/authService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

/**
 * Controller functions for handling authentication related requests.
 * These functions are called by the routes and handle the logic of the request.
 */

/**
 * @async
 * @desc Registers a new user and sends a verification email.
 * @function registerUser
 * @function sendVerificationEmail
 * @param {Object} req - The request object contains the email, password, name, and role of the user.
 * @returns {Object} - The response object with status and message.
 */
export const register = asyncErrorHandler(async (req, res) => {
	const userRegisterInfo = req.body;
	await authService.registerUser(userRegisterInfo);
	await authService.sendVerificationEmail(userRegisterInfo.email);
	return res.status(200).json({
		status: "Success",
		message: `Account successfully created! Verification email sent to ${userRegisterInfo.email}.`
	});
});

/**
 * @async
 * @desc Logs in a user.
 * @function loginUser
 * @param {Object} req - The request object contains the email and password of the user. and checks if the user is already logged in.
 * @param {Function} next - The next middleware function for handling errors.
 * @returns {Object} - The response object with status, message, and user role.
 */
export const login = asyncErrorHandler(async (req, res, next) => {
	if (req.user) {
		return next(new apiError("You are already logged in", 400));
	}
	const { email, password } = req.body;
	const user = await authService.loginUser(email, password);
	req.logIn(user, (err) => {
		if (err) {
			return next(err);
		}
		return res.status(200).json({
			status: "Success",
			message: "You have been logged in!",
			userRole: user.role
		});
	});
});

/**
 * @async
 * @desc Logs out the currently logged in user.
 * @function logoutUser
 * @param {Object} req - The request object to check if the user is still logged in.
 * @param {Function} next - The next middleware function for handling errors.
 * @returns {Object} - The response object with status and message.
 */
export const logout = asyncErrorHandler(async (req, res, next) => {
	// Check if the user is not logged in
	if (!req.isAuthenticated()) {
		return next(new apiError("You are not logged in!", 400));
	}
	req.logout(() => {
		// Destroy session after logging out
		req.session.destroy((err) => {
			if (err) {
				return next(err);
			}
			// Clear the cookie on the client side browser
			res.clearCookie("connect.sid");
			res.status(200).json({
				status: "Success",
				message: "You have been logged out!"
			});
		});
	});
});

/**
 * @async
 * @desc Sends a forgot password email to the user.
 * @function sendForgotPasswordEmail
 * @param {Object} req - The request object containing the email of the user.
 * @returns {Object} - The response object with status and message.
 */
export const forgotPassword = asyncErrorHandler(async (req, res) => {
	const { email } = req.body;
	await authService.sendForgotPasswordEmail(email);
	return res.status(200).json({
		status: "Success",
		message: "Password reset email sent"
	});
});

/**
 * @async
 * @desc Resets the password for a user.
 * @function resetPassword
 * @param {Object} req - The request object containing the new token generated and new password.
 * @returns {Object} - The response object with status and message.
 */
export const resetPassword = asyncErrorHandler(async (req, res) => {
	const { token, newPassword } = req.body;
	await authService.resetPassword(token, newPassword);
	return res.status(200).json({
		status: "Success",
		message: "Password has been reset"
	});
});

/**
 * @async
 * @desc Resends a verification email to the user.
 * @function sendVerificationEmail
 * @param {Object} req - The request object containing the email of the user.
 * @returns {Object} - The response object with status and message.
 */
export const resendVerificationEmail = asyncErrorHandler(async (req, res) => {
	const { email } = req.body;
	await authService.sendVerificationEmail(email);
	return res.status(200).json({
		status: "Success",
		message: "Verification email resent"
	});
});

/**
 * @async
 * @desc Confirms the email address of a user.
 * @function confirmEmail
 * @param {Object} req - The request object containing the token.
 * @returns {Object} - The response object with status and message.
 */
export const confirmEmail = asyncErrorHandler(async (req, res) => {
	const { token } = req.body;
	await authService.confirmEmail(token);
	return res.status(200).json({
		status: "Success",
		message: "Email has been verified"
	});
});

/**
 * @async
 * @desc Checks if the email address is verified using a JWT token. if not verified, the user cannot change the password.
 * @function isEmailVerifiedJWT
 * @param {Object} req - The request object containing the token.
 * @returns {Object} - The response object with status and message.
 */
export const isEmailVerifiedJWT = asyncErrorHandler(async (req, res) => {
	const { token } = req.body;
	console.log("token from controller", token);
	const isVerified = await authService.isEmailVerifiedJWT(token);
	if (isVerified) {
		return res.status(200).json({
			status: "Success",
			message: "Email is verified"
		});
	} else {
		return res.status(403).json({
			status: "Error",
			message:
				"Email is not verified, please verify your email before changing your password"
		});
	}
});

/**
 * @async
 * @desc Fetches the information of the currently logged in user.
 * If the session does not exist, it returns an error.
 * If the user is not authenticated, it destroys the session and returns an error.
 * @function currentUser
 * @param {Object} req - The request object to check if the user is authenticated or a session exists.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The response object with user info, status, and message.
 */
export const currentUser = asyncErrorHandler(async (req, res, next) => {
	// Check if session exists
	if (!req.session) {
		return res.status(401).json({
			status: "Error",
			message: "No User session exists"
		});
	}

	// Check if user is authenticated
	if (!req.isAuthenticated()) {
		// Session exists but user is not authenticated, so destroy the session
		await new Promise((resolve) => {
			req.session.destroy((err) => {
				if (err) {
					console.error("Error destroying session:", err);
				}
				res.clearCookie("connect.sid"); // Clear the session cookie
				resolve();
			});
		});

		return res.status(401).json({
			status: "Error",
			message: "User session is invalid or expired"
		});
	}

	// User is authenticated, fetch and return user info
	try {
		const userInfo = await authService.getCurrentUser(req.user.email);
		return res.status(200).json({
			userInfo: userInfo,
			status: "Success",
			message: "Current user fetched successfully!"
		});
	} catch (error) {
		// Handle errors from getCurrentUser
		return res.status(500).json({
			status: "Error",
			message: "Failed to fetch user information"
		});
	}
});

/**
 * @async
 * @desc Fetches all role requests.
 * @function getAllRoleRequests
 * @returns {Object} - The response object with status, message, and requests.
 */
export const getAllRoleRequests = asyncErrorHandler(async (req, res) => {
	const requests = await authService.getAllRoleRequests();
	return res.status(200).json({
		status: "Success",
		message: "Role requests retrieved",
		data: requests
	});
});

/**
 * @async
 * @desc Deletes a role request.
 * @function deleteRoleRequest
 * @param {Object} req - The request object containing the role request ID in headers.
 * @returns {Object} - The response object with status and message.
 */
export const deleteRoleRequest = asyncErrorHandler(async (req, res) => {
	const roleRequestId = req.params.roleRequestId;
	await authService.deleteRoleRequest(roleRequestId);
	return res.status(200).json({
		status: "Success",
		message: `Role request deleted`
	});
});

/**
 * @async
 * @desc Approves a role request.
 * @function approveRoleRequest
 * @param {Object} req - The request object containing the role request ID in headers.
 * @returns {Object} - The response object with status and message.
 */
export const approveRoleRequest = asyncErrorHandler(async (req, res) => {
	const roleRequestId = req.params.roleRequestId;
	await authService.approveRoleRequest(roleRequestId);
	return res.status(200).json({
		status: "Success",
		message: "Role request approved"
	});
});

/**
 * @async
 * @desc Denies a role request.
 * @function denyRoleRequest
 * @param {Object} req - The request object containing the role request ID in headers.
 * @returns {Object} - The response object with status and message.
 */
export const denyRoleRequest = asyncErrorHandler(async (req, res) => {
	const roleRequestId = req.params.roleRequestId;
	await authService.denyRoleRequest(roleRequestId);
	return res.status(200).json({
		status: "Success",
		message: "Role request denied"
	});
});

/**
 * @async
 * @desc Updates the status of a role request.
 * @function updateRoleRequestStatus
 * @param {Object} req - The request object containing the role request ID in the headers and status in the body.
 * @returns {Object} - The response object with status and message.
 */
export const updateRoleRequestStatus = asyncErrorHandler(async (req, res) => {
	const roleRequestId = req.params.roleRequestId;
	const { status } = req.body;
	await authService.updateRoleRequestStatus(roleRequestId, status);
	return res.status(200).json({
		status: "Success",
		message: "Role request updated"
	});
});

/**
 * @async
 * @desc Applies for a new role request.
 * @function applyForNewRoleRequest
 * @param {Object} req - The request object containing the email and role of the user.
 * @returns {Object} - The response object with status and message.
 */
export const applyForNewRoleRequest = asyncErrorHandler(async (req, res) => {
	const { email, role } = req.body;
	await authService.applyForNewRoleRequest(email, role);
	return res.status(200).json({
		status: "Success",
		message: "Role request sent"
	});
});

export default {
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
};
