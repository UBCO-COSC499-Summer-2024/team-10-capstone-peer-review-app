import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prismaClient.js";
import sendEmail from "../utils/mailer.js";
import apiError from "../utils/apiError.js";
import {
	sendNotificationToRole,
	sendNotificationToUser
} from "./notifsService.js";

/**
 * @module authService
 * @desc This module provides authentication services for user registration, login, email verification, password reset, and role requests.
 */

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @async
 * @function checkUserByEmail
 * @desc Check if a user with the given email exists in the database.
 * @param {string} email - The email of the user to check.
 * @returns {Promise<Object|null>} - The user object if found, otherwise null.
 */
async function checkUserByEmail(email) {
	return await prisma.user.findUnique({ where: { email } });
}

/**
 * @async
 * @function checkRequestByEmail
 * @desc Check if a role request with the given email exists in the database.
 * @param {string} email - The email of the user to check.
 * @returns {Promise<Object|null>} - The role request object if found, otherwise null.
 */
async function checkRequestByEmail(email) {
	const user = await prisma.user.findUnique({
		where: { email },
		include: { RoleRequest: true }
	});

	return user?.RoleRequest || null;
}

/**
 * @function capitalizeFirstLetter
 * @desc Capitalize the first letter of a string.
 * @param {string} string - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
function capitalizeFirstLetter(string) {
	if (!string) {
		return "";
	}
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

/**
 * @async
 * @function registerUser
 * @desc Register a new user.
 * @param {Object} userDetails - The details of the user to register.
 * @param {string} userDetails.email - The email of the user.
 * @param {string} userDetails.password - The password of the user.
 * @param {string} userDetails.firstname - The first name of the user.
 * @param {string} userDetails.lastname - The last name of the user.
 * @param {string} userDetails.role - The role of the user.
 * @throws {apiError} - If a user with that email already exists.
 * @throws {apiError} - If there is an error creating the role request.
 * @throws {Error} - If there is an unexpected error.
 * @returns {Promise<void>}
 */
export async function registerUser(userDetails) {
	try {
		const { email, password, firstname, lastname, role } = userDetails;
		// check if user already exists
		const existingUser = await checkUserByEmail(email);
		if (existingUser) {
			throw new apiError("User with that email already exists", 400);
		}
		// check if role is valid
		const isRoleActivated = role === "STUDENT" ? true : false;
		// hash password
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				firstname,
				lastname,
				role,
				isRoleActivated
			}
		});

		// if role is not student, create a role request
		if (role !== "STUDENT") {
			try {
				await createRoleRequest(user.userId, role);
			} catch (error) {
				throw new apiError("Error creating role request", 500);
			}
		}
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw error;
		}
	}
}

/**
 * @async
 * @function loginUser
 * @desc Log in a user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object>} - The user object if login is successful.
 * @throws {apiError} - If there is no user with that email.
 * @throws {apiError} - If the password is incorrect.
 * @throws {apiError} - If the email is not verified.
 * @throws {apiError} - If the role is not activated.
 * @throws {apiError} - If there is an unexpected error.
 * @throws {Error} - If there is an unexpected error.
 */
export async function loginUser(email, password) {
	try {
		// check if user exists
		const user = await checkUserByEmail(email);
		if (!user) {
			throw new apiError("No user with that email", 404);
		}
		// check if password matches
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			throw new apiError("Invalid password", 400);
		}
		// check if email is verified and role is activated
		if (!user.isEmailVerified && !user.isRoleActivated) {
			throw new apiError(
				"Your role and email needs to be verified before logging in",
				400
			);
		} else if (!user.isEmailVerified) {
			throw new apiError("Please verify your email before logging in", 400);
		} else if (!user.isRoleActivated) {
			throw new apiError(
				"Your role needs to be approved before logging in.",
				400
			);
		}
		// Need to return user object to be used in the login controller
		return user;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw error;
		}
	}
}

/**
 * @async
 * @function sendVerificationEmail
 * @desc Send a verification email to a user.
 * @param {string} email - The email of the user.
 * @returns {Promise<void>}
 * @throws {apiError} - If there is no user with that email.
 * @throws {Error} - If there is an unexpected error.
 * @throws {apiError} - If there is an error sending the email.
 * @throws {apiError} - If the email is already verified.
 * @throws {apiError} - If the email is not verified using a JWT token.
 */
export async function sendVerificationEmail(email) {
	try {
		// check if user exists
		const user = await checkUserByEmail(email);
		if (!user) {
			throw new apiError("No user with that email", 404);
		} else if (user.isEmailVerified) {
			throw new apiError("Email is already verified", 400);
		}
		// check if email is already verified
		const verifyEmailToken = jwt.sign({ email }, JWT_SECRET, {
			expiresIn: "5m"
		});
		// TODO refactor resetLink for frontend deployment
		const verificationLink = `http://localhost:3000?verifyEmailToken=${verifyEmailToken}`;

		const htmlContent = `
		<html>
				<head>
						<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap" rel="stylesheet">
						<style>* {font-family: "Nunito Sans", sans-serif;}</style>
				</head>
				<body style="background-color: #F3F4F6; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
						<div style="display: flex; justify-content: center; align-items: center; max-width: 500px; margin: auto; padding: 20px;">
								<div style="background-color: white; border-radius: 8px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); width: 100%; padding: 24px; text-align: center;">
												<h3 style="font-size: 24px; font-weight: 600; color: #111827;">Welcome to PeerGrade! 👋</h3>
												<p style="font-size: 14px; color: #6B7280;">Thanks for signing up. Please verify your email address to get started.</p>
												<p style="font-size: 14px; color: #6B7280; margin-bottom: 16px;">Click the link below to verify your email. The link will expire in 5 minutes:</p>
												<a href="${verificationLink}" style="display: inline-block; background-color: #111827; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-size: 14px;">Verification Link</a>
										<div style="text-align: center; padding-top: 1em;">
												<p style="font-size: 14px; color: #6B7280;">If you did not sign up for PeerGrade, please ignore this email.</p>
										</div>
								</div>
						</div>
				</body>
		</html>`;

		try {
			await sendEmail(email, "Email Verification", htmlContent);
		} catch (error) {
			throw new apiError("Error sending email", 500);
		}
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw error;
		}
	}
}

/**
 * @async
 * @function resetPassword
 * @desc Reset the password of a user.
 * @param {string} token - The reset password token.
 * @param {string} newPassword - The new password.
 * @returns {Promise<void>}
 * @throws {apiError} - If the reset password link has expired.
 * @throws {apiError} - If the new password is the same as the previous password.
 * @throws {Error} - If there is an unexpected error.
 */
export async function resetPassword(token, newPassword) {
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
		const user = await checkUserByEmail(decoded.email);
		const isSamePassword = await bcrypt.compare(newPassword, user.password);
		if (isSamePassword) {
			throw new apiError(
				"Password cannot be the same as the previous password",
				400
			);
		}
		await prisma.user.update({
			where: { email: decoded.email },
			data: { password: hashedPassword }
		});
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			throw new apiError("Your reset password link has expired", 401);
		} else if (error instanceof apiError) {
			throw error;
		} else {
			throw error;
		}
	}
}

/**
 * @async
 * @function sendForgotPasswordEmail
 * @desc Send a forgot password email to a user.
 * @param {string} email - The email of the user.
 * @returns {Promise<void>}
 */
export async function sendForgotPasswordEmail(email) {
	try {
		// check if user exists
		const user = await checkUserByEmail(email);
		if (!user) {
			throw new apiError("No user with that email", 404);
		}
		// send forgot password email
		const forgotPasswordToken = jwt.sign({ email }, JWT_SECRET, {
			expiresIn: "5m"
		});
		// TODO refactor resetLink for frontend deployment
		const resetLink = `http://localhost:3000?forgotPasswordToken=${forgotPasswordToken}`;
		const htmlContent = `
		<html>
			<head>
				<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap" rel="stylesheet">
				<style>* {font-family: "Nunito Sans", sans-serif;}</style>
			</head>
			<body style="background-color: #F3F4F6; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
				<div style="display: flex; justify-content: center; align-items: center; max-width: 500px; margin: auto; padding: 20px;">
					<div style="background-color: white; border-radius: 8px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); width: 100%; padding: 24px; text-align: center;">
						<h3 style="font-size: 24px; font-weight: 600; color: #111827;">Welcome back to PeerGrade! 👋</h3>
						<p style="font-size: 14px; color: #6B7280;">You requested a password reset.</p>
						<p style="font-size: 14px; color: #6B7280; margin-bottom: 16px;">Click this link to reset your password. The link will expire in 5 minutes:</p>
						<a href="${resetLink}" style="display: inline-block; background-color: #111827; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-size: 14px;">Reset Password</a>
						<div style="text-align: center; padding-top: 1em;">
							<p style="font-size: 14px; color: #6B7280;">If you did not request to reset your password for PeerGrade, please ignore this email.</p>
						</div>
					</div>
				</div>
			</body>
		</html>`;
		try {
			await sendEmail(email, "Password Reset", htmlContent);
		} catch (error) {
			throw new apiError("Error sending email", 500);
		}
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw error;
		}
	}
}

/**
 * @async
 * @function confirmEmail
 * @desc Confirm the email of a user.
 * @param {string} token - The email confirmation token.
 * @returns {Promise<void>}
 * @throws {apiError} - If the email verification link has expired.
 * @throws {apiError} - If there is no user with that email.
 * @throws {Error} - If there is an unexpected error.
 */
export async function confirmEmail(token) {
	try {
		// check if user exists
		const decoded = jwt.verify(token, JWT_SECRET);
		const user = await checkUserByEmail(decoded.email);
		if (!user) {
			throw new apiError("No user with that email", 404);
		}
		// update user email verification status
		await prisma.user.update({
			where: { email: decoded.email },
			data: { isEmailVerified: true }
		});
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			throw new apiError("Your verify email link has expired", 401);
		} else if (error instanceof apiError) {
			throw error;
		} else {
			throw error;
		}
	}
}

/**
 * @async
 * @function isEmailVerifiedJWT
 * @desc Check if the email of a user is verified using a JWT token.
 * @param {string} token - The email verification token.
 * @returns {Promise<boolean>} - True if the email is verified, otherwise false.
 * @throws {apiError} - If the email verification link has expired.
 * @throws {apiError} - If there is no user with that email.
 * @throws {Error} - If there is an unexpected error.
 */

export async function isEmailVerifiedJWT(token) {
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const user = await checkUserByEmail(decoded.email);
		if (!user) {
			throw new apiError("No user with that email", 404);
		}
		return user.isEmailVerified;
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			throw new apiError("Your email verification link has expired", 401);
		} else if (error instanceof apiError) {
			throw error;
		} else {
			throw error;
		}
	}
}

/**
 * @async
 * @function createRoleRequest
 * @desc Create a role request for a user.
 * @param {number} userId - The ID of the user.
 * @param {string} role - The role requested by the user.
 * @throws {apiError} - If there is an error creating the role request.
 * @throws {Error} - If there is an unexpected error.
 * @returns {Promise<void>}
 */
async function createRoleRequest(userId, role) {
	await prisma.roleRequest.create({
		data: {
			userId: userId,
			roleRequested: role,
			status: "PENDING"
		}
	});

	const userInfo = await prisma.user.findUnique({
		where: { userId: userId }
	});
	await sendNotificationToRole(
		null,
		`The user ${userInfo.firstname} ${userInfo.lastname} has submitted a role request`,
		`Request: Switch to ${capitalizeFirstLetter(role)}`,
		"ADMIN",
		"role-request"
	);
}

/**
 * @async
 * @function getAllRoleRequests
 * @desc Get all role requests.
 * @returns {Promise<Object[]>} - An array of role request objects.
 */
export async function getAllRoleRequests() {
	const requests = await prisma.roleRequest.findMany({
		include: { user: true }
	});
	return requests;
}

/**
 * @async
 * @function deleteRoleRequest
 * @desc Delete a role request.
 * @param {number} roleRequestId - The ID of the role request.
 * @throws {apiError} - If there is an error deleting the role request.
 * @throws {Error} - If there is an unexpected error.
 * @returns {Promise<void>}
 */
export async function deleteRoleRequest(roleRequestId) {
	try {
		await prisma.roleRequest.delete({
			where: {
				roleRequestId: roleRequestId
			}
		});
	} catch (error) {
		throw new apiError("Error deleting role request", 500);
	}
}

/**
 * @async
 * @function updateRoleRequestStatus
 * @desc Update the status of a role request.
 * @param {number} roleRequestId - The ID of the role request.
 * @param {string} status - The new status of the role request.
 * @returns {Promise<void>}
 */
export async function updateRoleRequestStatus(roleRequestId, status) {
	switch (status) {
		case "APPROVED":
			await approveRoleRequest(roleRequestId);
			break;
		case "DENIED":
			await denyRoleRequest(roleRequestId);
			break;
		case "PENDING": {
			const roleRequest = await prisma.roleRequest.update({
				where: { roleRequestId: roleRequestId },
				data: { status: status }
			});
			await prisma.user.update({
				where: { userId: roleRequest.userId },
				data: { isRoleActivated: false }
			});
			break;
		}
		default:
			break;
	}
}

/**
 * @async
 * @function applyForNewRoleRequest
 * @desc Apply for a new role request.
 * @param {string} email - The email of the user.
 * @param {string} role - The role requested by the user.
 * @throws {apiError} - If the user is not found.
 * @throws {apiError} - If the user has an existing role request.
 * @throws {apiError} - If there is an error creating the role request.
 * @throws {Error} - If there is an unexpected error.
 * @returns {Promise<void>}
 */
export async function applyForNewRoleRequest(email, role) {
	const user = await checkUserByEmail(email);
	if (!user) {
		throw new apiError("User not found", 404);
	}
	const existingRequest = await checkRequestByEmail(email);
	if (existingRequest) {
		throw new apiError(
			"Your previous role request still exists, an admin must delete it before you can apply for a new one",
			400
		);
	}
	try {
		await prisma.roleRequest.create({
			data: {
				userId: user.userId,
				roleRequested: role,
				status: "PENDING"
			}
		});
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw error;
		}
	}
}

/**
 * @async
 * @function approveRoleRequest
 * @desc Approve a role request.
 * @param {number} roleRequestId - The ID of the role request.
 * @throws {apiError} - If there is an error updating the role request.
 * @throws {apiError} - If there is an error updating the user.
 * @throws {apiError} - If there is an error sending the email.
 * @throws {Error} - If there is an unexpected error.
 * @returns {Promise<void>}
 */
export async function approveRoleRequest(roleRequestId) {
	const roleRequest = await prisma.roleRequest.update({
		where: { roleRequestId: roleRequestId },
		data: { status: "APPROVED" }
	});
	const user = await prisma.user.update({
		where: { userId: roleRequest.userId },
		data: {
			isRoleActivated: true,
			role: roleRequest.roleRequested
		}
	});
	const htmlContent = `
        <html>
                <head>
                        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap" rel="stylesheet">
                        <style>* {font-family: "Nunito Sans", sans-serif;}</style>
                </head>
                <body style="background-color: #F3F4F6; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
                        <div style="display: flex; justify-content: center; align-items: center; max-width: 500px; margin: auto; padding: 20px;">
                                <div style="background-color: white; border-radius: 8px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); width: 100%; padding: 24px; text-align: center;">
                                                <h3 style="font-size: 24px; font-weight: 600; color: #111827;">Role Request Approved</h3>
                                                <p style="font-size: 14px; color: #6B7280;">Your request for the role "${roleRequest.roleRequested}" has been Approved! You can now log in.</p>
                                        <div style="text-align: center; padding-top: 1em;">
                                        </div>
                                </div>
                        </div>
                </body>
        </html>`;
	await sendEmail(
		user.email,
		`Role Request Approval for ${user.firstname} ${user.lastname}`,
		htmlContent
	);

	await sendNotificationToUser(
		null,
		`Your role request for ${capitalizeFirstLetter(roleRequest.roleRequested)} has been approved`,
		`You can now log in as a ${capitalizeFirstLetter(roleRequest.roleRequested)}`,
		user.userId,
		"role-request"
	);
	// TODO: Add logic to remove previous role requests after its been approved?
}

/**
 * @async
 * @function denyRoleRequest
 * @desc Deny a role request.
 * @param {number} roleRequestId - The ID of the role request.
 * @throws {apiError} - If there is an error updating the role request.
 * @throws {apiError} - If there is an error updating the user.
 * @throws {apiError} - If there is an error sending the email.
 * @throws {Error} - If there is an unexpected error.
 * @returns {Promise<void>}
 */
export async function denyRoleRequest(roleRequestId) {
	try {
		const roleRequest = await prisma.roleRequest.update({
			where: { roleRequestId: roleRequestId },
			data: { status: "DENIED" }
		});
		const user = await prisma.user.update({
			where: { userId: roleRequest.userId },
			data: { isRoleActivated: false }
		});
		const htmlContent = `
        <html>
                <head>
                        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap" rel="stylesheet">
                        <style>* {font-family: "Nunito Sans", sans-serif;}</style>
                </head>
                <body style="background-color: #F3F4F6; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
                        <div style="display: flex; justify-content: center; align-items: center; max-width: 500px; margin: auto; padding: 20px;">
                                <div style="background-color: white; border-radius: 8px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); width: 100%; padding: 24px; text-align: center;">
                                                <h3 style="font-size: 24px; font-weight: 600; color: #111827;">Role Request Denied</h3>
                                                <p style="font-size: 14px; color: #6B7280;">Your request for the role "${roleRequest.roleRequested}" has been Denied. 
												If you are indeed a valid instructor or admin, please reach out to an admin. An admin will have to delete the previous role request
												before you can apply for a new one </p>
                                        <div style="text-align: center; padding-top: 1em;">
                                        </div>
                                </div>
                        </div>
                </body>
        </html>`;
		await sendEmail(
			user.email,
			`Role Request Denial for ${user.firstname} ${user.lastname}`,
			htmlContent
		);
		await sendNotificationToUser(
			null,
			`Your role request for ${capitalizeFirstLetter(roleRequest.roleRequested)} has been denied`,
			`Please reach out to an admin if you believe this is an error`,
			user.userId,
			"role-request"
		);
		// TODO: Add logic to remove previous role requests after its been denied? If a user is denied, they should be able to apply for a new role request
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw error;
		}
	}
}

/**
 * @async
 * @function getCurrentUser
 * @desc Get the current user.
 * @param {string} email - The email of the user.
 * @returns {Promise<Object>} - The user object.
 * @throws {apiError} - If there is no user with that email.
 * @throws {apiError} - If there is an unexpected error.
 */
export async function getCurrentUser(email) {
	try {
		let user = await checkUserByEmail(email);
		if (!user) {
			throw new apiError("No user with that email", 404);
		} else {
			// Changing so that the user object is returned without the password
			const userInfo = await prisma.user.findUnique({
				where: { email },
				select: {
					userId: true,
					email: true,
					password: false,
					firstname: true,
					lastname: true,
					role: true,
					extendedDueDates: true,
					notifications: true,
					sentReports: true
				}
			});
			return userInfo;
		}
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Error fetching current user", 500);
		}
	}
}

export default {
	registerUser,
	loginUser,
	sendVerificationEmail,
	confirmEmail,
	isEmailVerifiedJWT,
	sendForgotPasswordEmail,
	resetPassword,
	getCurrentUser,
	getAllRoleRequests,
	deleteRoleRequest,
	approveRoleRequest,
	denyRoleRequest,
	updateRoleRequestStatus,
	applyForNewRoleRequest
};
