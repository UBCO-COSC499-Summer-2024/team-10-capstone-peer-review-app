import request from "supertest";
import prisma from "../../../prisma/prismaClient.js";
import bcrypt from "bcrypt";

const API_URL = "http://peergrade-server-test:5001";

const hashPassword = async (password) => {
	const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);
	return await bcrypt.hash(password, SALT_ROUNDS);
};

describe("Rubric Controller", () => {
	let testInstructor, testClass, testAssignment, testRubric, testCriterion;
	let instructorCookie;

	beforeAll(async () => {
		await prisma.$connect();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	beforeEach(async () => {
		await prisma.criterionRating.deleteMany();
		await prisma.criterionGrade.deleteMany();
		await prisma.criterion.deleteMany();
		await prisma.rubric.deleteMany();
		await prisma.assignment.deleteMany();
		await prisma.class.deleteMany();
		await prisma.user.deleteMany();

		// Create test instructor
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

		// Create test class
		testClass = await prisma.class.create({
			data: {
				instructorId: testInstructor.userId,
				classname: "Test Class",
				description: "Test Description",
				startDate: new Date(),
				endDate: new Date(new Date().setMonth(new Date().getMonth() + 3))
			}
		});

		// Create test rubric
		testRubric = await prisma.rubric.create({
			data: {
				creatorId: testInstructor.userId,
				classId: testClass.classId,
				title: "Test Rubric",
				description: "Test Rubric Description",
				totalMarks: 100
			}
		});

		// Create test assignment
		testAssignment = await prisma.assignment.create({
			data: {
				classId: testClass.classId,
				rubricId: testRubric.rubricId,
				title: "Test Assignment",
				description: "Test Assignment Description",
				dueDate: new Date(new Date().setDate(new Date().getDate() + 7))
			}
		});

		// Create test criterion
		testCriterion = await prisma.criterion.create({
			data: {
				rubricId: testRubric.rubricId,
				title: "Test Criterion",
				maxMark: 10,
				minMark: 0
			}
		});

		await prisma.criterionRating.create({
			data: {
				criterionId: testCriterion.criterionId,
				description: "Excellent",
				points: 10
			}
		});

		// Login and get cookie
		const instructorLogin = await request(API_URL).post("/auth/login").send({
			email: "instructor@example.com",
			password: "password123"
		});
		instructorCookie = instructorLogin.headers["set-cookie"];

		expect(instructorCookie).toBeTruthy();
	});

	describe("POST /rubric/add-rubrics", () => {
		it("should add a rubric to an assignment", async () => {
			const rubricData = {
				userId: testInstructor.userId,
				assignmentId: testAssignment.assignmentId,
				rubricData: {
					title: "New Rubric",
					description: "New Rubric Description",
					totalMarks: 100,
					classId: testClass.classId,
					criterion: [
						{
							title: "New Criterion",
							minPoints: 0,
							maxPoints: 10,
							criterionRatings: [
								{
									text: "Excellent",
									points: 10
								}
							]
						}
					]
				}
			};

			const res = await request(API_URL)
				.post("/rubric/add-rubrics")
				.set("Cookie", instructorCookie)
				.send(rubricData);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe("Rubric successfully added to assignment");
			expect(res.body.data).toBeTruthy();
		});
	});

	describe("POST /rubric/remove-rubric", () => {
		it("should remove a rubric from an assignment", async () => {
			const res = await request(API_URL)
				.post("/rubric/remove-rubric")
				.set("Cookie", instructorCookie)
				.send({ rubricId: testRubric.rubricId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe(
				"Rubric successfully removed from assignment"
			);
		});
	});

	describe("POST /rubric/update-rubrics", () => {
		it("should update a rubric in an assignment", async () => {
			const updateData = {
				rubricId: testRubric.rubricId,
				updateData: {
					title: "Updated Rubric",
					description: "Updated Rubric Description",
					totalMarks: 150,
					criteria: [
						{
							title: "Updated Criterion",
							minMark: 0,
							maxMark: 15,
							criterionRatings: [
								{
									description: "Excellent",
									points: 15
								}
							]
						}
					]
				}
			};

			const res = await request(API_URL)
				.post("/rubric/update-rubrics")
				.set("Cookie", instructorCookie)
				.send(updateData);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe(
				"Rubric successfully updated in assignment"
			);
			expect(res.body.data).toBeTruthy();
		});
	});

	describe("POST /rubric/get-rubrics", () => {
		it("should get rubrics in an assignment", async () => {
			const res = await request(API_URL)
				.post("/rubric/get-rubrics")
				.set("Cookie", instructorCookie)
				.send({ assignmentId: testAssignment.assignmentId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.data).toBeTruthy();
		});
	});

	describe("POST /rubric/get-all-rubrics", () => {
		it("should get all rubrics", async () => {
			const res = await request(API_URL)
				.post("/rubric/get-all-rubrics")
				.set("Cookie", instructorCookie);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("POST /rubric/get-rubrics-in-class", () => {
		it("should get all rubrics in a class", async () => {
			const res = await request(API_URL)
				.post("/rubric/get-rubrics-in-class")
				.set("Cookie", instructorCookie)
				.send({ classId: testClass.classId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("POST /rubric/get-rubric-by-id", () => {
		it("should get a rubric by its ID", async () => {
			const res = await request(API_URL)
				.post("/rubric/get-rubric-by-id")
				.set("Cookie", instructorCookie)
				.send({ rubricId: testRubric.rubricId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.data).toBeTruthy();
			expect(res.body.data.rubricId).toBe(testRubric.rubricId);
		});
	});

	describe("POST /rubric/link-rubric-to-assignment", () => {
		it("should link a rubric to assignments", async () => {
			const res = await request(API_URL)
				.post("/rubric/link-rubric-to-assignment")
				.set("Cookie", instructorCookie)
				.send({
					rubricId: testRubric.rubricId,
					assignmentIds: [testAssignment.assignmentId]
				});

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe(
				"Rubric successfully linked to assignments"
			);
			expect(res.body.data).toBeTruthy();
		});
	});

	describe("POST /rubric/add-criterion", () => {
		it("should add a criterion to a rubric", async () => {
			const criterionData = {
				rubricId: testRubric.rubricId,
				criterionData: {
					title: "New Criterion",
					maxMark: 20,
					minMark: 0
				}
			};

			const res = await request(API_URL)
				.post("/rubric/add-criterion")
				.set("Cookie", instructorCookie)
				.send(criterionData);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe("Criterion successfully added to rubric");
			expect(res.body.data).toBeTruthy();
		});
	});

	describe("POST /rubric/remove-criterion", () => {
		it("should remove a criterion from a rubric", async () => {
			const res = await request(API_URL)
				.post("/rubric/remove-criterion")
				.set("Cookie", instructorCookie)
				.send({ criterionId: testCriterion.criterionId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe(
				"Criterion successfully removed from rubric"
			);
		});
	});

	describe("POST /rubric/update-criterion", () => {
		it("should update a criterion in a rubric", async () => {
			const updateData = {
				criterionId: testCriterion.criterionId,
				updateData: {
					title: "Updated Criterion",
					maxMark: 15,
					minMark: 5
				}
			};

			const res = await request(API_URL)
				.post("/rubric/update-criterion")
				.set("Cookie", instructorCookie)
				.send(updateData);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe("Criterion successfully updated in rubric");
			expect(res.body.data).toBeTruthy();
		});
	});

	describe("POST /rubric/get-criterion", () => {
		it("should get a criterion in a rubric", async () => {
			const res = await request(API_URL)
				.post("/rubric/get-criterion")
				.set("Cookie", instructorCookie)
				.send({ rubricId: testRubric.rubricId });

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(Array.isArray(res.body.data)).toBeTruthy();
		});
	});

	describe("POST /rubric/add-criterion-rating", () => {
		it("should add a rating to a criterion", async () => {
			const ratingData = {
				criterionId: testCriterion.criterionId,
				ratingData: {
					description: "Good",
					points: 8
				}
			};

			const res = await request(API_URL)
				.post("/rubric/add-criterion-rating")
				.set("Cookie", instructorCookie)
				.send(ratingData);

			expect(res.statusCode).toBe(201);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toBe("Criterion rating successfully added");
			expect(res.body.data).toBeTruthy();
		});
	});
});
