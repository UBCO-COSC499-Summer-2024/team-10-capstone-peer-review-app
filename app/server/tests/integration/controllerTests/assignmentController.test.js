import request from "supertest";
import prisma from "../../../prisma/prismaClient.js";
import bcrypt from "bcrypt";
import e from "express";

const API_URL = process.env.API_URL || "http://peergrade-server-test:5001"; // Adjust this URL as needed

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("assignmentController Integration Tests", () => {
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
			testCategory = await prisma.category.create({
				data: {
					name: "Test Category",
					classId: testClass.classId
				}
			});

			// Create test assignment
			// testAssignment = await prisma.assignment.create({
			// 	data: {
			// 		title: "Test Assignment",
			// 		description: "Test Description",
			// 		dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			// 		maxSubmissions: 1,
			// 		classId: testClass.classId,
			// 		categoryId: testCategory.categoryId
			// 	}
			// });
		});
	});

	describe("POST /assignment/add-assignment", () => {
		it("should create a new assignment", async () => {
			const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success");

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

			const res = await request(API_URL)
			.post("/assignment/add-assignment")
			.set("Cookie", cookie)
			.send({
				assignmentData: JSON.stringify(assignmentData),
				classId: testClass.classId,
				categoryId: testCategory.categoryId,
			});

			expect(res.body.message).toContain("Assignment successfully added to class and category");
			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			

			// Check Database for asg
			const asg = await prisma.assignment.findFirst({
				where: { classId: testClass.classId }
			});

			expect(asg).toBeTruthy();
            expect(asg.title).toBe(assignmentData.title);
            expect(asg.description).toBe(assignmentData.description);
            expect(asg.dueDate.toISOString()).toBe(assignmentData.dueDate.toISOString());
            expect(asg.classId).toBe(testClass.classId);
            expect(asg.categoryId).toBe(testCategory.categoryId);
		});
	});

	describe("POST /assignment/get-assignment", () => {
		it("should get an assignment for a class", async () => {
			const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success");

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

			const res2 = await request(API_URL)
			.post("/assignment/get-assignment")
			.set("Cookie", cookie)
			.send({
				classId: testClass.classId,
				assignmentId: testAssignment.assignmentId
			});

			//expect(res2.body.message).toContain("Assignment found");
			expect(res2.statusCode).toBe(200);
			expect(res2.body.status).toBe("Success");
		});
	});
	
	describe("POST /assignment/update-assignment", () => {
		it("should update an assignment for a class", async () => {

			const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success");

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

			const assignmentData = {
				title: "Updated Test Assignment",
				description: "Updated Test Description",
				dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
				maxSubmissions: 1,
				classId: testClass.classId,
				categoryId: testCategory.categoryId
			};

			const res = await request(API_URL)
			.post("/assignment/update-assignment")
			.set("Cookie", cookie)
			.send({
				assignmentData: JSON.stringify(assignmentData),
				classId: testClass.classId,
				assignmentId: testAssignment.assignmentId,
				categoryId: testCategory.categoryId
			});

			expect(res.body.message).toContain("Assignment successfully updated");
			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
		});

	});

	describe("POST /assignment/remove-assignment", () => {
		it("should remove assignment", async () => {
			const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success");

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

			const res2 = await request(API_URL)
			.post("/assignment/remove-assignment")
			.set("Cookie", cookie)
			.send({
				assignmentId: testAssignment.assignmentId
			});

			expect(res2.body.message).toContain("Assignment successfully removed from class");
			expect(res2.statusCode).toBe(200);
			expect(res2.body.status).toBe("Success");
		});
	});

	describe("POST /assignment/get-class-assignments", () => {
		it("should get all assignments for a class", async () => {
			const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success");

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

			const res2 = await request(API_URL)
			.post("/assignment/get-class-assignments")
			.set("Cookie", cookie)
			.send({
				classId: testClass.classId
			});

			//expect(res2.body.message).toContain("Assignments found");
			expect(res2.statusCode).toBe(200);
			expect(res2.body.status).toBe("Success");
		});
	});

	describe("POST /assignment/extend-deadline", () => {
		it("should extend the deadline for an assignment", async () => {
			const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success");

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

			const res2 = await request(API_URL)
			.post("/assignment/extend-deadline")
			.set("Cookie", cookie)
			.send({
				studentId: testStudent.userId,
				assignmentId: testAssignment.assignmentId,
				newDueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
			});

			expect(res2.body.message).toContain("Deadline successfully extended for student");
			expect(res2.statusCode).toBe(200);
			expect(res2.body.status).toBe("Success");
		});
	});

	describe("POST /assignment/delete-extended-deadline", () => {
		it("should delete the extended deadline for an assignment", async () => {
			const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success");

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

			const res0 = await request(API_URL)
			.post("/assignment/extend-deadline")
			.set("Cookie", cookie)
			.send({
				studentId: testStudent.userId,
				assignmentId: testAssignment.assignmentId,
				newDueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
			});

			const res2 = await request(API_URL)
			.post("/assignment/delete-extended-deadline")
			.set("Cookie", cookie)
			.send({
				studentId: testStudent.userId,
				assignmentId: testAssignment.assignmentId
			});

			expect(res2.body.message).toContain("Extended deadline successfully deleted");
			expect(res2.statusCode).toBe(200);
			expect(res2.body.status).toBe("Success");
		});
	});

	describe("POST /assignment/add-assignment-with-rubric", () => {
		it("should add assignment with the given rubric", async () => {
			const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success");

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

			const rubricData = {
				title: "New Rubric",
				creatorId: testInstructor.userId,
				classId: testClass.classId,
				description: "New Rubric Description",
				totalMarks: 30,
				criteria: []
			};


			const res = await request(API_URL)
			.post("/assignment/add-assignment-with-rubric")
			.set("Cookie", cookie)
			.send({
				creatorId: testInstructor.userId,
				rubricData: JSON.stringify(rubricData),
				assignmentData: JSON.stringify(assignmentData),
				classId: testClass.classId,
				categoryId: testCategory.categoryId,
			});

			expect(res.body.message).toContain("Assignment and rubric successfully added");
			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			

			// Check Database for asg
			const asg = await prisma.assignment.findFirst({
				where: { classId: testClass.classId }
			});

			expect(asg).toBeTruthy();
            expect(asg.title).toBe(assignmentData.title);
            expect(asg.description).toBe(assignmentData.description);
            expect(asg.dueDate.toISOString()).toBe(assignmentData.dueDate.toISOString());
            expect(asg.classId).toBe(testClass.classId);
            expect(asg.categoryId).toBe(testCategory.categoryId);
		});
	});
});
