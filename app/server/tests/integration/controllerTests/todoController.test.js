import request from "supertest";
import prisma from "../../../prisma/prismaClient.js";
import bcrypt from "bcrypt";

const API_URL = "http://peergrade-server-test:5001";

const hashPassword = async (password) => {
	const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);
	return await bcrypt.hash(password, SALT_ROUNDS);
};

describe("Todo Controller", () => {
	let testUser, testClass, testTodo;
	let userCookie;

	beforeAll(async () => {
		await prisma.$connect();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	beforeEach(async () => {
		await prisma.todo.deleteMany();
		await prisma.class.deleteMany();
		await prisma.user.deleteMany();

		// Create test user
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

		// Create test class
		testClass = await prisma.class.create({
			data: {
				instructorId: testUser.userId,
				classname: "Test Class",
				description: "Test Description",
				startDate: new Date(),
				endDate: new Date(new Date().setMonth(new Date().getMonth() + 3))
			}
		});

		// Create test todo
		testTodo = await prisma.todo.create({
			data: {
				classId: testClass.classId,
				userId: testUser.userId,
				content: "Test Todo"
			}
		});

		// Login and get cookie
		const loginRes = await request(API_URL).post("/auth/login").send({
			email: "user@example.com",
			password: "password123"
		});
		userCookie = loginRes.headers["set-cookie"];

		expect(userCookie).toBeTruthy();
	});

	describe("GET /todo/:classId", () => {
		it("should get all todos for a user in a class", async () => {
			const res = await request(API_URL)
				.get(`/todo/${testClass.classId}`)
				.set("Cookie", userCookie);

			console.log("res", res.body);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
			expect(res.body.data.length).toBe(1);
			expect(res.body.data[0].content).toBe("Test Todo");
		});
	});

	describe("POST /todo/:classId", () => {
		it("should create a new todo", async () => {
			const newTodoData = {
				content: "New Test Todo"
			};

			const res = await request(API_URL)
				.post(`/todo/${testClass.classId}`)
				.set("Cookie", userCookie)
				.send(newTodoData);

			expect(res.statusCode).toBe(201);
			expect(res.body.status).toBe("Success");
			expect(res.body.data.content).toBe("New Test Todo");
		});
	});

	describe("PUT /todo/:todoId", () => {
		it("should update a todo", async () => {
			const updateData = {
				content: "Updated Test Todo"
			};

			const res = await request(API_URL)
				.put(`/todo/${testTodo.todoId}`)
				.set("Cookie", userCookie)
				.send(updateData);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.data.content).toBe("Updated Test Todo");
		});
	});

	describe("DELETE /todo/:todoId", () => {
		it("should delete a todo", async () => {
			const res = await request(API_URL)
				.delete(`/todo/${testTodo.todoId}`)
				.set("Cookie", userCookie);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe("Todo deleted successfully");

			// Verify the todo was actually deleted
			const deletedTodo = await prisma.todo.findUnique({
				where: { todoId: testTodo.todoId }
			});
			expect(deletedTodo).toBeNull();
		});
	});
});
