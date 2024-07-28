import prisma from "../../../prisma/prismaClient";
import categoryService from "../../../src/services/categoryService.js";
import authService from "../../../src/services/authService.js";
import apiError from "../../../src/utils/apiError";
import e from "express";

let user;
beforeAll(async () => {
    await prisma.$connect();
    // const userData = {
    //     email: "verified@example.com",
    //     password: "password123",
    //     firstname: "Verified",
    //     lastname: "User",
    //     role: "STUDENT"
    // };

    // await authService.registerUser(userData);
    // await prisma.user.update({
    //     where: { email: userData.email },
    //     data: { isEmailVerified: true, isRoleActivated: true }
    // });

    // user = await authService.loginUser(
    //     userData.email,
    //     userData.password
    // );
});

afterAll(async () => {
    await prisma.$disconnect();
});

beforeEach(async () => {
    await prisma.category.deleteMany();
});

describe("Category Service Integration Tests", () => {
    describe("createCategory", () => {
        it("should create a new category", async () => {
            const testCategory = {
                classId: "1", // Adjust this ID to be a valid class ID
                name: "Test Category"
            };

            const category = await categoryService.createCategory(testCategory);

            expect(category).toBeTruthy();
            expect(category.name).toBe(testCategory.name);
        });

        it("should throw an error if the class ID is invalid", async () => {
            const testCategory = {
                classId: "invalid-id",
                name: "Test Category"
            };

            try {
                await categoryService.createCategory(testCategory);
            } catch (error) {
                expect(error).toBeInstanceOf(apiError);
                expect(error.message).toBe("Class not found");
            }
        });

        it("should throw an error if the category name is already taken", async () => {
            const testCategory = {
                classId: "1",
                name: "Test Category"
            };

            await categoryService.createCategory(testCategory);

            try {
                await categoryService.createCategory(testCategory);
            } catch (error) {
                expect(error).toBeInstanceOf(apiError);
                expect(error.message).toBe("Category name is already taken");
            }
        });
    });

    describe("updateCategory", () => {
        it("should update a category", async () => {
            const testCategory = {
                classId: "1",
                name: "Test Category"
            };

            const category = await categoryService.createCategory(testCategory);

            const updatedCategory = await categoryService.updateCategory(category.categoryId, "Updated Category");

            expect(updatedCategory).toBeTruthy();
            expect(updatedCategory.name).toBe("Updated Category");
        });


        it("should throw an error if the category name is already taken", async () => {
            const testCategory = {
                classId: "1",
                name: "Test Category"
            };

            const category = await categoryService.createCategory(testCategory);

            const testCategory2 = {
                classId: "1",
                name: "Test Category 2"
            };

            const category2 = await categoryService.createCategory(testCategory2);

            try {
                await categoryService.updateCategory(category.categoryId, "Test Category 2");
            } catch (error) {
                expect(error).toBeInstanceOf(apiError);
                expect(error.message).toBe("Category name is already taken");
            }
        });
    });

    describe("deleteCategory", () => {
        it("should delete a category", async () => {
            const testCategory = {
                classId: "1",
                name: "Test Category"
            };

            const category = await categoryService.createCategory(testCategory);

            await categoryService.deleteCategory(category.categoryId);

            const deletedCategory = await prisma.category.findUnique({
                where: {
                    categoryId: category.categoryId
                }
            });

            expect(deletedCategory).toBeNull();
        });
    });

    describe("getAllCategories", () => {
        it("should return all categories", async () => {
            const testCategory = {
                classId: "1",
                name: "Test Category"
            };

            const category = await categoryService.createCategory(testCategory);

            const categories = await categoryService.getAllCategories();

            expect(categories).toBeTruthy();
            expect(categories.length).toBe(1);
            expect(categories[0].name).toBe(category.name);
        });
    });

    describe("getCategoryAssignments", () => {
        it("should return all assignments for a category", async () => {
            const testCategory = {
                classId: "1",
                name: "Test Category"
            };

            const category = await categoryService.createCategory(testCategory);

            const testAssignment = {
                classId: "1",
                categoryId: category.categoryId,
                title: "Test Assignment",
                description: "Test Assignment Description",
                dueDate: "2023-06-01T00:00:00.000Z",
                maxSubmissions: 1,
                isGroupAssignment: false,
                assignmentType: "URL",
                assignmentFilePath: "path/to/assignment"
            };

            const assignment = await prisma.assignment.create({
                data: testAssignment
            });

            const assignments = await categoryService.getCategoryAssignments(category.categoryId);

            expect(assignments).toBeTruthy();
            expect(assignments.length).toBe(1);
            expect(assignments[0].title).toBe(assignment.title);
        });
    });

    describe("addAssignmentToCategory", () => {

        it("should add an assignment to a category", async () => {
            const testCategory = {
                classId: "1",
                name: "Test Category"
            };

            const category = await categoryService.createCategory(testCategory);

            const testAssignment = {
                classId: "1",
                categoryId: category.categoryId,
                title: "Test Assignment",
                description: "Test Assignment Description",
                dueDate: "2023-06-01T00:00:00.000Z",
                maxSubmissions: 1,
                isGroupAssignment: false,
                assignmentType: "URL",
                assignmentFilePath: "path/to/assignment"
            };

            const assignment = await prisma.assignment.create({
                data: testAssignment
            });

            const categoryAssignment = await categoryService.addAssignmentToCategory(category.categoryId, assignment.assignmentId);

            expect(categoryAssignment).toBeTruthy();
            expect(categoryAssignment.assignments[0].title).toBe(testAssignment.title);
        });

        it("should throw an error if the category ID is invalid", async () => {
            const testAssignment = {
                classId: "1",
                categoryId: "invalid-id",
                title: "Test Assignment",
                description: "Test Assignment Description",
                dueDate: "2023-06-01T00:00:00.000Z",
                maxSubmissions: 1,
                isGroupAssignment: false,
                assignmentType: "URL",
                assignmentFilePath: "path/to/assignment"
            };

            try {
                await categoryService.addAssignmentToCategory("invalid-id", testAssignment);
            } catch (error) {
                expect(error).toBeInstanceOf(apiError);
                expect(error.message).toBe("Category not found");
            }
        });
    });

    describe("deleteAssignmentFromCategory", () => {
        it("should delete an assignment from a category", async () => {
            const testCategory = {
                classId: "1",
                name: "Test Category"
            };

            const category = await categoryService.createCategory(testCategory);

            const testAssignment = {
                classId: "1",
                categoryId: category.categoryId,
                title: "Test Assignment",
                description: "Test Assignment Description",
                dueDate: "2023-06-01T00:00:00.000Z",
                maxSubmissions: 1,
                isGroupAssignment: false,
                assignmentType: "URL",
                assignmentFilePath: "path/to/assignment"
            };

            const assignment = await prisma.assignment.create({
                data: testAssignment
            });

            await categoryService.addAssignmentToCategory(category.categoryId, assignment.assignmentId);

            await categoryService.deleteAssignmentFromCategory(category.categoryId, assignment.assignmentId);

            const categoryAssignment = await prisma.category.findUnique({
                where: {
                    categoryId: category.categoryId
                },
                include: {
                    assignments: true
                }
            });

            expect(categoryAssignment).toBeTruthy();
            expect(categoryAssignment.assignments.length).toBe(0);
        });

        it("should throw an error if the category ID is invalid", async () => {
            const testAssignment = {
                classId: "1",
                categoryId: "invalid-id",
                title: "Test Assignment",
                description: "Test Assignment Description",
                dueDate: "2023-06-01T00:00:00.000Z",
                maxSubmissions: 1,
                isGroupAssignment: false,
                assignmentType: "URL",
                assignmentFilePath: "path/to/assignment"
            };

            try {
                await categoryService.deleteAssignmentFromCategory("invalid-id", testAssignment);
            } catch (error) {
                expect(error).toBeInstanceOf(apiError);
                expect(error.message).toBe("Category not found");
            }
        });
    });
});