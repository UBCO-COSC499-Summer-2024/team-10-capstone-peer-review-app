import prisma from "../../../prisma/prismaClient.js";
import categoryService from "../../../src/services/categoryService.js";
import apiError from "../../../src/utils/apiError.js";

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("categoryService Integration Tests", () => {
	let testInstructor, testClass, testCategory, testAssignment;

	beforeEach(async () => {
		await prisma.$transaction(async (prisma) => {
			// Clean up
			await prisma.assignment.deleteMany();
			await prisma.category.deleteMany();
			await prisma.class.deleteMany();
			await prisma.user.deleteMany();

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
					endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
					instructorId: testInstructor.userId
				}
			});

			// Create test categorys
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

	describe("getAllCategories", () => {
		it("should retrieve all categories for a class", async () => {
			const categories = await categoryService.getAllCategories(
				testClass.classId
			);
			expect(categories).toHaveLength(1);
			expect(categories[0].name).toBe(testCategory.name);
		});

		it("should throw an error if the class is not found", async () => {
			await expect(
				categoryService.getAllCategories("non-existent-id")
			).rejects.toThrow("Class not found");
		});
	});

	describe("createCategory", () => {
		it("should create a new category", async () => {
			const newCategory = await categoryService.createCategory(
				testClass.classId,
				"New Category"
			);
			expect(newCategory).toBeTruthy();
			expect(newCategory.name).toBe("New Category");
		});

		it("should throw an error if a category with the same name already exists", async () => {
			await expect(
				categoryService.createCategory(testClass.classId, testCategory.name)
			).rejects.toThrow("Category with name Test Category already exists");
		});
	});

	describe("updateCategory", () => {
		it("should update a category", async () => {
			const updatedCategory = await categoryService.updateCategory(
				testCategory.categoryId,
				"Updated Category"
			);
			expect(updatedCategory.name).toBe("Updated Category");
		});

		it("should throw an error if the category is not found", async () => {
			await expect(
				categoryService.updateCategory("non-existent-id", "New Name")
			).rejects.toThrow("Category not found");
		});
	});

	describe("deleteCategory", () => {
		it("should delete a category", async () => {
			await categoryService.deleteCategory(testCategory.categoryId);
			const deletedCategory = await prisma.category.findUnique({
				where: { categoryId: testCategory.categoryId }
			});
			expect(deletedCategory).toBeNull();
		});

		it("should throw an error if the category is not found", async () => {
			await expect(
				categoryService.deleteCategory("non-existent-id")
			).rejects.toThrow("Category not found");
		});
	});

	describe("getCategoryAssignments", () => {
		it("should retrieve assignments for a category", async () => {
			const assignments = await categoryService.getCategoryAssignments(
				testCategory.categoryId
			);
			expect(assignments).toHaveLength(1);
			expect(assignments[0].title).toBe(testAssignment.title);
		});
	});

	describe("addAssignmentToCategory", () => {
		it("should add an assignment to a category", async () => {
			const newAssignment = await prisma.assignment.create({
				data: {
					title: "New Assignment",
					description: "New Description",
					dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
					maxSubmissions: 2,
					classId: testClass.classId
				}
			});

			await categoryService.addAssignmentToCategory(
				testCategory.categoryId,
				newAssignment.assignmentId
			);

			// Fetch the updated category with assignments
			const updatedCategory = await prisma.category.findUnique({
				where: { categoryId: testCategory.categoryId },
				include: { assignments: true }
			});

			// Check if the assignment is in the category
			expect(
				updatedCategory.assignments.some(
					(assignment) => assignment.assignmentId === newAssignment.assignmentId
				)
			).toBe(true);
		});
	});

	it("should throw an error if the assignment already exists in the category", async () => {
		await expect(
			categoryService.addAssignmentToCategory(
				testCategory.categoryId,
				testAssignment.assignmentId
			)
		).rejects.toThrow("Assignment already exists in category");
	});

	describe("deleteAssignmentFromCategory", () => {
		it("should delete an assignment from a category", async () => {
			await categoryService.deleteAssignmentFromCategory(
				testCategory.categoryId,
				testAssignment.assignmentId
			);

			const updatedCategory = await prisma.category.findUnique({
				where: { categoryId: testCategory.categoryId },
				include: { assignments: true }
			});

			// Check if the assignment is not in the category
			expect(
				updatedCategory.assignments.some(
					(assignment) =>
						assignment.assignmentId === testAssignment.assignmentId
				)
			).toBe(false);
		});

		it("should throw an error if the assignment doesn't exist in the category", async () => {
			await categoryService.deleteAssignmentFromCategory(
				testCategory.categoryId,
				testAssignment.assignmentId
			);
			await expect(
				categoryService.deleteAssignmentFromCategory(
					testCategory.categoryId,
					testAssignment.assignmentId
				)
			).rejects.toThrow("Assignment doesn't exists in category");
		});
	});
});
