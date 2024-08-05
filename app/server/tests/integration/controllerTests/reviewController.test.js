import request from "supertest";
import prisma from "../../../prisma/prismaClient.js";
import bcrypt from "bcrypt";

const API_URL = "http://peergrade-server-test:5001";

const hashPassword = async (password) => {
	const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);
	return await bcrypt.hash(password, SALT_ROUNDS);
};

describe("Review Controller", () => {
	let testStudent,
		testInstructor,
		testClass,
		testAssignment,
		testSubmission,
		testReview;
	let studentCookie, instructorCookie;

	beforeAll(async () => {
		await prisma.$connect();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	beforeEach(async () => {
		await prisma.review.deleteMany();
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

		const testRubric = await prisma.rubric.create({
			data: {
				creatorId: testInstructor.userId,
				classId: testClass.classId,
				title: "Test Rubric",
				description: "A test rubric for the assignment",
				totalMarks: 100
			}
		});

		// Create a test criterion
		const testCriterion = await prisma.criterion.create({
			data: {
				rubricId: testRubric.rubricId,
				title: "Test Criterion",
				maxMark: 100,
				minMark: 0
			}
		});

		// Create a test criterion rating
		await prisma.criterionRating.create({
			data: {
				criterionId: testCriterion.criterionId,
				description: "Excellent work",
				points: 100
			}
		});

		// Create a test assignment
		testAssignment = await prisma.assignment.create({
			data: {
				classId: testClass.classId,
				rubricId: testRubric.rubricId,
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

		// Create a test review
		testReview = await prisma.review.create({
			data: {
				submissionId: testSubmission.submissionId,
				reviewerId: testInstructor.userId,
				revieweeId: testStudent.userId,
				isPeerReview: false,
				reviewGrade: 80
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

	describe("POST /review/studentReview", () => {
		it("should get peer reviews for a student", async () => {
			const res = await request(API_URL)
				.post("/review/studentReview")
				.set("Cookie", studentCookie)
				.send({ submissionId: testSubmission.submissionId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("POST /review/instructorReview", () => {
		it("should get instructor review for a student", async () => {
			const res = await request(API_URL)
				.post("/review/instructorReview")
				.set("Cookie", studentCookie)
				.send({ submissionId: testSubmission.submissionId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.data).toBeTruthy();
		});
	});

	describe("GET /review/received", () => {
		it("should get reviews received by a user", async () => {
			const res = await request(API_URL)
				.get("/review/received")
				.set("Cookie", studentCookie);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("GET /review/assigned", () => {
		it("should get reviews assigned to a user", async () => {
			const res = await request(API_URL)
				.get("/review/assigned")
				.set("Cookie", instructorCookie);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("GET /review/assignment/:assignmentId", () => {
		it("should get reviews for an assignment", async () => {
			const res = await request(API_URL)
				.get(`/review/assignment/${testAssignment.assignmentId}`)
				.set("Cookie", instructorCookie);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("POST /review/allReviews", () => {
		it("should get all reviews for a submission", async () => {
			const res = await request(API_URL)
				.post("/review/allReviews")
				.set("Cookie", instructorCookie)
				.send({ submissionId: testSubmission.submissionId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("POST /review/reviewId", () => {
		it("should get a review by its ID", async () => {
			const res = await request(API_URL)
				.post("/review/reviewId")
				.set("Cookie", instructorCookie)
				.send({ reviewId: testReview.reviewId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.data).toBeTruthy();
			expect(res.body.data.reviewId).toBe(testReview.reviewId);
		});
	});

	describe("POST /review/createReview", () => {
		it("should create a new review", async () => {
			const testCriterion = await prisma.criterion.findFirst();

			const newReviewData = {
				userId: testInstructor.userId,
				review: {
					submissionId: testSubmission.submissionId,
					reviewGrade: 100,
					revieweeId: testStudent.userId,
					isPeerReview: false,
					isGroup: false,
					criterionGrades: [
						{
							criterionId: testCriterion.criterionId,
							grade: 100,
							comment: "Good work"
						}
					]
				}
			};

			const res = await request(API_URL)
				.post("/review/createReview")
				.set("Cookie", instructorCookie)
				.send(newReviewData);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.data).toBeTruthy();
			expect(res.body.data.reviewGrade).toBe(100);
			expect(res.body.data.criterionGrades).toHaveLength(1);
			expect(res.body.data.criterionGrades[0].grade).toBe(100);
		});
	});

	describe("POST /review/assignPeerReviews", () => {
		it("should assign peer reviews to students", async () => {
			// Create additional students and submissions
			const additionalStudents = await Promise.all([
				prisma.user.create({
					data: {
						email: "student2@example.com",
						password: await hashPassword("password123"),
						firstname: "Test2",
						lastname: "Student2",
						role: "STUDENT",
						isEmailVerified: true,
						isRoleActivated: true
					}
				}),
				prisma.user.create({
					data: {
						email: "student3@example.com",
						password: await hashPassword("password123"),
						firstname: "Test3",
						lastname: "Student3",
						role: "STUDENT",
						isEmailVerified: true,
						isRoleActivated: true
					}
				})
			]);

			// Create submissions for each student
			await Promise.all([
				prisma.submission.create({
					data: {
						assignmentId: testAssignment.assignmentId,
						submitterId: additionalStudents[0].userId,
						submissionFilePath: "test/path/to/file2.pdf"
					}
				}),
				prisma.submission.create({
					data: {
						assignmentId: testAssignment.assignmentId,
						submitterId: additionalStudents[1].userId,
						submissionFilePath: "test/path/to/file3.pdf"
					}
				})
			]);

			const res = await request(API_URL)
				.post("/review/assignPeerReviews")
				.set("Cookie", instructorCookie)
				.send({
					assignmentId: testAssignment.assignmentId,
					reviewsPerStudent: 1
				});

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toContain("Peer reviews assigned successfully");
		});
	});

	describe("GET /review/reviewDetails/:reviewId", () => {
		it("should get details of a review", async () => {
			const res = await request(API_URL)
				.get(`/review/reviewDetails/${testReview.reviewId}`)
				.set("Cookie", instructorCookie);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.data).toBeTruthy();
			expect(res.body.data.reviewId).toBe(testReview.reviewId);
		});
	});

	describe("PUT /review/updateReview", () => {
		it("should update a review", async () => {
			const updateData = {
				reviewId: testReview.reviewId,
				review: { reviewGrade: 95 }
			};

			const res = await request(API_URL)
				.put("/review/updateReview")
				.set("Cookie", instructorCookie)
				.send(updateData);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.data).toBeTruthy();
			expect(res.body.data.reviewGrade).toBe(95);
		});
	});

	describe("DELETE /review/deleteReview", () => {
		it("should delete a review", async () => {
			const res = await request(API_URL)
				.delete("/review/deleteReview")
				.set("Cookie", instructorCookie)
				.send({ reviewId: testReview.reviewId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
		});
	});
});
