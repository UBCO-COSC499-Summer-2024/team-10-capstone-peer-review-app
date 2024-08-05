import prisma from "../../../prisma/prismaClient.js";
import userService from "../../../src/services/userService.js";
import apiError from "../../../src/utils/apiError.js";

// Mock the notifsService
jest.mock("../../../src/services/notifsService.js", () => ({
	sendNotificationToRole: jest.fn(),
	sendNotificationToUser: jest.fn()
}));

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("userService Integration Tests", () => {
	let testUser, testInstructor, testAdmin, testClass, testAssignment, testGroup;

	beforeEach(async () => {
		// Clear the database and create test data
		await prisma.$transaction([
			prisma.user.deleteMany(),
			prisma.class.deleteMany(),
			prisma.assignment.deleteMany(),
			prisma.group.deleteMany(),
			prisma.report.deleteMany()
		]);

		testUser = await prisma.user.create({
			data: {
				email: "testuser@example.com",
				password: "password123",
				firstname: "Test",
				lastname: "User",
				role: "STUDENT"
			}
		});

		testInstructor = await prisma.user.create({
			data: {
				email: "instructor@example.com",
				password: "password123",
				firstname: "Test",
				lastname: "Instructor",
				role: "INSTRUCTOR"
			}
		});

		testAdmin = await prisma.user.create({
			data: {
				email: "admin@example.com",
				password: "password123",
				firstname: "Test",
				lastname: "Admin",
				role: "ADMIN"
			}
		});

		testClass = await prisma.class.create({
			data: {
				classname: "Test Class",
				description: "Test Description",
				startDate: new Date(),
				endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
				instructorId: testInstructor.userId
			}
		});

		testAssignment = await prisma.assignment.create({
			data: {
				title: "Test Assignment",
				description: "Test Description",
				dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
				classId: testClass.classId
			}
		});

		testGroup = await prisma.group.create({
			data: {
				groupName: "Test Group",
				classId: testClass.classId,
				students: {
					connect: { userId: testUser.userId }
				}
			}
		});

		// Connect user to class
		await prisma.userInClass.create({
			data: {
				userId: testUser.userId,
				classId: testClass.classId
			}
		});
	});

	describe("getAllUsers", () => {
		it("should retrieve all users", async () => {
			const users = await userService.getAllUsers();
			expect(users.length).toBe(3);
			expect(users.some((user) => user.email === testUser.email)).toBeTruthy();
			expect(
				users.some((user) => user.email === testInstructor.email)
			).toBeTruthy();
			expect(users.some((user) => user.email === testAdmin.email)).toBeTruthy();
		});

		it("should throw an error if retrieval fails", async () => {
			jest
				.spyOn(prisma.user, "findMany")
				.mockRejectedValueOnce(new Error("Database error"));
			await expect(userService.getAllUsers()).rejects.toThrow(apiError);
		});
	});

	describe("getUsersByRole", () => {
		it("should retrieve users by role", async () => {
			const students = await userService.getUsersByRole("STUDENT");
			expect(students.length).toBe(1);
			expect(students[0].email).toBe(testUser.email);
		});

		it("should throw an error if retrieval fails", async () => {
			jest
				.spyOn(prisma.user, "findMany")
				.mockRejectedValueOnce(new Error("Database error"));
			await expect(userService.getUsersByRole("STUDENT")).rejects.toThrow(
				apiError
			);
		});
	});

	describe("getUserClasses", () => {
		it("should retrieve classes for a student", async () => {
			const classes = await userService.getUserClasses(testUser.userId);
			expect(classes.length).toBe(1);
			expect(classes[0].classname).toBe(testClass.classname);
		});

		it("should retrieve classes for an instructor", async () => {
			const classes = await userService.getUserClasses(testInstructor.userId);
			expect(classes.length).toBe(1);
			expect(classes[0].classname).toBe(testClass.classname);
		});

		it("should throw an error if user is not found", async () => {
			await expect(
				userService.getUserClasses("nonexistent-id")
			).rejects.toThrow(apiError);
		});
	});

	describe("getUserAssignments", () => {
		it("should retrieve assignments for a user", async () => {
			const assignments = await userService.getUserAssignments(testUser.userId);
			expect(assignments.length).toBe(1);
			expect(assignments[0].title).toBe(testAssignment.title);
		});

		it("should throw an error if user is not found", async () => {
			await expect(
				userService.getUserAssignments("nonexistent-id")
			).rejects.toThrow(apiError);
		});
	});

	describe("getGroups", () => {
		it("should retrieve groups for a user", async () => {
			const groups = await userService.getGroups(testUser.userId);
			expect(groups.length).toBe(1);
			expect(groups[0].groupName).toBe(testGroup.groupName);
		});

		it("should return an empty array if user has no groups", async () => {
			const groups = await userService.getGroups(testInstructor.userId);
			expect(groups).toEqual([]);
		});
	});

	describe("getAllGroups", () => {
		it("should retrieve all groups", async () => {
			const groups = await userService.getAllGroups();
			expect(groups.length).toBe(1);
			expect(groups[0].groupName).toBe(testGroup.groupName);
		});

		it("should throw an error if no groups are found", async () => {
			await prisma.group.deleteMany();
			await expect(userService.getAllGroups()).rejects.toThrow(apiError);
		});
	});

	describe("updateProfile", () => {
		it("should update a user's profile", async () => {
			const updatedProfile = await userService.updateProfile(testUser.userId, {
				firstname: "Updated",
				lastname: "Name"
			});
			expect(updatedProfile.firstname).toBe("Updated");
			expect(updatedProfile.lastname).toBe("Name");
		});

		it("should throw an error if email already exists", async () => {
			await expect(
				userService.updateProfile(testUser.userId, {
					email: testInstructor.email
				})
			).rejects.toThrow(apiError);
		});
	});

	describe("Reports", () => {
		let testReport;

		beforeEach(async () => {
			testReport = await prisma.report.create({
				data: {
					senderId: testUser.userId,
					receiverRole: "ADMIN",
					title: "Test Report",
					content: "Test Content"
				}
			});
		});

		describe("getAdminReports", () => {
			it("should retrieve all admin reports", async () => {
				const reports = await userService.getAdminReports();
				expect(reports.length).toBe(1);
				expect(reports[0].title).toBe(testReport.title);
			});
		});

		describe("getInstructorReports", () => {
			it("should retrieve instructor reports", async () => {
				const instructorReport = await prisma.report.create({
					data: {
						senderId: testUser.userId,
						receiverRole: "INSTRUCTOR",
						receiverId: testInstructor.userId,
						title: "Instructor Report",
						content: "Test Content"
					}
				});

				const reports = await userService.getInstructorReports(
					testInstructor.userId
				);
				expect(reports.length).toBe(1);
				expect(reports[0].title).toBe(instructorReport.title);
			});
		});

		describe("getSentReports", () => {
			it("should retrieve sent reports for a user", async () => {
				const reports = await userService.getSentReports(testUser.userId);
				expect(reports.length).toBe(1);
				expect(reports[0].title).toBe(testReport.title);
			});
		});

		describe("sendReportToAdmin", () => {
			it("should send a report to admin", async () => {
				const newReport = await userService.sendReportToAdmin(
					testUser.userId,
					"New Report",
					"New Content"
				);
				expect(newReport.title).toBe("New Report");
				expect(newReport.content).toBe("New Content");
			});
		});

		describe("sendReportToInstructor", () => {
			it("should send a report to instructor", async () => {
				const newReport = await userService.sendReportToInstructor(
					testUser.userId,
					"Instructor Report",
					"Report Content",
					testInstructor.userId
				);
				expect(newReport.title).toBe("Instructor Report");
				expect(newReport.receiverId).toBe(testInstructor.userId);
			});
		});

		describe("resolveReport", () => {
			it("should mark a report as resolved", async () => {
				const resolvedReport = await userService.resolveReport(
					testReport.reportId
				);
				expect(resolvedReport.isResolved).toBe(true);
			});
		});

		describe("unResolveReport", () => {
			it("should mark a report as not resolved", async () => {
				await userService.resolveReport(testReport.reportId);
				const unresolvedReport = await userService.unResolveReport(
					testReport.reportId
				);
				expect(unresolvedReport.isResolved).toBe(false);
			});
		});

		describe("deleteReport", () => {
			it("should delete a report", async () => {
				await userService.deleteReport(testReport.reportId);
				const report = await prisma.report.findUnique({
					where: { reportId: testReport.reportId }
				});
				expect(report).toBeNull();
			});
		});
	});
});
