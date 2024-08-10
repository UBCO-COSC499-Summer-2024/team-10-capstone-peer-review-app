import prisma from "../../../prisma/prismaClient.js";
import commentService from "../../../src/services/commentService.js";
import apiError from "../../../src/utils/apiError.js";

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("commentService Integration Tests", () => {
	let testStudent, testInstructor, testAssignment, testCommentChain;

	beforeEach(async () => {
		await prisma.$transaction(async (prisma) => {
			// Clean up
			await prisma.comment.deleteMany();
			await prisma.commentChain.deleteMany();
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
			const testClass = await prisma.class.create({
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
					classId: testClass.classId
				}
			});

			// Create test comment chain
			testCommentChain = await prisma.commentChain.create({
				data: {
					assignmentId: testAssignment.assignmentId,
					studentId: testStudent.userId
				}
			});
		});
	});

	describe("addCommentToAssignment", () => {
		it("should add a comment to an assignment", async () => {
			const comment = await commentService.addCommentToAssignment(
				testAssignment.assignmentId,
				testInstructor.userId,
				"This is a test comment",
				testStudent.userId
			);

			expect(comment).toBeTruthy();
			expect(comment.content).toBe("This is a test comment");
			expect(comment.user.userId).toBe(testInstructor.userId);
		});

		it("should create a new comment chain if one doesn't exist", async () => {
			const newStudent = await prisma.user.create({
				data: {
					email: "newstudent@example.com",
					password: "password123",
					firstname: "New",
					lastname: "Student",
					role: "STUDENT"
				}
			});

			const comment = await commentService.addCommentToAssignment(
				testAssignment.assignmentId,
				testInstructor.userId,
				"This is a test comment for a new student",
				newStudent.userId
			);

			expect(comment).toBeTruthy();
			expect(comment.content).toBe("This is a test comment for a new student");

			const commentChain = await prisma.commentChain.findUnique({
				where: {
					assignmentId_studentId: {
						assignmentId: testAssignment.assignmentId,
						studentId: newStudent.userId
					}
				}
			});
			expect(commentChain).toBeTruthy();
		});
	});

	describe("getCommentsForAssignment", () => {
		it("should get comments for a student", async () => {
			await commentService.addCommentToAssignment(
				testAssignment.assignmentId,
				testInstructor.userId,
				"Instructor comment",
				testStudent.userId
			);

			await commentService.addCommentToAssignment(
				testAssignment.assignmentId,
				testStudent.userId,
				"Student reply",
				testStudent.userId
			);

			const comments = await commentService.getCommentsForAssignment(
				testAssignment.assignmentId,
				testStudent.userId
			);

			expect(comments).toHaveLength(2);
			expect(comments[0].content).toBe("Instructor comment");
			expect(comments[1].content).toBe("Student reply");
		});

		it("should get all comment chains for an instructor", async () => {
			const newStudent = await prisma.user.create({
				data: {
					email: "newstudent@example.com",
					password: "password123",
					firstname: "New",
					lastname: "Student",
					role: "STUDENT"
				}
			});

			await commentService.addCommentToAssignment(
				testAssignment.assignmentId,
				testInstructor.userId,
				"Comment for first student",
				testStudent.userId
			);

			await commentService.addCommentToAssignment(
				testAssignment.assignmentId,
				testInstructor.userId,
				"Comment for second student",
				newStudent.userId
			);

			const commentChains = await commentService.getCommentsForAssignment(
				testAssignment.assignmentId,
				testInstructor.userId
			);

			expect(commentChains).toHaveLength(2);
			expect(commentChains[0].comments[0].content).toBe(
				"Comment for first student"
			);
			expect(commentChains[1].comments[0].content).toBe(
				"Comment for second student"
			);
		});
	});
});
