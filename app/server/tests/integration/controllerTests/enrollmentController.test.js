import request from "supertest";
import prisma from "../../../prisma/prismaClient.js";
import bcrypt from "bcrypt";

const API_URL = "http://peergrade-server-test:5001";

const hashPassword = async (password) => {
	const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);
	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
	return hashedPassword;
};

describe("Enroll Request Controller", () => {
	let testStudent, testInstructor, testClass;
	let studentCookie, instructorCookie;

	beforeAll(async () => {
		await prisma.$connect();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	beforeEach(async () => {
		await prisma.enrollRequest.deleteMany();
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

	describe("POST /api/enroll-requests", () => {
		it("should create a new enroll request", async () => {
			const enrollRequestData = {
				classId: testClass.classId,
				senderMessage: "Please enroll me in this class"
			};

			const res = await request(API_URL)
				.post("/enroll-requests")
				.set("Cookie", studentCookie)
				.send(enrollRequestData);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe("Enrollment request created");
			expect(res.body.data).toHaveProperty("enrollRequestId");

			// Check Database for enroll request
			const enrollRequest = await prisma.enrollRequest.findUnique({
				where: { enrollRequestId: res.body.data.enrollRequestId }
			});

			expect(enrollRequest).toBeTruthy();
			expect(enrollRequest.userId).toBe(testStudent.userId);
			expect(enrollRequest.classId).toBe(testClass.classId);
			expect(enrollRequest.senderMessage).toBe(enrollRequestData.senderMessage);
		});

		it("should not create a duplicate enroll request", async () => {
			const enrollRequestData = {
				classId: testClass.classId,
				senderMessage: "Please enroll me in this class"
			};

			// Create initial request
			await request(API_URL)
				.post("/enroll-requests")
				.set("Cookie", studentCookie)
				.send(enrollRequestData);

			// Attempt to create duplicate request
			const res = await request(API_URL)
				.post("/enroll-requests")
				.set("Cookie", studentCookie)
				.send(enrollRequestData);

			expect(res.statusCode).toBe(400);
			expect(res.body.message).toBe(
				"An enrollment request for this class already exists"
			);
		});

		describe("GET /api/enroll-requests", () => {
			it("should get all enroll requests for an instructor", async () => {
				// Create a test enroll request
				await prisma.enrollRequest.create({
					data: {
						userId: testStudent.userId,
						classId: testClass.classId,
						senderMessage: "Request 1"
					}
				});

				const res = await request(API_URL)
					.get("/enroll-requests")
					.set("Cookie", instructorCookie);

				expect(res.statusCode).toBe(200);
				expect(res.body.status).toBe("Success");
				expect(res.body.message).toBe("Enrollment requests retrieved");
				expect(res.body.data).toHaveLength(1);
			});

			it("should return an empty array if no requests exist", async () => {
				const res = await request(API_URL)
					.get("/enroll-requests")
					.set("Cookie", instructorCookie);

				expect(res.statusCode).toBe(200);
				expect(res.body.status).toBe("Success");
				expect(res.body.message).toBe("Enrollment requests retrieved");
				expect(res.body.data).toHaveLength(0);
			});
		});

		describe("GET /api/enroll-requests/class/:classId", () => {
			it("should get enroll requests for a specific class", async () => {
				await prisma.enrollRequest.create({
					data: {
						userId: testStudent.userId,
						classId: testClass.classId,
						senderMessage: "Class specific request"
					}
				});

				const res = await request(API_URL)
					.get(`/enroll-requests/class/${testClass.classId}`)
					.set("Cookie", instructorCookie);

				expect(res.statusCode).toBe(200);
				expect(res.body.status).toBe("Success");
				expect(res.body.message).toBe(
					"Enrollment requests for class retrieved"
				);
				expect(res.body.data).toHaveLength(1);
				expect(res.body.data[0].classId).toBe(testClass.classId);
			});

			it("should return an empty array if no requests exist for the class", async () => {
				const res = await request(API_URL)
					.get(`/enroll-requests/class/${testClass.classId}`)
					.set("Cookie", instructorCookie);

				expect(res.statusCode).toBe(200);
				expect(res.body.status).toBe("Success");
				expect(res.body.message).toBe(
					"Enrollment requests for class retrieved"
				);
				expect(res.body.data).toHaveLength(0);
			});
		});

		describe("GET /api/enroll-requests/user", () => {
			it("should get enroll requests for the current user", async () => {
				await prisma.enrollRequest.create({
					data: {
						userId: testStudent.userId,
						classId: testClass.classId,
						senderMessage: "User specific request"
					}
				});

				const res = await request(API_URL)
					.get("/enroll-requests/user")
					.set("Cookie", studentCookie);

				expect(res.statusCode).toBe(200);
				expect(res.body.status).toBe("Success");
				expect(res.body.message).toBe("Enrollment requests for user retrieved");
				expect(res.body.data).toHaveLength(1);
				expect(res.body.data[0].userId).toBe(testStudent.userId);
			});

			it("should return an empty array if no requests exist for the user", async () => {
				const res = await request(API_URL)
					.get("/enroll-requests/user")
					.set("Cookie", studentCookie);

				expect(res.statusCode).toBe(200);
				expect(res.body.status).toBe("Success");
				expect(res.body.message).toBe("Enrollment requests for user retrieved");
				expect(res.body.data).toHaveLength(0);
			});
		});

		describe("PUT /api/enroll-requests/:enrollRequestId", () => {
			it("should update the status of an enroll request", async () => {
				const enrollRequest = await prisma.enrollRequest.create({
					data: {
						userId: testStudent.userId,
						classId: testClass.classId,
						senderMessage: "Update test request"
					}
				});

				const updateData = {
					status: "APPROVED",
					receiverMessage: "You're approved!"
				};

				const res = await request(API_URL)
					.put(`/enroll-requests/${enrollRequest.enrollRequestId}`)
					.set("Cookie", instructorCookie)
					.send(updateData);

				expect(res.statusCode).toBe(200);
				expect(res.body.status).toBe("Success");
				expect(res.body.message).toBe("Enrollment request status updated");
				expect(res.body.data.status).toBe(updateData.status);
				expect(res.body.data.recipientMessage).toBe(updateData.receiverMessage);
			});

			it("should not update a non-existent enroll request", async () => {
				const nonExistentId = "non-existent-id";
				const updateData = {
					status: "APPROVED",
					receiverMessage: "You're approved!"
				};

				const res = await request(API_URL)
					.put(`/enroll-requests/${nonExistentId}`)
					.set("Cookie", instructorCookie)
					.send(updateData);

				expect(res.statusCode).toBe(404);
				expect(res.body.message).toBe("Enrollment request not found");
			});
		});

		describe("DELETE /api/enroll-requests/:enrollRequestId", () => {
			it("should delete an enroll request", async () => {
				const enrollRequest = await prisma.enrollRequest.create({
					data: {
						userId: testStudent.userId,
						classId: testClass.classId,
						senderMessage: "Delete test request"
					}
				});

				const res = await request(API_URL)
					.delete(`/enroll-requests/${enrollRequest.enrollRequestId}`)
					.set("Cookie", instructorCookie);

				expect(res.statusCode).toBe(200);
				expect(res.body.status).toBe("Success");
				expect(res.body.message).toBe("Enrollment request deleted");

				// Check that the request has been deleted from the database
				const deletedRequest = await prisma.enrollRequest.findUnique({
					where: { enrollRequestId: enrollRequest.enrollRequestId }
				});
				expect(deletedRequest).toBeNull();
			});

			it("should return 404 when trying to delete a non-existent enroll request", async () => {
				const nonExistentId = "non-existent-id";

				const res = await request(API_URL)
					.delete(`/enroll-requests/${nonExistentId}`)
					.set("Cookie", instructorCookie);

				expect(res.statusCode).toBe(404);
				expect(res.body.message).toBe("Enrollment request not found");
			});
		});
	});
});
