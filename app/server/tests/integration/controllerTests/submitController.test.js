import request from "supertest";
import prisma from "../../../prisma/prismaClient.js";
import bcrypt from "bcrypt";

const API_URL = "http://peergrade-server-test:5001";

const hashPassword = async (password) => {
	const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);
	return await bcrypt.hash(password, SALT_ROUNDS);
};

describe("Submit Controller", () => {
	let testStudent, testInstructor, testClass, testAssignment, testSubmission;
	let studentCookie, instructorCookie;

	beforeAll(async () => {
		await prisma.$connect();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	beforeEach(async () => {
		await prisma.submission.deleteMany();
		await prisma.assignment.deleteMany();
		await prisma.class.deleteMany();
		await prisma.user.deleteMany();

		// Create test users
		testStudent = await prisma.user.create({
			data: {
				email: "student@example.com",
				password: await hashPassword("password123"),
				firstname: "Test",
				lastname: "Student",
				role: "STUDENT",
				isEmailVerified: true,
				isRoleActivated: true
			}
		});

		testInstructor = await prisma.user.create({
			data: {
				email: "instructor@example.com",
				password: await hashPassword("password123"),
				firstname: "Test",
				lastname: "Instructor",
				role: "INSTRUCTOR",
				isEmailVerified: true,
				isRoleActivated: true
			}
		});

		// Create a test class
		testClass = await prisma.class.create({
			data: {
				instructorId: testInstructor.userId,
				classname: "Test Class",
				description: "Test Description",
				startDate: new Date(),
				endDate: new Date(new Date().setMonth(new Date().getMonth() + 3))
			}
		});

		// Create a test assignment
		testAssignment = await prisma.assignment.create({
			data: {
				classId: testClass.classId,
				title: "Test Assignment",
				description: "Test Assignment Description",
				dueDate: new Date(new Date().setDate(new Date().getDate() + 7))
			}
		});

		// Create a test submission
		testSubmission = await prisma.submission.create({
			data: {
				assignmentId: testAssignment.assignmentId,
				submitterId: testStudent.userId,
				submissionFilePath: "test/path/to/file.pdf"
			}
		});

		// Login and get cookies
		const studentLogin = await request(API_URL).post("/auth/login").send({
			email: "student@example.com",
			password: "password123"
		});
		studentCookie = studentLogin.headers["set-cookie"];

		const instructorLogin = await request(API_URL).post("/auth/login").send({
			email: "instructor@example.com",
			password: "password123"
		});
		instructorCookie = instructorLogin.headers["set-cookie"];

		expect(studentCookie).toBeTruthy();
		expect(instructorCookie).toBeTruthy();
	});

	describe("GET /submit", () => {
		it("should return a success message", async () => {
			const res = await request(API_URL).get("/submit");
			expect(res.statusCode).toBe(200);
			expect(res.text).toBe("Submit route is working!");
		});
	});

	describe("POST /submit/studentSubmissions", () => {
		it("should get all submissions for a student", async () => {
			const res = await request(API_URL)
				.post("/submit/studentSubmissions")
				.set("Cookie", studentCookie);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("POST /submit/studentSubmissionsForAssignment", () => {
		it("should get all submissions for a student for a specific assignment", async () => {
			const res = await request(API_URL)
				.post("/submit/studentSubmissionsForAssignment")
				.set("Cookie", studentCookie)
				.send({ assignmentId: testAssignment.assignmentId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("POST /submit/submissionsForAssignment", () => {
		it("should get all submissions for a specific assignment", async () => {
			const res = await request(API_URL)
				.post("/submit/submissionsForAssignment")
				.set("Cookie", instructorCookie)
				.send({ assignmentId: testAssignment.assignmentId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("POST /submit/createSubmission", () => {
		it("should create a new submission", async () => {
			const file = Buffer.from("test file content");
			const res = await request(API_URL)
				.post("/submit/createSubmission")
				.set("Cookie", studentCookie)
				.field("studentId", testStudent.userId)
				.field("assignmentId", testAssignment.assignmentId)
				.attach("file", file, "test.pdf");

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe("Submission successfully created");
			expect(res.body.data).toBeTruthy();
		});
	});

	describe("PUT /submit/updateSubmission", () => {
		it("should update a submission", async () => {
			const updateData = {
				submissionId: testSubmission.submissionId,
				submission: { submissionComment: "Updated comment" }
			};

			const res = await request(API_URL)
				.put("/submit/updateSubmission")
				.set("Cookie", studentCookie)
				.send(updateData);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.data).toBeTruthy();
			expect(res.body.data.submissionComment).toBe("Updated comment");
		});
	});

	describe("DELETE /submit/deleteSubmission", () => {
		it("should delete a submission", async () => {
			const res = await request(API_URL)
				.delete("/submit/deleteSubmission")
				.set("Cookie", instructorCookie)
				.send({ submissionId: testSubmission.submissionId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
		});
	});
});
