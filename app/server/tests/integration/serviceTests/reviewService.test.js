import prisma from "../../../prisma/prismaClient.js";
import reviewService from "../../../src/services/reviewService.js";
import apiError from "../../../src/utils/apiError.js";

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("reviewService Integration Tests", () => {
	let testInstructor,
		testStudent1,
		testStudent2,
		testClass,
		testAssignment,
		testSubmission,
		testReview;

	beforeEach(async () => {
		await prisma.$transaction(async (prisma) => {
			// Clean up
			await prisma.criterionGrade.deleteMany();
			await prisma.criterion.deleteMany();
			await prisma.rubric.deleteMany();
			await prisma.review.deleteMany();
			await prisma.submission.deleteMany();
			await prisma.assignment.deleteMany();
			await prisma.class.deleteMany();
			await prisma.user.deleteMany();

			// Create test users
			testInstructor = await prisma.user.create({
				data: {
					email: "instructor@example.com",
					password: "password123",
					firstname: "Test",
					lastname: "Instructor",
					role: "INSTRUCTOR"
				}
			});

			testStudent1 = await prisma.user.create({
				data: {
					email: "student1@example.com",
					password: "password123",
					firstname: "Test",
					lastname: "Student1",
					role: "STUDENT"
				}
			});

			testStudent2 = await prisma.user.create({
				data: {
					email: "student2@example.com",
					password: "password123",
					firstname: "Test",
					lastname: "Student2",
					role: "STUDENT"
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

			// Create test assignment
			testAssignment = await prisma.assignment.create({
				data: {
					title: "Test Assignment",
					description: "Test Description",
					dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
					maxSubmissions: 1,
					classId: testClass.classId
				}
			});

			// Create test submission
			testSubmission = await prisma.submission.create({
				data: {
					assignmentId: testAssignment.assignmentId,
					submitterId: testStudent1.userId
				}
			});

			// Create test review
			testReview = await prisma.review.create({
				data: {
					submissionId: testSubmission.submissionId,
					reviewerId: testInstructor.userId,
					revieweeId: testStudent1.userId,
					reviewGrade: 85,
					isPeerReview: false
				}
			});
		});
	});

	describe("getReviewById", () => {
		it("should retrieve a review by its ID", async () => {
			const review = await reviewService.getReviewById(testReview.reviewId);
			expect(review).toBeTruthy();
			expect(review.reviewId).toBe(testReview.reviewId);
		});

		it("should throw an error if the review is not found", async () => {
			await expect(
				reviewService.getReviewById("non-existent-id")
			).rejects.toThrow("Review not found");
		});
	});

	describe("getPeerReviews", () => {
		it("should retrieve peer reviews for a submission", async () => {
			const peerReview = await prisma.review.create({
				data: {
					submissionId: testSubmission.submissionId,
					reviewerId: testStudent2.userId,
					revieweeId: testStudent1.userId,
					reviewGrade: 80,
					isPeerReview: true
				}
			});

			const peerReviews = await reviewService.getPeerReviews(
				testSubmission.submissionId
			);
			expect(peerReviews).toHaveLength(1);
			expect(peerReviews[0].reviewId).toBe(peerReview.reviewId);
		});
	});

	describe("getInstructorReview", () => {
		it("should retrieve the instructor review for a submission", async () => {
			const instructorReview = await reviewService.getInstructorReview(
				testSubmission.submissionId
			);
			expect(instructorReview).toBeTruthy();
			expect(instructorReview.reviewerId).toBe(testInstructor.userId);
		});
	});

	describe("createReview", () => {
		let testCriterion;

		beforeEach(async () => {
			// Create a test rubric
			const testRubric = await prisma.rubric.create({
				data: {
					creatorId: testInstructor.userId,
					classId: testClass.classId,
					title: "Test Rubric",
					description: "Test Rubric Description",
					totalMarks: 100
				}
			});

			// Create a test criterion
			testCriterion = await prisma.criterion.create({
				data: {
					rubricId: testRubric.rubricId,
					title: "Test Criterion",
					maxMark: 10,
					minMark: 0
				}
			});
		});

		it("should create a new review", async () => {
			const newReview = {
				submissionId: testSubmission.submissionId,
				revieweeId: testStudent1.userId,
				reviewGrade: 90,
				isPeerReview: true,
				criterionGrades: [
					{
						criterionId: testCriterion.criterionId,
						grade: 5,
						comment: "Good job"
					}
				]
			};

			const createdReview = await reviewService.createReview(
				testStudent2.userId,
				newReview
			);
			expect(createdReview).toBeTruthy();
			expect(createdReview.reviewGrade).toBe(90);
			expect(createdReview.criterionGrades).toHaveLength(1);
		});
	});

	describe("updateReview", () => {
		let testCriterion;

		beforeEach(async () => {
			// Create a test rubric
			const testRubric = await prisma.rubric.create({
				data: {
					creatorId: testInstructor.userId,
					classId: testClass.classId,
					title: "Test Rubric",
					description: "Test Rubric Description",
					totalMarks: 100
				}
			});

			// Create a test criterion
			testCriterion = await prisma.criterion.create({
				data: {
					rubricId: testRubric.rubricId,
					title: "Test Criterion",
					maxMark: 10,
					minMark: 0
				}
			});
		});

		it("should update an existing review", async () => {
			const updateData = {
				reviewGrade: 95,
				criterionGrades: [
					{
						criterionId: testCriterion.criterionId,
						grade: 5,
						comment: "Excellent work"
					}
				]
			};

			const updatedReview = await reviewService.updateReview(
				testReview.reviewId,
				updateData
			);
			expect(updatedReview).toBeTruthy();
			expect(updatedReview.reviewGrade).toBe(95);
		});
	});

	describe("deleteReview", () => {
		it("should delete a review", async () => {
			await reviewService.deleteReview(testReview.reviewId);
			const deletedReview = await prisma.review.findUnique({
				where: { reviewId: testReview.reviewId }
			});
			expect(deletedReview).toBeNull();
		});
	});

	describe("assignRandomPeerReviews", () => {
		it("should assign random peer reviews for an assignment", async () => {
			// Create more submissions for this test
			await prisma.submission.createMany({
				data: [
					{
						assignmentId: testAssignment.assignmentId,
						submitterId: testStudent2.userId
					},
					{
						assignmentId: testAssignment.assignmentId,
						submitterId: testInstructor.userId
					}
				]
			});

			const result = await reviewService.assignRandomPeerReviews(
				testAssignment.assignmentId,
				1
			);
			expect(result.assignedReviews).toBeGreaterThan(0);
		});

		it("should throw an error if there are not enough submissions", async () => {
			await expect(
				reviewService.assignRandomPeerReviews(testAssignment.assignmentId, 2)
			).rejects.toThrow("Not enough submissions to assign peer reviews");
		});
	});

	describe("getAllReviews", () => {
		it("should retrieve all reviews", async () => {
			const allReviews = await reviewService.getAllReviews();
			expect(allReviews.length).toBeGreaterThan(0);
			expect(allReviews[0]).toHaveProperty("reviewId");
		});
	});

	describe("getReviewsForAssignment", () => {
		it("should retrieve all reviews for an assignment", async () => {
			const assignmentReviews = await reviewService.getReviewsForAssignment(
				testAssignment.assignmentId
			);
			expect(assignmentReviews.length).toBeGreaterThan(0);
			expect(assignmentReviews[0].submission.assignmentId).toBe(
				testAssignment.assignmentId
			);
		});
	});

	describe("getReviewDetails", () => {
		it("should retrieve the details of a review", async () => {
			const reviewDetails = await reviewService.getReviewDetails(
				testReview.reviewId
			);
			expect(reviewDetails).toBeTruthy();
			expect(reviewDetails.reviewId).toBe(testReview.reviewId);
		});

		it("should throw an error if the review is not found", async () => {
			await expect(
				reviewService.getReviewDetails("non-existent-id")
			).rejects.toThrow("Review not found");
		});
	});

	describe("getReviewsAssigned", () => {
		it("should retrieve all reviews assigned to a user", async () => {
			const assignedReviews = await reviewService.getReviewsAssigned(
				testInstructor.userId
			);
			expect(assignedReviews.length).toBeGreaterThan(0);
			expect(assignedReviews[0].reviewerId).toBe(testInstructor.userId);
		});
	});

	describe("getReviewsReceived", () => {
		it("should retrieve all reviews received by a user", async () => {
			const receivedReviews = await reviewService.getReviewsReceived(
				testStudent1.userId
			);
			expect(receivedReviews.length).toBeGreaterThan(0);
			expect(receivedReviews[0].revieweeId).toBe(testStudent1.userId);
		});
	});

	describe("assignRandomPeerReviews", () => {
		it("should assign random peer reviews for an assignment", async () => {
			// Create more submissions for this test
			await prisma.submission.createMany({
				data: [
					{
						assignmentId: testAssignment.assignmentId,
						submitterId: testStudent2.userId
					},
					{
						assignmentId: testAssignment.assignmentId,
						submitterId: testInstructor.userId
					}
				]
			});

			const result = await reviewService.assignRandomPeerReviews(
				testAssignment.assignmentId,
				1
			);
			expect(result.assignedReviews).toBeGreaterThan(0);
		});

		it("should throw an error if there are not enough submissions", async () => {
			await expect(
				reviewService.assignRandomPeerReviews(testAssignment.assignmentId, 2)
			).rejects.toThrow("Not enough submissions to assign peer reviews");
		});

		it("should throw an error if reviews per student is less than 1", async () => {
			await expect(
				reviewService.assignRandomPeerReviews(testAssignment.assignmentId, 0)
			).rejects.toThrow(
				"Reviews per student must be greater than or equal to 1"
			);
		});
	});
});
