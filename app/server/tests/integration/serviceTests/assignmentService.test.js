import prisma from "../../../prisma/prismaClient.js";
import assignService from "../../../src/services/assignService.js";
import apiError from "../../../src/utils/apiError.js";
import { sendNotificationToClass } from "../../../src/services/notifsService.js";

// Mock the notification service
jest.mock("../../../src/services/notifsService.js", () => ({
	sendNotificationToClass: jest.fn()
}));

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("assignService Integration Tests", () => {
	let testClass, testCategory, testAssignment, testStudent, testInstructor;

	beforeEach(async () => {
		await prisma.$transaction(async (prisma) => {
			// Clean up
			await prisma.extendedDueDate.deleteMany();
			await prisma.assignment.deleteMany();
			await prisma.category.deleteMany();
			await prisma.class.deleteMany();
			await prisma.user.deleteMany();

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

			// Create test class
			testClass = await prisma.class.create({
				data: {
					classname: "Test Class",
					description: "Test Description",
					startDate: new Date(),
					endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
					instructorId: testInstructor.userId
				}
			});

			// Create test category
			testCategory = await prisma.category.create({
				data: {
					name: "Test Category",
					classId: testClass.classId
				}
			});

			// Create test assignment
			testAssignment = await prisma.assignment.create({
				data: {
					title: "Test Assignment",
					description: "Test Description",
					dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
					maxSubmissions: 1,
					classId: testClass.classId,
					categoryId: testCategory.categoryId
				}
			});
		});
	});

	describe("addAssignmentToClass", () => {
		it("should add an assignment to a class", async () => {
			const assignmentData = {
				title: "New Assignment",
				description: "New Description",
				dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
				maxSubmissions: 2,
				isPeerReviewAnonymous: false,
				reviewOption: "MANUAL",
				assignmentFilePath: "/path/to/file",
				allowedFileTypes: ["pdf", "doc"]
			};

			const newAssignment = await assignService.addAssignmentToClass(
				testClass.classId,
				testCategory.categoryId,
				assignmentData
			);

			expect(newAssignment).toBeTruthy();
			expect(newAssignment.title).toBe(assignmentData.title);
			expect(sendNotificationToClass).toHaveBeenCalled();
		});

		it("should throw an error if the class is not found", async () => {
			const assignmentData = {
				title: "New Assignment",
				description: "New Description",
				dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
				maxSubmissions: 2
			};

			await expect(
				assignService.addAssignmentToClass(
					"non-existent-id",
					testCategory.categoryId,
					assignmentData
				)
			).rejects.toThrow("Class not found");
		});
	});

	describe("removeAssignmentFromClass", () => {
		it("should remove an assignment from a class", async () => {
			await assignService.removeAssignmentFromClass(
				testAssignment.assignmentId
			);

			const deletedAssignment = await prisma.assignment.findUnique({
				where: { assignmentId: testAssignment.assignmentId }
			});

			expect(deletedAssignment).toBeNull();
		});
	});

	describe("updateAssignmentInClass", () => {
		it("should update an assignment in a class", async () => {
			const updateData = {
				title: "Updated Assignment",
				description: "Updated Description",
				dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
				maxSubmissions: 3
			};

			const updatedAssignment = await assignService.updateAssignmentInClass(
				testClass.classId,
				testAssignment.assignmentId,
				testCategory.categoryId,
				updateData
			);

			expect(updatedAssignment.title).toBe(updateData.title);
		});

		it("should throw an error if the assignment is not found", async () => {
			const updateData = {
				title: "Updated Assignment"
			};

			await expect(
				assignService.updateAssignmentInClass(
					testClass.classId,
					"non-existent-id",
					testCategory.categoryId,
					updateData
				)
			).rejects.toThrow("Assignment not found");
		});
	});

	describe("getAssignmentInClass", () => {
		it("should get an assignment in a class", async () => {
			const assignment = await assignService.getAssignmentInClass(
				testClass.classId,
				testAssignment.assignmentId
			);

			expect(assignment).toBeTruthy();
			expect(assignment.assignmentId).toBe(testAssignment.assignmentId);
		});

		it("should apply extended due date for a student", async () => {
			const extendedDueDate = new Date(Date.now() + 40 * 24 * 60 * 60 * 1000);
			await prisma.extendedDueDate.create({
				data: {
					userId: testStudent.userId,
					assignmentId: testAssignment.assignmentId,
					newDueDate: extendedDueDate
				}
			});

			const assignment = await assignService.getAssignmentInClass(
				testClass.classId,
				testAssignment.assignmentId,
				testStudent.userId
			);

			expect(assignment.dueDate).toEqual(extendedDueDate);
		});
	});

	describe("getAllAssignmentsByClassId", () => {
		it("should get all assignments for a class", async () => {
			const assignments = await assignService.getAllAssignmentsByClassId(
				testClass.classId
			);

			expect(assignments).toHaveLength(1);
			expect(assignments[0].assignmentId).toBe(testAssignment.assignmentId);
		});
	});

	describe("extendDeadlineForStudent", () => {
		it("should extend the deadline for a student", async () => {
			const newDueDate = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);
			const extension = await assignService.extendDeadlineForStudent(
				testStudent.userId,
				testAssignment.assignmentId,
				newDueDate
			);

			expect(extension).toBeTruthy();
			expect(extension.newDueDate).toEqual(newDueDate);
		});

		it("should throw an error if the new due date is not after the original due date", async () => {
			const invalidDueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
			await expect(
				assignService.extendDeadlineForStudent(
					testStudent.userId,
					testAssignment.assignmentId,
					invalidDueDate
				)
			).rejects.toThrow("New due date must be after the original due date");
		});
	});

	describe("deleteExtendedDeadlineForStudent", () => {
		it("should delete the extended deadline for a student", async () => {
			const newDueDate = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);
			await assignService.extendDeadlineForStudent(
				testStudent.userId,
				testAssignment.assignmentId,
				newDueDate
			);

			await assignService.deleteExtendedDeadlineForStudent(
				testStudent.userId,
				testAssignment.assignmentId
			);

			const extension = await prisma.extendedDueDate.findUnique({
				where: {
					UniqueExtendedDueDatePerUserAssignment: {
						userId: testStudent.userId,
						assignmentId: testAssignment.assignmentId
					}
				}
			});

			expect(extension).toBeNull();
		});

		it("should throw an error if the extended deadline does not exist", async () => {
			await expect(
				assignService.deleteExtendedDeadlineForStudent(
					testStudent.userId,
					testAssignment.assignmentId
				)
			).rejects.toThrow("Record not found");
		});
	});

	describe("addAssignmentWithRubric", () => {
		it("should add an assignment with a rubric", async () => {
			const assignmentData = {
				title: "Assignment with Rubric",
				description: "Test Description",
				dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
				maxSubmissions: 2,
				allowedFileTypes: ["pdf", "doc"],
				assignmentFilePath: "/path/to/file"
			};

			const rubricData = {
				title: "Test Rubric",
				description: "Rubric Description",
				criteria: [
					{
						criteria: "Criterion 1",
						ratings: [
							{ text: "Poor", points: "1" },
							{ text: "Good", points: "3" },
							{ text: "Excellent", points: "5" }
						]
					},
					{
						criteria: "Criterion 2",
						ratings: [
							{ text: "Incomplete", points: "0" },
							{ text: "Complete", points: "2" }
						]
					}
				]
			};

			const result = await assignService.addAssignmentWithRubric(
				testClass.classId,
				testCategory.categoryId,
				assignmentData,
				rubricData,
				testInstructor.userId
			);

			expect(result).toBeTruthy();
			expect(result.assignment).toBeTruthy();
			expect(result.rubric).toBeTruthy();

			// Fetch the complete assignment data
			const completeAssignment = await prisma.assignment.findUnique({
				where: { assignmentId: result.assignment.assignmentId },
				include: {
					rubric: {
						include: {
							criteria: {
								include: {
									criterionRatings: true
								}
							}
						}
					}
				}
			});

			expect(completeAssignment).toBeTruthy();
			expect(completeAssignment.title).toBe(assignmentData.title);
			expect(completeAssignment.rubric).toBeTruthy();
			expect(completeAssignment.rubric.title).toBe(rubricData.title);
			expect(completeAssignment.rubric.criteria).toBeDefined();
			expect(completeAssignment.rubric.criteria).toHaveLength(2);

			// Check the content of the criteria
			expect(completeAssignment.rubric.criteria[0].title).toBe(
				rubricData.criteria[0].criteria
			);
			expect(completeAssignment.rubric.criteria[1].title).toBe(
				rubricData.criteria[1].criteria
			);

			// Check the ratings for each criterion
			expect(
				completeAssignment.rubric.criteria[0].criterionRatings
			).toHaveLength(3);
			expect(
				completeAssignment.rubric.criteria[1].criterionRatings
			).toHaveLength(2);
		});
	});
});
