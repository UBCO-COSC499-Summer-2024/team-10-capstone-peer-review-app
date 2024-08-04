import prisma from "../../../prisma/prismaClient.js";
import todoService from "../../../src/services/todoService.js";
import apiError from "../../../src/utils/apiError.js";

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

beforeEach(async () => {
	await prisma.$transaction(async (prisma) => {
		await prisma.todo.deleteMany();
		await prisma.class.deleteMany();
		await prisma.user.deleteMany();
	});
});

describe("todoService Integration Tests", () => {
	let testUser, testClass;

	beforeEach(async () => {
		testUser = await prisma.user.create({
			data: {
				email: "testuser@example.com",
				password: "password123",
				firstname: "Test",
				lastname: "User",
				role: "INSTRUCTOR"
			}
		});

		testClass = await prisma.class.create({
			data: {
				instructorId: testUser.userId,
				classname: "Test Class",
				description: "Test Description",
				startDate: new Date(),
				endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
			}
		});
	});

	describe("getTodosByClassAndUser", () => {
		it("should retrieve todos for a user in a class", async () => {
			const todo1 = await prisma.todo.create({
				data: {
					classId: testClass.classId,
					userId: testUser.userId,
					content: "Test Todo 1"
				}
			});

			const todo2 = await prisma.todo.create({
				data: {
					classId: testClass.classId,
					userId: testUser.userId,
					content: "Test Todo 2"
				}
			});

			const todos = await todoService.getTodosByClassAndUser(
				testClass.classId,
				testUser.userId
			);

			expect(todos).toHaveLength(2);
			expect(todos[0].content).toBe("Test Todo 2"); // Assuming descending order by createdAt
			expect(todos[1].content).toBe("Test Todo 1");
		});

		it("should return an empty array if no todos exist", async () => {
			const todos = await todoService.getTodosByClassAndUser(
				testClass.classId,
				testUser.userId
			);

			expect(todos).toHaveLength(0);
		});
	});

	describe("createTodo", () => {
		it("should create a new todo", async () => {
			const newTodo = await todoService.createTodo(
				testClass.classId,
				testUser.userId,
				"New Todo"
			);

			expect(newTodo).toBeTruthy();
			expect(newTodo.content).toBe("New Todo");
			expect(newTodo.classId).toBe(testClass.classId);
			expect(newTodo.userId).toBe(testUser.userId);
		});
	});

	describe("updateTodo", () => {
		it("should update an existing todo", async () => {
			const todo = await prisma.todo.create({
				data: {
					classId: testClass.classId,
					userId: testUser.userId,
					content: "Original Todo"
				}
			});

			const updatedTodo = await todoService.updateTodo(todo.todoId, {
				content: "Updated Todo",
				completed: true
			});

			expect(updatedTodo.content).toBe("Updated Todo");
			expect(updatedTodo.completed).toBe(true);
		});

		it("should throw an error when updating non-existent todo", async () => {
			await expect(
				todoService.updateTodo("non-existent-id", { content: "Updated Todo" })
			).rejects.toThrow(new apiError("Failed to update todo", 500));
		});
	});

	describe("deleteTodo", () => {
		it("should delete an existing todo", async () => {
			const todo = await prisma.todo.create({
				data: {
					classId: testClass.classId,
					userId: testUser.userId,
					content: "Todo to delete"
				}
			});

			await todoService.deleteTodo(todo.todoId);

			const deletedTodo = await prisma.todo.findUnique({
				where: { todoId: todo.todoId }
			});

			expect(deletedTodo).toBeNull();
		});

		it("should throw an error when deleting non-existent todo", async () => {
			await expect(todoService.deleteTodo("non-existent-id")).rejects.toThrow(
				new apiError("Failed to delete todo", 500)
			);
		});
	});
});
