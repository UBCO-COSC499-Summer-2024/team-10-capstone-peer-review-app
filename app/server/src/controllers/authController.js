import authService from "../services/authService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

// AUTH CONTROLLERS / HANDLERS
// These functions are called by the routes and meant to handle the logic of the request

export const register = asyncErrorHandler(async (req, res) => {
	const userRegisterInfo = req.body;
	await authService.registerUser(userRegisterInfo);
	await authService.sendVerificationEmail(userRegisterInfo.email);
	return res.status(200).json({
		status: "Success",
		message: "Account successfully created! Verification email sent."
	});
});

export const login = asyncErrorHandler(async (req, res, next) => {
	const { email, password } = req.body;
	const user = await authService.loginUser(email, password);
	req.logIn(user, (err) => {
		if (err) {
			return next(err);
		}
		return res.status(200).json({
			user: user,
			status: "Success",
			message: "You have been logged in!"
		});
	});
});

export const logout = asyncErrorHandler(async (req, res) => {
	req.logout(() => {
		return res.status(200).json({
			status: "Success",
			message: "You have been logged out!"
		});
	});
});

export const forgotPassword = asyncErrorHandler(async (req, res) => {
	const { email } = req.body;
	await authService.sendForgotPasswordEmail(email);
	return res.status(200).json({
		status: "Success",
		message: "Password reset email sent"
	});
});

export const resetPassword = asyncErrorHandler(async (req, res) => {
	const token = req.query.token;
	const { password } = req.body;
	await authService.resetPassword(token, password);
	return res.status(200).json({
		status: "Success",
		message: "Password has been reset"
	});
});

export const resendVerificationEmail = asyncErrorHandler(async (req, res) => {
	const { email } = req.body;
	await authService.sendVerificationEmail(email);
	return res.status(200).json({
		status: "Success",
		message: "Verification email resent"
	});
});

export const confirmEmail = asyncErrorHandler(async (req, res) => {
	const token = req.query.token;
	await authService.confirmEmail(token);
	return res.status(200).json({
		status: "Success",
		message: "Email has been verified"
	});
});

export const getAllRoleRequests = asyncErrorHandler(async (req, res) => {
	const requests = await authService.getAllRoleRequests();
	return res.status(200).json({
		status: "Success",
		data: requests
	});
});

export const deleteRoleRequest = asyncErrorHandler(async (req, res) => {
	const requestId = req.params.requestId;
	await authService.deleteRoleRequest(requestId);
	return res.status(200).json({
		status: "Success",
		message: "Role request deleted"
	});
});

export const approveRoleRequest = asyncErrorHandler(async (req, res) => {
	const requestId = req.params.requestId;
	await authService.approveRoleRequest(requestId);
	return res.status(200).json({
		status: "Success",
		message: "Role request approved"
	});
});

export const denyRoleRequest = asyncErrorHandler(async (req, res) => {
	const requestId = req.params.requestId;
	await authService.denyRoleRequest(requestId);
	return res.status(200).json({
		status: "Success",
		message: "Role request denied"
	});
});

export const updateRoleRequestStatus = asyncErrorHandler(async (req, res) => {
	const requestId = req.params.requestId;
	const { status } = req.body;
	await authService.updateRoleRequestStatus(requestId, status);
	return res.status(200).json({
		status: "Success",
		message: "Role request updated"
	});
});

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
	getRoleRequests,
	deleteRoleRequest,
	approveRoleRequest,
	denyRoleRequest,
	updateRoleRequest,
	applyForNewRoleRequest
};
