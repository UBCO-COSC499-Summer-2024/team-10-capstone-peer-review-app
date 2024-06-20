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

// AUTHENTICATION RELATED DATABASE SERVICES
// Used to decouple the authentication logic from the routes

export async function registerUser(userDetails) {
	const { email, password, firstname, lastname, role } = userDetails;
	const existingUser = await checkUserByEmail(email);
	if (existingUser) {
		throw new apiError("User with that email already exists", 400);
	}
	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
	const user = {
		email,
		password: hashedPassword,
		firstname,
		lastname,
		role
	};
	return await prisma.user.create({ data: user });
}

export async function loginUser(email, password) {
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
	return user;
}

export async function sendVerificationEmail(email) {
	const user = await checkUserByEmail(email);
	if (!user) {
		throw new apiError("No user with that email", 404);
	}

	const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "5m" });
	// TODO refactor resetLink for frontend deployment
	const verificationLink = `http://localhost:5001/auth/confirm-email?token=${token}`;

	const htmlContent = `<p>👋 Welcome to PeerGrade!</p>
  <p>Thanks for signing up. Please verify your email address to get started.</p>
  <p>Click this link to verify your email. The link will expire in 5 minutes:
  <a href="${verificationLink}">Verification Link</a>
  </p>`;
	try {
		await sendEmail(email, "Email Verification", htmlContent);
	} catch (error) {
		throw new apiError("Error sending email", 500);
	}
}

export async function resetPassword(token, newPassword) {
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
}

export async function sendForgotPasswordEmail(email) {
	const user = await checkUserByEmail(email);
	if (!user) {
		throw (new apiError("No user with that email"), 404);
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
}

export async function confirmEmail(token) {
	const decoded = jwt.verify(token, JWT_SECRET);
	const user = await checkUserByEmail(decoded.email);
	if (!user) {
		throw new apiError("No user with that email", 404);
	}
	await prisma.user.update({
		where: { email: decoded.email },
		data: { isEmailVerified: true }
	});
}

export default {
	registerUser,
	loginUser,
	sendVerificationEmail,
	confirmEmail,
	sendForgotPasswordEmail,
	resetPassword
};
