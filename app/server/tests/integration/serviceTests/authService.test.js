import { PrismaClient } from "@prisma/client";
import authService from "../../../src/services/authService.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import apiError from "../../../src/utils/apiError.js";

// Mock the mailer
jest.mock("../../../src/utils/mailer.js", () => ({
	__esModule: true,
	default: jest.fn()
}));

// Create a new Prisma client for tests
let prisma;

beforeAll(async () => {
	prisma = new PrismaClient();
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

beforeEach(async () => {
	await prisma.user.deleteMany();
	await prisma.roleRequest.deleteMany();
});

describe("authService Integration Tests", () => {
	describe("registerUser", () => {
		it("should register a new student user", async () => {
			const userData = {
				email: "student@example.com",
				password: "password123",
				firstname: "John",
				lastname: "Doe",
				role: "STUDENT"
			};

			await authService.registerUser(userData);

			const user = await prisma.user.findUnique({
				where: { email: userData.email }
			});
			expect(user).toBeTruthy();
			expect(user.email).toBe(userData.email);
			expect(user.firstname).toBe(userData.firstname);
			expect(user.lastname).toBe(userData.lastname);
			expect(user.role).toBe(userData.role);
			expect(user.isRoleActivated).toBe(true);
		});

		it("should register a new non-student user and create a role request", async () => {
			const userData = {
				email: "instructor@example.com",
				password: "password123",
				firstname: "Jane",
				lastname: "Doe",
				role: "INSTRUCTOR"
			};

			await authService.registerUser(userData);

			const user = await prisma.user.findUnique({
				where: { email: userData.email }
			});
			expect(user).toBeTruthy();
			expect(user.isRoleActivated).toBe(false);

			const roleRequest = await prisma.roleRequest.findFirst({
				where: { userId: user.userId }
			});
			expect(roleRequest).toBeTruthy();
			expect(roleRequest.roleRequested).toBe(userData.role);
			expect(roleRequest.status).toBe("PENDING");
		});

		it("should throw an error if user already exists", async () => {
			const userData = {
				email: "existing@example.com",
				password: "password123",
				firstname: "Existing",
				lastname: "User",
				role: "STUDENT"
			};

			await authService.registerUser(userData);

			await expect(authService.registerUser(userData)).rejects.toThrow(
				new apiError("User with that email already exists", 400)
			);
		});
	});

	describe("loginUser", () => {
		it("should login a verified and activated user", async () => {
			const userData = {
				email: "verified@example.com",
				password: "password123",
				firstname: "Verified",
				lastname: "User",
				role: "STUDENT"
			};

			await authService.registerUser(userData);
			await prisma.user.update({
				where: { email: userData.email },
				data: { isEmailVerified: true, isRoleActivated: true }
			});

			const user = await authService.loginUser(
				userData.email,
				userData.password
			);
			expect(user).toBeTruthy();
			expect(user.email).toBe(userData.email);
		});

		it("should throw an error if email is not verified", async () => {
			const userData = {
				email: "unverified@example.com",
				password: "password123",
				firstname: "Unverified",
				lastname: "User",
				role: "STUDENT"
			};

			await authService.registerUser(userData);

			await expect(
				authService.loginUser(userData.email, userData.password)
			).rejects.toThrow(
				new apiError("Please verify your email before logging in", 400)
			);
		});

		it("should throw an error if role is not activated", async () => {
			const userData = {
				email: "inactive@example.com",
				password: "password123",
				firstname: "Inactive",
				lastname: "User",
				role: "INSTRUCTOR"
			};

			await authService.registerUser(userData);
			await prisma.user.update({
				where: { email: userData.email },
				data: { isEmailVerified: true }
			});

			await expect(
				authService.loginUser(userData.email, userData.password)
			).rejects.toThrow(
				new apiError("Your role needs to be approved before logging in.", 400)
			);
		});
	});

	describe("sendVerificationEmail", () => {
		it("should send a verification email to a registered user", async () => {
			const userData = {
				email: "toverify@example.com",
				password: "password123",
				firstname: "To",
				lastname: "Verify",
				role: "STUDENT"
			};

			await authService.registerUser(userData);

			await authService.sendVerificationEmail(userData.email);

			// Check if the mocked sendEmail function was called
			const sendEmail = require("../../../src/utils/mailer.js").default;
			expect(sendEmail).toHaveBeenCalledWith(
				userData.email,
				"Email Verification",
				expect.stringContaining("Welcome to PeerGrade!")
			);
		});

		it("should throw an error if user does not exist", async () => {
			await expect(
				authService.sendVerificationEmail("nonexistent@example.com")
			).rejects.toThrow(new apiError("No user with that email", 404));
		});
	});
});
