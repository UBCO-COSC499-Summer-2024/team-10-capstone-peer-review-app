import { jest } from "@jest/globals";
import request from "supertest";
import prisma from "../../../prisma/prismaClient.js";
import bcrypt from "bcrypt";

const API_URL = "http://peergrade-server-test:5001";

const hashPassword = async (password) => {
	const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);
	return await bcrypt.hash(password, SALT_ROUNDS);
};

describe("User Controller", () => {
	let testUser,
		testInstructor,
		testAdmin,
		testClass,
		testAssignment,
		testGroup,
		testReport;
	let userCookie, instructorCookie, adminCookie;

	beforeAll(async () => {
		await prisma.$connect();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	beforeEach(async () => {
		await prisma.report.deleteMany();
		await prisma.todo.deleteMany();
		await prisma.groupSubmission.deleteMany();
		await prisma.submission.deleteMany();
		await prisma.assignment.deleteMany();
		await prisma.group.deleteMany();
		await prisma.userInClass.deleteMany();
		await prisma.class.deleteMany();
		await prisma.user.deleteMany();

		// Create test users
		testUser = await prisma.user.create({
			data: {
				email: "user@example.com",
				password: await hashPassword("password123"),
				firstname: "Test",
				lastname: "User",
				role: "STUDENT",
				isEmailVerified: true,
				isRoleActivated: true
			}
		});

		testInstructor = await prisma.user.create({
			data: {
				email: "instructor@example.com",
				password: await hashPassword("password123"),
				firstname: "Test",
				lastname: "Instructor",
				role: "INSTRUCTOR",
				isEmailVerified: true,
				isRoleActivated: true
			}
		});

		testAdmin = await prisma.user.create({
			data: {
				email: "admin@example.com",
				password: await hashPassword("password123"),
				firstname: "Test",
				lastname: "Admin",
				role: "ADMIN",
				isEmailVerified: true,
				isRoleActivated: true
			}
		});

		// Create test class
		testClass = await prisma.class.create({
			data: {
				instructorId: testInstructor.userId,
				classname: "Test Class",
				description: "Test Description",
				startDate: new Date(),
				endDate: new Date(new Date().setMonth(new Date().getMonth() + 3))
			}
		});

		// Add user to class
		await prisma.userInClass.create({
			data: {
				userId: testUser.userId,
				classId: testClass.classId
			}
		});

		// Create test assignment
		testAssignment = await prisma.assignment.create({
			data: {
				classId: testClass.classId,
				title: "Test Assignment",
				description: "Test Assignment Description",
				dueDate: new Date(new Date().setDate(new Date().getDate() + 7))
			}
		});

		// Create test group
		testGroup = await prisma.group.create({
			data: {
				classId: testClass.classId,
				groupName: "Test Group",
				students: {
					connect: { userId: testUser.userId }
				}
			}
		});

		// Create test report
		testReport = await prisma.report.create({
			data: {
				senderId: testUser.userId,
				receiverRole: "ADMIN",
				title: "Test Report",
				content: "Test Report Content"
			}
		});

		// Login and get cookies
		const userLogin = await request(API_URL).post("/auth/login").send({
			email: "user@example.com",
			password: "password123"
		});
		userCookie = userLogin.headers["set-cookie"];

		const instructorLogin = await request(API_URL).post("/auth/login").send({
			email: "instructor@example.com",
			password: "password123"
		});
		instructorCookie = instructorLogin.headers["set-cookie"];

		const adminLogin = await request(API_URL).post("/auth/login").send({
			email: "admin@example.com",
			password: "password123"
		});
		adminCookie = adminLogin.headers["set-cookie"];

		expect(userCookie).toBeTruthy();
		expect(instructorCookie).toBeTruthy();
		expect(adminCookie).toBeTruthy();
	});

	describe("GET /users/all", () => {
		it("should get all users", async () => {
			const res = await request(API_URL)
				.get("/users/all")
				.set("Cookie", adminCookie);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("GET /users/role/:role", () => {
		it("should get users by role", async () => {
			const res = await request(API_URL)
				.get("/users/role/STUDENT")
				.set("Cookie", instructorCookie);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("POST /users/get-classes", () => {
		it("should get user classes", async () => {
			const res = await request(API_URL)
				.post("/users/get-classes")
				.set("Cookie", userCookie)
				.send({ userId: testUser.userId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("POST /users/get-assignments", () => {
		it("should get user assignments", async () => {
			const res = await request(API_URL)
				.post("/users/get-assignments")
				.set("Cookie", userCookie)
				.send({ userId: testUser.userId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("POST /users/get-groups", () => {
		it("should get user groups", async () => {
			const res = await request(API_URL)
				.post("/users/get-groups")
				.set("Cookie", userCookie)
				.send({ userId: testUser.userId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("POST /users/get-all-groups", () => {
		it("should get all groups", async () => {
			const res = await request(API_URL)
				.post("/users/get-all-groups")
				.set("Cookie", adminCookie);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("POST /users/update-profile", () => {
		it("should update user profile", async () => {
			const updateData = {
				firstname: "Updated",
				lastname: "User"
			};

			const res = await request(API_URL)
				.post("/users/update-profile")
				.set("Cookie", userCookie)
				.send({ userId: testUser.userId, updateData });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.data.firstname).toBe("Updated");
			expect(res.body.data.lastname).toBe("User");
		});
	});

	describe("POST /users/send-report-to-instructor", () => {
		it("should send a report to an instructor", async () => {
			const reportData = {
				title: "Test Report",
				content: "Test Content",
				instructorId: testInstructor.userId
			};

			const res = await request(API_URL)
				.post("/users/send-report-to-instructor")
				.set("Cookie", userCookie)
				.send(reportData);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.data.title).toBe("Test Report");
		});
	});

	describe("POST /users/send-report-to-admin", () => {
		it("should send a report to an admin", async () => {
			const reportData = {
				title: "Test Admin Report",
				content: "Test Content"
			};

			const res = await request(API_URL)
				.post("/users/send-report-to-admin")
				.set("Cookie", userCookie)
				.send(reportData);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.data.title).toBe("Test Admin Report");
		});
	});

	describe("POST /users/resolve-report", () => {
		it("should resolve a report", async () => {
			const res = await request(API_URL)
				.post("/users/resolve-report")
				.set("Cookie", adminCookie)
				.send({ reportId: testReport.reportId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.data.isResolved).toBe(true);
		});
	});

	describe("POST /users/unresolve-report", () => {
		it("should unresolve a report", async () => {
			const res = await request(API_URL)
				.post("/users/unresolve-report")
				.set("Cookie", adminCookie)
				.send({ reportId: testReport.reportId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.data.isResolved).toBe(false);
		});
	});

	describe("POST /users/delete-report", () => {
		it("should delete a report", async () => {
			const res = await request(API_URL)
				.post("/users/delete-report")
				.set("Cookie", adminCookie)
				.send({ reportId: testReport.reportId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
		});
	});

	describe("POST /users/get-admin-reports", () => {
		it("should get admin reports", async () => {
			const res = await request(API_URL)
				.post("/users/get-admin-reports")
				.set("Cookie", adminCookie);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("POST /users/get-instructor-reports", () => {
		it("should get instructor reports", async () => {
			const res = await request(API_URL)
				.post("/users/get-instructor-reports")
				.set("Cookie", instructorCookie);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("POST /users/get-sent-reports", () => {
		it("should get sent reports", async () => {
			const res = await request(API_URL)
				.post("/users/get-sent-reports")
				.set("Cookie", userCookie);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});
});
