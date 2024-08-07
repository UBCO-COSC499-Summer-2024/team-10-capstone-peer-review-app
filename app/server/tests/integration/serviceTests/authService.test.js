import prisma from "../../../prisma/prismaClient.js";
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

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

beforeEach(async () => {
	await prisma.user.deleteMany();
	await prisma.class.deleteMany();
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

	describe("resetPassword", () => {
		it("should reset user's password", async () => {
			const userData = {
				email: "reset@example.com",
				password: "oldpassword",
				firstname: "Reset",
				lastname: "User",
				role: "STUDENT"
			};

			await authService.registerUser(userData);
			const token = jwt.sign({ email: userData.email }, process.env.JWT_SECRET);
			const newPassword = "newpassword123";

			await authService.resetPassword(token, newPassword);

			const user = await prisma.user.findUnique({
				where: { email: userData.email }
			});
			const passwordMatch = await bcrypt.compare(newPassword, user.password);
			expect(passwordMatch).toBe(true);
		});

		it("should throw an error if new password is the same as old password", async () => {
			const userData = {
				email: "samepassword@example.com",
				password: "password123",
				firstname: "Same",
				lastname: "Password",
				role: "STUDENT"
			};

			await authService.registerUser(userData);
			const token = jwt.sign({ email: userData.email }, process.env.JWT_SECRET);

			await expect(
				authService.resetPassword(token, userData.password)
			).rejects.toThrow(
				new apiError(
					"Password cannot be the same as the previous password",
					400
				)
			);
		});
	});

	describe("sendForgotPasswordEmail", () => {
		it("should send a forgot password email", async () => {
			const userData = {
				email: "forgot@example.com",
				password: "password123",
				firstname: "Forgot",
				lastname: "Password",
				role: "STUDENT"
			};

			await authService.registerUser(userData);

			await authService.sendForgotPasswordEmail(userData.email);

			const sendEmail = require("../../../src/utils/mailer.js").default;
			expect(sendEmail).toHaveBeenCalledWith(
				userData.email,
				"Password Reset",
				expect.stringContaining("You requested a password reset.")
			);
		});

		it("should throw an error if user does not exist", async () => {
			await expect(
				authService.sendForgotPasswordEmail("nonexistent@example.com")
			).rejects.toThrow(new apiError("No user with that email", 404));
		});
	});

	describe("confirmEmail", () => {
		it("should confirm user's email", async () => {
			const userData = {
				email: "confirm@example.com",
				password: "password123",
				firstname: "Confirm",
				lastname: "Email",
				role: "STUDENT"
			};

			await authService.registerUser(userData);
			const token = jwt.sign({ email: userData.email }, process.env.JWT_SECRET);

			await authService.confirmEmail(token);

			const user = await prisma.user.findUnique({
				where: { email: userData.email }
			});
			expect(user.isEmailVerified).toBe(true);
		});
	});

	describe("isEmailVerifiedJWT", () => {
		it("should return true for a verified email", async () => {
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
				data: { isEmailVerified: true }
			});

			const token = jwt.sign({ email: userData.email }, process.env.JWT_SECRET);
			const isVerified = await authService.isEmailVerifiedJWT(token);

			expect(isVerified).toBe(true);
		});

		it("should return false for an unverified email", async () => {
			const userData = {
				email: "unverified@example.com",
				password: "password123",
				firstname: "Unverified",
				lastname: "User",
				role: "STUDENT"
			};

			await authService.registerUser(userData);
			const token = jwt.sign({ email: userData.email }, process.env.JWT_SECRET);
			const isVerified = await authService.isEmailVerifiedJWT(token);

			expect(isVerified).toBe(false);
		});

		it("should throw an error for an invalid token", async () => {
			const invalidToken = "invalid.token.here";
			await expect(
				authService.isEmailVerifiedJWT(invalidToken)
			).rejects.toThrow();
		});
	});

	describe("getAllRoleRequests", () => {
		it("should return all role requests", async () => {
			const userData1 = {
				email: "user1@example.com",
				password: "password123",
				firstname: "User",
				lastname: "One",
				role: "INSTRUCTOR"
			};
			const userData2 = {
				email: "user2@example.com",
				password: "password123",
				firstname: "User",
				lastname: "Two",
				role: "ADMIN"
			};

			await authService.registerUser(userData1);
			await authService.registerUser(userData2);

			const roleRequests = await authService.getAllRoleRequests();

			expect(roleRequests).toHaveLength(2);
			expect(roleRequests[0]).toHaveProperty("user");
			expect(roleRequests[1]).toHaveProperty("user");
		});
	});

	describe("deleteRoleRequest", () => {
		it("should delete a role request", async () => {
			const userData = {
				email: "delete@example.com",
				password: "password123",
				firstname: "Delete",
				lastname: "Request",
				role: "INSTRUCTOR"
			};

			await authService.registerUser(userData);
			const user = await prisma.user.findUnique({
				where: { email: userData.email }
			});
			const roleRequest = await prisma.roleRequest.findFirst({
				where: { userId: user.userId }
			});

			await authService.deleteRoleRequest(roleRequest.roleRequestId);

			const deletedRequest = await prisma.roleRequest.findUnique({
				where: { roleRequestId: roleRequest.roleRequestId }
			});
			expect(deletedRequest).toBeNull();
		});

		it("should throw an error when deleting non-existent role request", async () => {
			const nonExistentId = 999999;
			await expect(
				authService.deleteRoleRequest(nonExistentId)
			).rejects.toThrow(new apiError("Error deleting role request", 500));
		});
	});

	describe("approveRoleRequest", () => {
		it("should approve a role request and update user status", async () => {
			const userData = {
				email: "approve@example.com",
				password: "password123",
				firstname: "Approve",
				lastname: "Request",
				role: "INSTRUCTOR"
			};

			await authService.registerUser(userData);
			const user = await prisma.user.findUnique({
				where: { email: userData.email }
			});
			const roleRequest = await prisma.roleRequest.findFirst({
				where: { userId: user.userId }
			});

			await authService.approveRoleRequest(roleRequest.roleRequestId);

			const updatedUser = await prisma.user.findUnique({
				where: { email: userData.email }
			});
			const updatedRequest = await prisma.roleRequest.findUnique({
				where: { roleRequestId: roleRequest.roleRequestId }
			});

			expect(updatedUser.isRoleActivated).toBe(true);
			expect(updatedRequest.status).toBe("APPROVED");

			// Check if email was sent
			const sendEmail = require("../../../src/utils/mailer.js").default;
			expect(sendEmail).toHaveBeenCalledWith(
				userData.email,
				`Role Request Approval for ${userData.firstname} ${userData.lastname}`,
				expect.stringContaining("Role Request Approved")
			);
		});
	});

	describe("denyRoleRequest", () => {
		it("should deny a role request and update user status", async () => {
			const userData = {
				email: "deny@example.com",
				password: "password123",
				firstname: "Deny",
				lastname: "Request",
				role: "INSTRUCTOR"
			};

			await authService.registerUser(userData);
			const user = await prisma.user.findUnique({
				where: { email: userData.email }
			});
			const roleRequest = await prisma.roleRequest.findFirst({
				where: { userId: user.userId }
			});

			await authService.denyRoleRequest(roleRequest.roleRequestId);

			const updatedUser = await prisma.user.findUnique({
				where: { email: userData.email }
			});
			const updatedRequest = await prisma.roleRequest.findUnique({
				where: { roleRequestId: roleRequest.roleRequestId }
			});

			expect(updatedUser.isRoleActivated).toBe(false);
			expect(updatedRequest.status).toBe("DENIED");

			// Check if email was sent
			const sendEmail = require("../../../src/utils/mailer.js").default;
			expect(sendEmail).toHaveBeenCalledWith(
				userData.email,
				`Role Request Denial for ${userData.firstname} ${userData.lastname}`,
				expect.stringContaining("Role Request Denied")
			);
		});
	});

	describe("applyForNewRoleRequest", () => {
		it("should create a new role request", async () => {
			const userData = {
				email: "newrole@example.com",
				password: "password123",
				firstname: "New",
				lastname: "Role",
				role: "STUDENT"
			};

			await authService.registerUser(userData);
			await authService.applyForNewRoleRequest(userData.email, "INSTRUCTOR");

			const roleRequest = await prisma.roleRequest.findFirst({
				where: { user: { email: userData.email } }
			});
			expect(roleRequest).toBeTruthy();
			expect(roleRequest.roleRequested).toBe("INSTRUCTOR");
			expect(roleRequest.status).toBe("PENDING");
		});

		it("should throw an error if a role request already exists", async () => {
			const userData = {
				email: "existingrequest@example.com",
				password: "password123",
				firstname: "Existing",
				lastname: "Request",
				role: "STUDENT"
			};

			await authService.registerUser(userData);
			await authService.applyForNewRoleRequest(userData.email, "INSTRUCTOR");

			await expect(
				authService.applyForNewRoleRequest(userData.email, "ADMIN")
			).rejects.toThrow(
				new apiError(
					"Your previous role request still exists, an admin must delete it before you can apply for a new one",
					400
				)
			);
		});
	});

	describe("updateRoleRequestStatus", () => {
		it("should update role request status to APPROVED", async () => {
			const userData = {
				email: "approve@example.com",
				password: "password123",
				firstname: "Approve",
				lastname: "User",
				role: "INSTRUCTOR"
			};

			await authService.registerUser(userData);
			const user = await prisma.user.findUnique({
				where: { email: userData.email }
			});
			const roleRequest = await prisma.roleRequest.findFirst({
				where: { userId: user.userId }
			});

			await authService.updateRoleRequestStatus(
				roleRequest.roleRequestId,
				"APPROVED"
			);

			const updatedUser = await prisma.user.findUnique({
				where: { email: userData.email }
			});
			const updatedRequest = await prisma.roleRequest.findUnique({
				where: { roleRequestId: roleRequest.roleRequestId }
			});

			expect(updatedUser.isRoleActivated).toBe(true);
			expect(updatedRequest.status).toBe("APPROVED");
		});

		it("should update role request status to DENIED", async () => {
			const userData = {
				email: "deny@example.com",
				password: "password123",
				firstname: "Deny",
				lastname: "User",
				role: "INSTRUCTOR"
			};

			await authService.registerUser(userData);
			const user = await prisma.user.findUnique({
				where: { email: userData.email }
			});
			const roleRequest = await prisma.roleRequest.findFirst({
				where: { userId: user.userId }
			});

			await authService.updateRoleRequestStatus(
				roleRequest.roleRequestId,
				"DENIED"
			);

			const updatedUser = await prisma.user.findUnique({
				where: { email: userData.email }
			});
			const updatedRequest = await prisma.roleRequest.findUnique({
				where: { roleRequestId: roleRequest.roleRequestId }
			});

			expect(updatedUser.isRoleActivated).toBe(false);
			expect(updatedRequest.status).toBe("DENIED");
		});
	});

	describe("getCurrentUser", () => {
		it("should return current user information without password", async () => {
			const userData = {
				email: "current@example.com",
				password: "password123",
				firstname: "Current",
				lastname: "User",
				role: "STUDENT"
			};

			await authService.registerUser(userData);

			const currentUser = await authService.getCurrentUser(userData.email);

			expect(currentUser).toHaveProperty("userId");
			expect(currentUser.email).toBe(userData.email);
			expect(currentUser.firstname).toBe(userData.firstname);
			expect(currentUser.lastname).toBe(userData.lastname);
			expect(currentUser.role).toBe(userData.role);
			expect(currentUser).not.toHaveProperty("password");
		});

		it("should throw an error if user does not exist", async () => {
			await expect(
				authService.getCurrentUser("nonexistent@example.com")
			).rejects.toThrow(new apiError("No user with that email", 404));
		});
	});
});
