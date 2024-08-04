import prisma from "../../../prisma/prismaClient.js";
import submitService from "../../../src/services/submitService.js";
import apiError from "../../../src/utils/apiError.js";
import { sendNotificationToUser } from "../../../src/services/notifsService.js";

// Mock the notification service
jest.mock("../../../src/services/notifsService.js", () => ({
	sendNotificationToUser: jest.fn()
}));

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("submitService Integration Tests", () => {
	let testStudent,
		testInstructor,
		testClass,
		testAssignment,
		testSubmission,
		testGroup;

	beforeEach(async () => {
		await prisma.$transaction(async (prisma) => {
			// Clean up
			await prisma.submission.deleteMany();
			await prisma.group.deleteMany();
			await prisma.assignment.deleteMany();
			await prisma.class.deleteMany();
			await prisma.user.deleteMany();

			// Create test student
			testStudent = await prisma.user.create({
				data: {
					email: "student@example.com",
					password: "password123",
					firstname: "Test",
					lastname: "Student",
					role: "STUDENT"
				}
			});

			// Create test instructor
			testInstructor = await prisma.user.create({
				data: {
					email: "instructor@example.com",
					password: "password123",
					firstname: "Test",
					lastname: "Instructor",
					role: "INSTRUCTOR"
				}
			});

			// Create test class
			testClass = await prisma.class.create({
				data: {
					classname: "Test Class",
					description: "Test Description",
					startDate: new Date(),
					endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
					instructorId: testInstructor.userId
				}
			});

			// Create test assignment
			testAssignment = await prisma.assignment.create({
				data: {
					title: "Test Assignment",
					description: "Test Assignment Description",
					dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
					classId: testClass.classId,
					maxSubmissions: 3
				}
			});

			// Create test group
			testGroup = await prisma.group.create({
				data: {
					classId: testClass.classId,
					groupName: "Test Group",
					students: {
						connect: { userId: testStudent.userId }
					}
				}
			});

			// Create test submission
			testSubmission = await prisma.submission.create({
				data: {
					submitterId: testStudent.userId,
					assignmentId: testAssignment.assignmentId,
					submissionFilePath: "test/path/file.pdf"
				}
			});

			// Connect student to class
			await prisma.userInClass.create({
				data: {
					userId: testStudent.userId,
					classId: testClass.classId
				}
			});
		});
	});

	describe("getStudentSubmission", () => {
		it("should retrieve all submissions for a student", async () => {
			const submissions = await submitService.getStudentSubmission(
				testStudent.userId
			);
			expect(submissions).toHaveLength(1);
			expect(submissions[0].submitterId).toBe(testStudent.userId);
		});
	});

	describe("getStudentSubmissionForAssignment", () => {
		it("should retrieve submissions for a student for a specific assignment", async () => {
			const submissions = await submitService.getStudentSubmissionForAssignment(
				testStudent.userId,
				testAssignment.assignmentId
			);
			expect(submissions).toHaveLength(1);
			expect(submissions[0].submitterId).toBe(testStudent.userId);
			expect(submissions[0].assignmentId).toBe(testAssignment.assignmentId);
		});
	});

	describe("getSubmissionsForAssignment", () => {
		it("should retrieve all submissions for an assignment", async () => {
			const submissions = await submitService.getSubmissionsForAssignment(
				testAssignment.assignmentId
			);
			expect(submissions).toHaveLength(1);
			expect(submissions[0].assignmentId).toBe(testAssignment.assignmentId);
		});
	});

	describe("createSubmission", () => {
		it("should create a new submission for a student", async () => {
			const newSubmission = await submitService.createSubmission(
				testStudent.userId,
				testAssignment.assignmentId,
				"new/path/file.pdf"
			);
			expect(newSubmission).toBeTruthy();
			expect(newSubmission.submitterId).toBe(testStudent.userId);
			expect(newSubmission.assignmentId).toBe(testAssignment.assignmentId);
			expect(newSubmission.submissionFilePath).toBe("new/path/file.pdf");
			expect(sendNotificationToUser).toHaveBeenCalledTimes(2);
		});

		it("should throw an error if assignment is overdue", async () => {
			await prisma.assignment.update({
				where: { assignmentId: testAssignment.assignmentId },
				data: { dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000) }
			});

			await expect(
				submitService.createSubmission(
					testStudent.userId,
					testAssignment.assignmentId,
					"path/file.pdf"
				)
			).rejects.toThrow("Assignment is overdue");
		});

		it("should throw an error if max submissions reached", async () => {
			await prisma.submission.createMany({
				data: [
					{
						submitterId: testStudent.userId,
						assignmentId: testAssignment.assignmentId,
						submissionFilePath: "path1.pdf"
					},
					{
						submitterId: testStudent.userId,
						assignmentId: testAssignment.assignmentId,
						submissionFilePath: "path2.pdf"
					}
				]
			});

			await expect(
				submitService.createSubmission(
					testStudent.userId,
					testAssignment.assignmentId,
					"path3.pdf"
				)
			).rejects.toThrow("Max submissions reached");
		});
	});

	describe("updateSubmission", () => {
		it("should update an existing submission", async () => {
			const updatedSubmission = await submitService.updateSubmission(
				testSubmission.submissionId,
				{ submissionFilePath: "updated/path/file.pdf" }
			);
			expect(updatedSubmission.submissionFilePath).toBe(
				"updated/path/file.pdf"
			);
		});
	});

	describe("deleteSubmission", () => {
		it("should delete an existing submission", async () => {
			await submitService.deleteSubmission(testSubmission.submissionId);
			const deletedSubmission = await prisma.submission.findUnique({
				where: { submissionId: testSubmission.submissionId }
			});
			expect(deletedSubmission).toBeNull();
		});
	});
});
