import request from "supertest";
import prisma from "../../../prisma/prismaClient.js";
import bcrypt from "bcrypt";

const API_URL = process.env.API_URL || "http://peergrade-server-test:5001"; // Adjust this URL as needed

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("category Controller Integration Tests", () => {
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
					password: await bcrypt.hash("password123", 10),
					firstname: "Test",
					lastname: "Instructor",
					role: "INSTRUCTOR",
					isEmailVerified: true,
					isRoleActivated: true
				}
			});

			// Create test student
			testStudent = await prisma.user.create({
				data: {
					email: "student@example.com",
					password: "password123",
					firstname: "Test",
					lastname: "Student",
					role: "STUDENT",
					isEmailVerified: true,
					isRoleActivated: true
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
			// testCategory = await prisma.category.create({
			// 	data: {
			// 		name: "Test Category",
			// 		classId: testClass.classId
			// 	}
			// });

			// Create test assignment
			testAssignment = await prisma.assignment.create({
				data: {
					title: "Test Assignment",
					description: "Test Description",
					dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
					maxSubmissions: 1,
					classId: testClass.classId,
				}
			});
		});
	});

	describe("POST /category/createCategory", () => {
		it("should create a new category", async () => {
            const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success");

			const res = await request(API_URL)
				.post("/category/createCategory")
				.set("Cookie", cookie)
				.send({
					classId: testClass.classId,
					name: "Test Category"
				});

			expect(res.body.message).toBe("Category created");
            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe("Success");
		});
	});

	describe("POST /category/allCategories", () => {
		it("should get all categories in class", async () => {
            const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success");

			const res = await request(API_URL)
			.post("/category/createCategory")
			.set("Cookie", cookie)
			.send({
				classId: testClass.classId,
				name: "Test Category"
			});

			const res2 = await request(API_URL)
			.post("/category/allCategories")
			.set("Cookie", cookie)
			.send({
				classId: testClass.classId,
			});

			expect(res2.body.message).toBe("Retrieved all categories in class");
			expect(res2.body.data.length).toBe(1);
            expect(res2.statusCode).toBe(200);
            expect(res2.body.status).toBe("Success");
		});
	});

	describe("POST /category/updateCategory", () => {
		it("should update a category", async () => {
			const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success");

			const res = await request(API_URL)
			.post("/category/createCategory")
			.set("Cookie", cookie)
			.send({
				classId: testClass.classId,
				name: "Test Category"
			});

			const category = await prisma.category.findFirst({
				where: {
					name: "Test Category"
				}
			});

			const res2 = await request(API_URL)
			.post("/category/updateCategory")
			.set("Cookie", cookie)
			.send({
				categoryId: category.categoryId,
				name: "Updated Category"
			});

			expect(res2.body.message).toBe("Category updated");
            expect(res2.statusCode).toBe(200);
            expect(res2.body.status).toBe("Success");
		});
	});

	describe("POST /category/deleteCategory", () => {
		it("should delete a category", async () => {
			const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success");

			const res = await request(API_URL)
			.post("/category/createCategory")
			.set("Cookie", cookie)
			.send({
				classId: testClass.classId,
				name: "Test Category"
			});

			const category = await prisma.category.findFirst({
				where: {
					name: "Test Category"
				}
			});

			const res2 = await request(API_URL)
			.delete("/category/deleteCategory")
			.set("Cookie", cookie)
			.send({
				categoryId: category.categoryId
			});

			expect(res2.body.message).toBe("Category deleted");
            expect(res2.statusCode).toBe(200);
            expect(res2.body.status).toBe("Success");
		});
	});

	describe("POST /category/addAssignment", () => {
		it("should add an assignment to a category", async () => {
			const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success");

			const res = await request(API_URL)
			.post("/category/createCategory")
			.set("Cookie", cookie)
			.send({
				classId: testClass.classId,
				name: "Test Category"
			});

			const category = await prisma.category.findFirst({
				where: {
					name: "Test Category"
				}
			});

			const res2 = await request(API_URL)
			.post("/category/addAssignment")
			.set("Cookie", cookie)
			.send({
				assignmentId: testAssignment.assignmentId,
				categoryId: category.categoryId
			});

			expect(res2.body.message).toBe("Assignment added to category");
			expect(res2.statusCode).toBe(200);
			expect(res2.body.status).toBe("Success");
		});
	});

	describe("POST /category/deleteAssignment", () => {
		it("should delete an assignment from a category", async () => {
			const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success");

			const res = await request(API_URL)
			.post("/category/createCategory")
			.set("Cookie", cookie)
			.send({
				classId: testClass.classId,
				name: "Test Category"
			});

			const category = await prisma.category.findFirst({
				where: {
					name: "Test Category"
				}
			});

			const res3 = await request(API_URL)
			.post("/category/addAssignment")
			.set("Cookie", cookie)
			.send({
				assignmentId: testAssignment.assignmentId,
				categoryId: category.categoryId
			});

			const res2 = await request(API_URL)
			.delete("/category/deleteAssignment")
			.set("Cookie", cookie)
			.send({
				assignmentId: testAssignment.assignmentId,
				categoryId: category.categoryId
			});

			expect(res2.body.message).toBe("Assignment deleted from category");
			expect(res2.statusCode).toBe(200);
			expect(res2.body.status).toBe("Success");
		});
	});

	describe("POST /category/categoryAssignments", () => {
		it("should get assignments for a specific category", async () => {
			const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success");

			const res = await request(API_URL)
			.post("/category/createCategory")
			.set("Cookie", cookie)
			.send({
				classId: testClass.classId,
				name: "Test Category"
			});

			const category = await prisma.category.findFirst({
				where: {
					name: "Test Category"
				}
			});

			const res3 = await request(API_URL)
			.post("/category/addAssignment")
			.set("Cookie", cookie)
			.send({
				assignmentId: testAssignment.assignmentId,
				categoryId: category.categoryId
			});

			const res2 = await request(API_URL)
			.post("/category/categoryAssignments")
			.set("Cookie", cookie)
			.send({
				categoryId: category.categoryId
			});

			expect(res2.body.message).toBe("Retrieved category assignments");
			expect(res2.body.data.length).toBe(1);
			expect(res2.statusCode).toBe(200);
			expect(res2.body.status).toBe("Success");
		});
	});

});
