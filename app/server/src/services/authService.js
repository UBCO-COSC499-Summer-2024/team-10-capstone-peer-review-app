import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prismaClient.js";
import sendEmail from "../utils/mailer.js";
import apiError from "../utils/apiError.js";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);
const JWT_SECRET = process.env.JWT_SECRET;

// Reused Prisma queries

async function checkUserByEmail(email) {
	return await prisma.user.findUnique({ where: { email } });
}

async function checkRequestByEmail(email) {
	return await prisma.roleRequest.findUnique({ where: { email } });
}

// AUTHENTICATION RELATED DATABASE SERVICES
// Used to decouple the authentication logic from the routes

export async function registerUser(userDetails) {
	try {
		const { email, password, firstname, lastname, role } = userDetails;
		const existingUser = await checkUserByEmail(email);
		if (existingUser) {
			throw new apiError("User with that email already exists", 400);
		}
		const isRoleActivated = role === "STUDENT" ? true : false;
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

export async function loginUser(email, password) {
	try {
		const user = await checkUserByEmail(email);
		if (!user) {
			throw new apiError("No user with that email", 404);
		}
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			throw new apiError("Invalid password", 400);
		}
		if (!user.isEmailVerified) {
			throw new apiError("Please verify your email before logging in", 400);
		}
		if (!user.isRoleActivated) {
			throw new apiError(
				"Your role needs to be approved before logging in.",
				400
			);
		}
		return user;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw error;
		}
	}
}

export async function sendVerificationEmail(email) {
	try {
		const user = await checkUserByEmail(email);
		if (!user) {
			throw new apiError("No user with that email", 404);
		}

		const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "5m" });
		// TODO refactor resetLink for frontend deployment
		const verificationLink = `http://localhost:3000?token=${token}`;

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
		if (error instanceof apiError) {
			throw error;
		} else {
			throw error;
		}
	}
}

export async function sendForgotPasswordEmail(email) {
	try {
		const user = await checkUserByEmail(email);
		if (!user) {
			throw new apiError("No user with that email", 404);
		}
		const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "5m" });
		// TODO refactor resetLink for frontend deployment
		const resetLink = `http://localhost:3000?frgtToken=${token}`;
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

export async function confirmEmail(token) {
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const user = await checkUserByEmail(decoded.email);
		if (!user) {
			throw new apiError("No user with that email", 404);
		}
		await prisma.user.update({
			where: { email: decoded.email },
			data: { isEmailVerified: true }
		});
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw error;
		}
	}
}

async function createRoleRequest(userId, role) {
	await prisma.roleRequest.create({
		data: {
			userId: userId,
			roleRequested: role,
			status: "PENDING"
		}
	});
}

export async function getAllRoleRequests() {
	const requests = await prisma.roleRequest.findMany();
	return requests;
}

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

export async function applyForNewRoleRequest(email, role) {
	const user = await checkUserByEmail(email);
	if (!user) {
		throw new apiError("User not found", 404);
	}
	const existingRequest = await checkRequestByEmail(email);
	if (existingRequest) {
		throw new apiError(
			"Your previous role request is still exists, an admin must delete it before you can apply for a new one",
			400
		);
	}
	try {
		await prisma.roleRequest.create({
			data: {
				userId: user.userId,
				requestedRole: role,
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

export async function approveRoleRequest(roleRequestId) {
	const roleRequest = await prisma.roleRequest.update({
		where: { roleRequestId: roleRequestId },
		data: { status: "APPROVED" }
	});
	const user = await prisma.user.update({
		where: { userId: roleRequest.userId },
		data: { isRoleActivated: true }
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
	// TODO: Add logic to remove previous role requests after its been approved?
}

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
		// TODO: Add logic to remove previous role requests after its been denied? If a user is denied, they should be able to apply for a new role request
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw error;
		}
	}
}
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
					role: true
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
