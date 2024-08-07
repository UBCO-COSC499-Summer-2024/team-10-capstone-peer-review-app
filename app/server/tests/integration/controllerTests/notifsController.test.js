import request from "supertest";
import prisma from "../../../prisma/prismaClient.js";
import bcrypt from "bcrypt";

const API_URL = "http://peergrade-server-test:5001";

const hashPassword = async (password) => {
	const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);
	return await bcrypt.hash(password, SALT_ROUNDS);
};

describe("Notification Controller", () => {
	let testStudent, testInstructor, testAdmin, testClass, testGroup;
	let studentCookie, instructorCookie, adminCookie;

	beforeAll(async () => {
		await prisma.$connect();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	beforeEach(async () => {
		await prisma.notification.deleteMany();
		await prisma.group.deleteMany();
		await prisma.class.deleteMany();
		await prisma.user.deleteMany();

		// Create test users
		testStudent = await prisma.user.create({
			data: {
				email: "student@example.com",
				password: await hashPassword("password123"),
				firstname: "Test",
				lastname: "Student",
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

		// Create a test class
		testClass = await prisma.class.create({
			data: {
				instructorId: testInstructor.userId,
				classname: "Test Class",
				description: "Test Description",
				startDate: new Date(),
				endDate: new Date(new Date().setMonth(new Date().getMonth() + 3))
			}
		});

		// Create a test group
		testGroup = await prisma.group.create({
			data: {
				classId: testClass.classId,
				groupName: "Test Group",
				groupDescription: "Test Group Description",
				students: {
					connect: { userId: testStudent.userId }
				}
			}
		});

		// Login and get cookies
		const studentLogin = await request(API_URL).post("/auth/login").send({
			email: "student@example.com",
			password: "password123"
		});
		studentCookie = studentLogin.headers["set-cookie"];

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

		expect(studentCookie).toBeTruthy();
		expect(instructorCookie).toBeTruthy();
		expect(adminCookie).toBeTruthy();
	});

	describe("GET /notifs/:notificationId", () => {
		it("should get a specific notification", async () => {
			const notification = await prisma.notification.create({
				data: {
					receiverId: testStudent.userId,
					title: "Test Notification",
					content: "This is a test notification"
				}
			});

			const res = await request(API_URL)
				.get(`/notifs/${notification.notificationId}`)
				.set("Cookie", studentCookie);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe("Notification fetched");
			expect(res.body.data.notificationId).toBe(notification.notificationId);
		});
	});

	describe("DELETE /notifs/:notificationId", () => {
		it("should delete a notification", async () => {
			const notification = await prisma.notification.create({
				data: {
					receiverId: testStudent.userId,
					title: "Test Notification",
					content: "This is a test notification"
				}
			});

			const res = await request(API_URL)
				.delete(`/notifs/${notification.notificationId}`)
				.set("Cookie", studentCookie);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe("Notification deleted");
		});
	});

	describe("PUT /notifs/:notificationId", () => {
		it("should update a notification", async () => {
			const notification = await prisma.notification.create({
				data: {
					receiverId: testStudent.userId,
					title: "Test Notification",
					content: "This is a test notification"
				}
			});

			const res = await request(API_URL)
				.put(`/notifs/${notification.notificationId}`)
				.set("Cookie", adminCookie)
				.send({ seen: true });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe("Notification updated");
			expect(res.body.data.seen).toBe(true);
		});
	});

	describe("POST /notifs/get-notifications", () => {
		it("should get all notifications for a user", async () => {
			await prisma.notification.create({
				data: {
					receiverId: testStudent.userId,
					title: "Test Notification",
					content: "This is a test notification"
				}
			});

			const res = await request(API_URL)
				.post("/notifs/get-notifications")
				.set("Cookie", studentCookie)
				.send({ userId: testStudent.userId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe("Notifications fetched");
			expect(res.body.data).toHaveLength(1);
		});
	});

	describe("POST /notifs/send-to-user", () => {
		it("should send a notification to a user", async () => {
			const notificationData = {
				receiverId: testStudent.userId,
				title: "New Notification",
				content: "This is a new notification"
			};

			const res = await request(API_URL)
				.post("/notifs/send-to-user")
				.set("Cookie", instructorCookie)
				.send(notificationData);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe("Notification sent to user");
		});
	});

	describe("POST /notifs/send-to-class", () => {
		it("should send a notification to a class", async () => {
			const notificationData = {
				classId: testClass.classId,
				title: "Class Notification",
				content: "This is a class notification"
			};

			const res = await request(API_URL)
				.post("/notifs/send-to-class")
				.set("Cookie", instructorCookie)
				.send(notificationData);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe(
				"Notification sent to all members of the class"
			);
		});
	});

	describe("POST /notifs/send-to-group", () => {
		it("should send a notification to a group", async () => {
			const notificationData = {
				groupId: testGroup.groupId,
				title: "Group Notification",
				content: "This is a group notification"
			};

			const res = await request(API_URL)
				.post("/notifs/send-to-group")
				.set("Cookie", instructorCookie)
				.send(notificationData);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe(
				"Notification sent to all members of the group"
			);
		});
	});

	describe("POST /notifs/send-to-role", () => {
		it("should send a notification to a role", async () => {
			const notificationData = {
				role: "STUDENT",
				title: "Role Notification",
				content: "This is a role notification"
			};

			const res = await request(API_URL)
				.post("/notifs/send-to-role")
				.set("Cookie", adminCookie)
				.send(notificationData);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe(
				"Notification sent to all members of the role"
			);
		});
	});

	describe("POST /notifs/send-to-all", () => {
		it("should send a notification to all users", async () => {
			const notificationData = {
				title: "Global Notification",
				content: "This is a global notification"
			};

			const res = await request(API_URL)
				.post("/notifs/send-to-all")
				.set("Cookie", adminCookie)
				.send(notificationData);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe(
				"Notification sent to all users (excluding current user)"
			);
		});
	});
});
