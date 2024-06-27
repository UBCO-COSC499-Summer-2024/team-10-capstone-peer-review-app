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
	return await prisma.roleRequest.findUnique({ where: { email: email } });
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
			throw new apiError("Error registering user", 500);
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
			throw new apiError("Please wait for your role to be approve...", 400);
		}
		return user;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Error logging in user", 500);
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
			throw new apiError("Error sending verification email", 500);
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
			throw new apiError("Error resetting password", 500);
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
		const resetLink = `http://localhost:5001/auth/reset-password?token=${token}`;
		const htmlContent = `<p>You requested a password reset</p>
		<p>Click this link to reset your password. The link will expire in 5 minutes: 
		<a href="${resetLink}">Reset Password</a>
		</p>`;
		try {
			await sendEmail(email, "Password Reset", htmlContent);
		} catch (error) {
			throw new apiError("Error sending email", 500);
		}
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Error sending forgot password email", 500);
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
			throw new apiError("Error confirming email", 500);
		}
	}
}

async function createRoleRequest(userId, role) {
	try {
		await prisma.roleRequest.create({
			data: {
				userId: userId,
				roleRequested: role,
				status: "PENDING"
			}
		});
	} catch (error) {
		throw new apiError("Error creating role request", 500);
	}
}

export async function getAllRoleRequests() {
	try {
		const requests = await prisma.roleRequest.findMany();
		return requests;
	} catch (error) {
		throw new apiError("Error fetching role requests", 500);
	}
}

export async function deleteRoleRequest(requestId) {
	try {
		await prisma.roleRequest.delete({
			where: {
				requestId: requestId
			}
		});
	} catch (error) {
		throw new apiError("Error deleting role request", 500);
	}
}

export async function updateRoleRequestStatus(requestId, status) {
	try {
		await prisma.roleRequest.update({
			where: { id: requestId },
			data: { status: status }
		});
	} catch (error) {
		throw new apiError("Error updating role request status", 500);
	}
}

export async function applyForNewRoleRequest(email, role) {
	const existingRequest = await checkRequestByEmail(email);
	if (existingRequest) {
		throw new apiError("Your previous role request is still pending...", 400);
	}
	try {
		await prisma.roleRequest.create({
			data: {
				userId: userId,
				requestedRole: role,
				status: "PENDING"
			}
		});
	} catch (error) {
		throw new apiError("Error applying for new role request", 500);
	}
}

export async function approveRoleRequest(requestId) {
	try {
		const request = await prisma.roleRequest.update({
			where: { requestId: requestId },
			data: { status: "APPROVED" }
		});
		const user = await prisma.user.update({
			where: { userId: request.userId },
			data: { isRoleVerified: true }
		});
		await sendEmail(
			user.email,
			"Role Verification",
			"Your role has been verified."
		);
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Error approving role request", 500);
		}
	}
}

export async function denyRoleRequest(requestId) {
	try {
		const request = await prisma.roleRequest.update({
			where: { requestId: requestId },
			data: { status: "DENIED" }
		});
		const user = await prisma.user.update({
			where: { userId: request.userId },
			data: { isRoleVerified: false }
		});
		await sendEmail(
			user.email,
			"Role Verification",
			"Your role verification has been denied."
		);
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Error denying role request", 500);
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
	getAllRoleRequests,
	deleteRoleRequest,
	approveRoleRequest,
	denyRoleRequest,
	updateRoleRequestStatus,
	applyForNewRoleRequest
};
