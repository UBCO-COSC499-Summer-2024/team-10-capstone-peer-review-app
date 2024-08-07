import prisma from "../../../prisma/prismaClient.js";
import notifsService from "../../../src/services/notifsService.js";
import apiError from "../../../src/utils/apiError.js";

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("notifsService Integration Tests", () => {
	let testUser, testClass, testGroup, testNotification;

	beforeEach(async () => {
		await prisma.$transaction(async (prisma) => {
			// Clean up
			await prisma.notification.deleteMany();
			await prisma.group.deleteMany();
			await prisma.class.deleteMany();
			await prisma.user.deleteMany();

			// Create test user
			testUser = await prisma.user.create({
				data: {
					email: "testuser@example.com",
					password: "password123",
					firstname: "Test",
					lastname: "User",
					role: "STUDENT"
				}
			});

			// Create test class
			testClass = await prisma.class.create({
				data: {
					classname: "Test Class",
					description: "Test Description",
					startDate: new Date(),
					endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
					instructorId: testUser.userId
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

			// Create test notification
			testNotification = await prisma.notification.create({
				data: {
					receiverId: testUser.userId,
					title: "Test Notification",
					content: "This is a test notification",
					senderId: testUser.userId,
					type: "test"
				}
			});
		});
	});

	describe("getNotifications", () => {
		it("should retrieve notifications for a user", async () => {
			const notifications = await notifsService.getNotifications(
				testUser.userId
			);
			expect(notifications).toHaveLength(1);
			expect(notifications[0].title).toBe("Test Notification");
		});
	});

	describe("getNotification", () => {
		it("should retrieve a specific notification", async () => {
			const notification = await notifsService.getNotification(
				testNotification.notificationId
			);
			expect(notification).toBeTruthy();
			expect(notification.title).toBe("Test Notification");
		});
	});

	describe("updateNotification", () => {
		it("should update a notification", async () => {
			const updatedNotification = await notifsService.updateNotification(
				testNotification.notificationId,
				{ title: "Updated Notification" }
			);
			expect(updatedNotification.title).toBe("Updated Notification");
		});
	});

	describe("deleteNotification", () => {
		it("should delete a notification", async () => {
			await notifsService.deleteNotification(testNotification.notificationId);
			const deletedNotification = await prisma.notification.findUnique({
				where: { notificationId: testNotification.notificationId }
			});
			expect(deletedNotification).toBeNull();
		});
	});

	describe("sendNotificationToUser", () => {
		it("should send a notification to a user", async () => {
			const result = await notifsService.sendNotificationToUser(
				testUser.userId,
				"New Notification",
				"This is a new notification",
				testUser.userId,
				"test"
			);
			expect(result.status).toBe("Success");
			const notifications = await notifsService.getNotifications(
				testUser.userId
			);
			expect(notifications).toHaveLength(2);
		});
	});

	describe("sendNotificationToClass", () => {
		it("should send a notification to all users in a class", async () => {
			const result = await notifsService.sendNotificationToClass(
				testUser.userId,
				"Class Notification",
				"This is a class notification",
				testClass.classId,
				"announcement"
			);
			expect(result.status).toBe("Success");
		});
	});

	describe("sendNotificationToGroup", () => {
		it("should send a notification to all users in a group", async () => {
			const result = await notifsService.sendNotificationToGroup(
				testUser.userId,
				"Group Notification",
				"This is a group notification",
				testGroup.groupId,
				"group"
			);
			expect(result.status).toBe("Success");
			const notifications = await notifsService.getNotifications(
				testUser.userId
			);
			expect(notifications.length).toBeGreaterThan(1);
		});
	});

	describe("sendNotificationToRole", () => {
		it("should send a notification to all users with a specific role", async () => {
			const result = await notifsService.sendNotificationToRole(
				testUser.userId,
				"Role Notification",
				"This is a role notification",
				"STUDENT",
				"role"
			);
			expect(result.status).toBe("Success");
			const notifications = await notifsService.getNotifications(
				testUser.userId
			);
			expect(notifications.length).toBeGreaterThan(1);
		});
	});

	describe("sendNotificationToAll", () => {
		it("should send a notification to all users except the sender", async () => {
			// Create another user
			const anotherUser = await prisma.user.create({
				data: {
					email: "anotheruser@example.com",
					password: "password123",
					firstname: "Another",
					lastname: "User",
					role: "STUDENT"
				}
			});

			const result = await notifsService.sendNotificationToAll(
				testUser.userId,
				"Global Notification",
				"This is a global notification",
				"global"
			);
			expect(result.status).toBe("Success");

			// Check that the other user received the notification
			const notifications = await notifsService.getNotifications(
				anotherUser.userId
			);
			expect(notifications).toHaveLength(1);
			expect(notifications[0].title).toBe("Global Notification");

			// Check that the sender didn't receive the notification
			const senderNotifications = await notifsService.getNotifications(
				testUser.userId
			);
			expect(senderNotifications).not.toContainEqual(
				expect.objectContaining({
					title: "Global Notification"
				})
			);
		});
	});
});
