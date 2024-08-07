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

describe("commentController Integration Tests", () => {
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
					password: await bcrypt.hash("password123", 10),
					firstname: "Test",
					lastname: "Student",
					role: "STUDENT",
                    isEmailVerified: true,
					isRoleActivated: true
				}
			});

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

	describe("POST /assignment/:assignmentId/comments", () => {
		it("should add a comment to an assignment", async () => {
            const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success")

			const res = await request(API_URL)
			.post(`/assignment/${testAssignment.assignmentId}/comments`)
			.set("Cookie", cookie)
			.send({
				content: "This is a test comment",
				studentId: testStudent.userId
            });

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("Success");
            expect(res.body.data).toBeTruthy();

			expect(res.body.data.content).toBe("This is a test comment");
			expect(res.body.data.user.userId).toBe(testInstructor.userId);
		});

		it("should create a new comment chain if one doesn't exist", async () => {
            const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success")

            const newStudent = await prisma.user.create({
				data: {
					email: "newstudent@example.com",
					password: "password123",
					firstname: "New",
					lastname: "Student",
					role: "STUDENT"
				}
			});

			const res = await request(API_URL)
			.post(`/assignment/${testAssignment.assignmentId}/comments`)
			.set("Cookie", cookie)
			.send({
				content: "This is a test comment for a new student",
				studentId: newStudent.userId
            });

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("Success");
            expect(res.body.data).toBeTruthy();
			expect(res.body.data.content).toBe("This is a test comment for a new student");

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

	describe("GET /assignment/:assignmentId/comments", () => {
		it("should get comments for a student", async () => {
            const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success")


			const res = await request(API_URL)
			.post(`/assignment/${testAssignment.assignmentId}/comments`)
			.set("Cookie", cookie)
			.send({
				content: "Instructor comment",
				studentId: testStudent.userId
            });

            const res0 = await request(API_URL).post("/auth/logout").set("Cookie", cookie).send({
				email: "instructor@example.com",
				password: "password123"
			});

            const res2 = await request(API_URL).post("/auth/login").send({
				email: "student@example.com",
				password: "password123"
			});

			const cookieStudent = res2.headers["set-cookie"];

			const res3 = await request(API_URL)
			.post(`/assignment/${testAssignment.assignmentId}/comments`)
			.set("Cookie", cookieStudent)
			.send({
				content: "Student reply",
				studentId: testStudent.userId
            });


            const res4 = await request(API_URL)
			.get(`/assignment/${testAssignment.assignmentId}/comments`)
			.set("Cookie", cookieStudent);

            expect(res4.statusCode).toBe(200);
            expect(res4.body.status).toBe("Success");
			expect(res4.body.data).toHaveLength(2);
			expect(res4.body.data[0].content).toBe("Instructor comment");
			expect(res4.body.data[1].content).toBe("Student reply");
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

            const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success")

			const res0 = await request(API_URL)
			.post(`/assignment/${testAssignment.assignmentId}/comments`)
			.set("Cookie", cookie)
			.send({
				content: "Comment for first student",
				studentId: testStudent.userId
            });

            const res2 = await request(API_URL)
			.post(`/assignment/${testAssignment.assignmentId}/comments`)
			.set("Cookie", cookie)
			.send({
				content: "Comment for second student",
				studentId: newStudent.userId
            });

            const res4 = await request(API_URL)
            .get(`/assignment/${testAssignment.assignmentId}/comments`)
			.set("Cookie", cookie);

            expect(res4.statusCode).toBe(200);
            expect(res4.body.status).toBe("Success");
			expect(res4.body.data).toHaveLength(2);
			expect(res4.body.data[0].comments[0].content).toBe(
				"Comment for first student"
			);
			expect(res4.body.data[1].comments[0].content).toBe(
				"Comment for second student"
			);
		});
	});
});