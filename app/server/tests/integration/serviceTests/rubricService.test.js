import prisma from "../../../prisma/prismaClient.js";
import rubricService from "../../../src/services/rubricService.js";
import apiError from "../../../src/utils/apiError.js";

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("rubricService Integration Tests", () => {
	let testInstructor, testClass, testAssignment, testRubric;

	beforeEach(async () => {
		await prisma.$transaction(async (prisma) => {
			// Clean up
			await prisma.criterionRating.deleteMany();
			await prisma.criterion.deleteMany();
			await prisma.rubric.deleteMany();
			await prisma.assignment.deleteMany();
			await prisma.class.deleteMany();
			await prisma.user.deleteMany();

			// Create test instructor
			testInstructor = await prisma.user.create({
				data: {
					email: "instructor@example.com",
					password: "password123",
					firstname: "Test",
					lastname: "Instructor",
					role: "INSTRUCTOR"
				}
			});

			// Create test class
			testClass = await prisma.class.create({
				data: {
					classname: "Test Class",
					description: "Test Description",
					startDate: new Date(),
					endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
					instructorId: testInstructor.userId,
					classSize: 30
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

			// Create test rubric
			testRubric = await prisma.rubric.create({
				data: {
					title: "Test Rubric",
					description: "Test Rubric Description",
					totalMarks: 100,
					creatorId: testInstructor.userId,
					classId: testClass.classId,
					criteria: {
						create: [
							{
								title: "Criterion 1",
								maxMark: 50,
								minMark: 0,
								criterionRatings: {
									create: [
										{ description: "Excellent", points: 50 },
										{ description: "Good", points: 40 },
										{ description: "Fair", points: 30 },
										{ description: "Poor", points: 20 }
									]
								}
							},
							{
								title: "Criterion 2",
								maxMark: 50,
								minMark: 0,
								criterionRatings: {
									create: [
										{ description: "Excellent", points: 50 },
										{ description: "Good", points: 40 },
										{ description: "Fair", points: 30 },
										{ description: "Poor", points: 20 }
									]
								}
							}
						]
					}
				}
			});
		});
	});

	describe("createRubricsForAssignment", () => {
		it("should create a rubric for an assignment", async () => {
			const rubricData = {
				title: "New Rubric",
				description: "New Rubric Description",
				totalMarks: 100,
				classId: testClass.classId,
				criterion: [
					{
						title: "New Criterion",
						minPoints: 0,
						maxPoints: 100,
						criterionRatings: [
							{ text: "Excellent", points: 100 },
							{ text: "Good", points: 75 },
							{ text: "Fair", points: 50 },
							{ text: "Poor", points: 25 }
						]
					}
				]
			};

			const newRubric = await rubricService.createRubricsForAssignment(
				testInstructor.userId,
				testAssignment.assignmentId,
				rubricData
			);

			expect(newRubric).toHaveProperty("rubricId");
			expect(newRubric.title).toBe(rubricData.title);
			expect(newRubric.criteria).toHaveLength(1);
			expect(newRubric.criteria[0].criterionRatings).toHaveLength(4);
		});

		it("should throw an error if assignment is not found", async () => {
			await expect(
				rubricService.createRubricsForAssignment(
					testInstructor.userId,
					"non-existent-id",
					{}
				)
			).rejects.toThrow("Assignment not found");
		});
	});

	describe("getRubricsForAssignment", () => {
		it("should retrieve rubrics for an assignment", async () => {
			await prisma.assignment.update({
				where: { assignmentId: testAssignment.assignmentId },
				data: { rubricId: testRubric.rubricId }
			});

			const rubric = await rubricService.getRubricsForAssignment(
				testAssignment.assignmentId
			);

			expect(rubric).toHaveProperty("rubricId", testRubric.rubricId);
			expect(rubric.criteria).toHaveLength(2);
		});

		it("should throw an error if assignment is not found", async () => {
			await expect(
				rubricService.getRubricsForAssignment("non-existent-id")
			).rejects.toThrow("Assignment not found");
		});
	});

	describe("getAllRubrics", () => {
		it("should retrieve all rubrics", async () => {
			const rubrics = await rubricService.getAllRubrics();
			expect(rubrics).toHaveLength(1);
			expect(rubrics[0]).toHaveProperty("rubricId", testRubric.rubricId);
		});
	});

	describe("getAllRubricsInClass", () => {
		it("should retrieve all rubrics in a class", async () => {
			const rubrics = await rubricService.getAllRubricsInClass(
				testClass.classId
			);
			expect(rubrics).toHaveLength(1);
			expect(rubrics[0]).toHaveProperty("rubricId", testRubric.rubricId);
		});
	});

	describe("getRubricById", () => {
		it("should retrieve a rubric by its ID", async () => {
			const rubric = await rubricService.getRubricById(testRubric.rubricId);
			expect(rubric).toHaveProperty("rubricId", testRubric.rubricId);
			expect(rubric.criteria).toHaveLength(2);
		});

		it("should throw an error if rubric is not found", async () => {
			await expect(
				rubricService.getRubricById("non-existent-id")
			).rejects.toThrow("Rubric not found");
		});
	});

	describe("updateRubricsForAssignment", () => {
		it("should update a rubric for an assignment", async () => {
			const updateData = {
				title: "Updated Rubric",
				description: "Updated Description",
				totalMarks: 150,
				criteria: [
					{
						title: "Updated Criterion",
						minMark: 0,
						maxMark: 150,
						criterionRatings: [
							{ description: "Excellent", points: 150 },
							{ description: "Good", points: 100 },
							{ description: "Fair", points: 50 }
						]
					}
				]
			};

			const updatedRubric = await rubricService.updateRubricsForAssignment(
				testRubric.rubricId,
				updateData
			);

			expect(updatedRubric).toHaveProperty("rubricId", testRubric.rubricId);
			expect(updatedRubric.title).toBe(updateData.title);
			expect(updatedRubric.criteria).toHaveLength(1);
			expect(updatedRubric.criteria[0].criterionRatings).toHaveLength(3);
		});

		it("should throw an error if rubric is not found", async () => {
			await expect(
				rubricService.updateRubricsForAssignment("non-existent-id", {})
			).rejects.toThrow("Rubric not found");
		});
	});

	describe("deleteRubricsFromAssignment", () => {
		it("should delete a rubric from an assignment", async () => {
			const result = await rubricService.deleteRubricsFromAssignment(
				testRubric.rubricId
			);
			expect(result).toHaveProperty(
				"message",
				"Rubric and related data successfully deleted"
			);

			const deletedRubric = await prisma.rubric.findUnique({
				where: { rubricId: testRubric.rubricId }
			});
			expect(deletedRubric).toBeNull();
		});

		it("should throw an error if rubric is not found", async () => {
			await expect(
				rubricService.deleteRubricsFromAssignment("non-existent-id")
			).rejects.toThrow("Rubric not found");
		});
	});

	describe("createCriterionForRubric", () => {
		it("should create a criterion for a rubric", async () => {
			// Create a new rubric for this test
			const newRubric = await prisma.rubric.create({
				data: {
					title: "New Test Rubric",
					description: "New Test Rubric Description",
					totalMarks: 100, // Set total marks to match the criterion's max mark
					creatorId: testInstructor.userId,
					classId: testClass.classId
				}
			});

			const criterionData = {
				title: "New Criterion",
				maxMark: 50,
				minMark: 0
			};

			const newCriterion = await rubricService.createCriterionForRubric(
				newRubric.rubricId,
				criterionData
			);

			expect(newCriterion).toHaveProperty("criterionId");
			expect(newCriterion.title).toBe(criterionData.title);
			expect(newCriterion.maxMark).toBe(criterionData.maxMark);
			expect(newCriterion.minMark).toBe(criterionData.minMark);

			// Verify that the criterion was added to the rubric
			const updatedRubric = await prisma.rubric.findUnique({
				where: { rubricId: newRubric.rubricId },
				include: { criteria: true }
			});

			expect(updatedRubric.criteria).toHaveLength(1);
			expect(updatedRubric.criteria[0].criterionId).toBe(
				newCriterion.criterionId
			);
			expect(updatedRubric.totalMarks).toBe(newRubric.totalMarks);
		});

		it("should throw an error if rubric is not found", async () => {
			await expect(
				rubricService.createCriterionForRubric("non-existent-id", {})
			).rejects.toThrow("Rubric not found");
		});

		it("should throw an error if criterion max mark exceeds rubric total marks", async () => {
			const newRubric = await prisma.rubric.create({
				data: {
					title: "Test Rubric for Max Mark",
					description: "Test Rubric Description",
					totalMarks: 50,
					creatorId: testInstructor.userId,
					classId: testClass.classId
				}
			});

			const criterionData = {
				title: "Exceeding Criterion",
				maxMark: 100, // This exceeds the rubric's total marks
				minMark: 0
			};

			await expect(
				rubricService.createCriterionForRubric(
					newRubric.rubricId,
					criterionData
				)
			).rejects.toThrow("Criterion maxMark and minMark are not set properly");
		});
	});

	describe("getCriterionForRubric", () => {
		it("should retrieve criteria for a rubric", async () => {
			const criteria = await rubricService.getCriterionForRubric(
				testRubric.rubricId
			);
			expect(criteria).toHaveLength(2);
		});

		it("should throw an error if rubric is not found", async () => {
			await expect(
				rubricService.getCriterionForRubric("non-existent-id")
			).rejects.toThrow("Rubric not found");
		});
	});

	describe("updateCriterionForRubric", () => {
		it("should update a criterion for a rubric", async () => {
			const criterion = await prisma.criterion.findFirst({
				where: { rubricId: testRubric.rubricId }
			});

			const updateData = {
				title: "Updated Criterion",
				maxMark: 50, // Ensure this is less than or equal to the rubric's totalMarks
				minMark: 0
			};

			const updatedCriterion = await rubricService.updateCriterionForRubric(
				criterion.criterionId,
				updateData
			);

			expect(updatedCriterion).toHaveProperty(
				"criterionId",
				criterion.criterionId
			);
			expect(updatedCriterion.title).toBe(updateData.title);
		});

		it("should throw an error if criterion is not found", async () => {
			await expect(
				rubricService.updateCriterionForRubric("non-existent-id", {})
			).rejects.toThrow("Criterion not found");
		});
	});

	describe("deleteCriterionForRubric", () => {
		it("should delete a criterion for a rubric", async () => {
			const criterion = await prisma.criterion.findFirst({
				where: { rubricId: testRubric.rubricId }
			});

			await rubricService.deleteCriterionForRubric(criterion.criterionId);

			const deletedCriterion = await prisma.criterion.findUnique({
				where: { criterionId: criterion.criterionId }
			});
			expect(deletedCriterion).toBeNull();
		});

		it("should throw an error if criterion is not found", async () => {
			await expect(
				rubricService.deleteCriterionForRubric("non-existent-id")
			).rejects.toThrow("Criterion not found");
		});
	});

	describe("createCriterionRating", () => {
		it("should create a rating for a criterion", async () => {
			const criterion = await prisma.criterion.findFirst({
				where: { rubricId: testRubric.rubricId }
			});

			const ratingData = {
				description: "New Rating",
				points: 25
			};

			const newRating = await rubricService.createCriterionRating(
				criterion.criterionId,
				ratingData
			);

			expect(newRating).toHaveProperty("criterionRatingId");
			expect(newRating.description).toBe(ratingData.description);
		});
	});

	describe("linkRubricToAssignments", () => {
		it("should link a rubric to multiple assignments", async () => {
			const newAssignment = await prisma.assignment.create({
				data: {
					title: "Another Test Assignment",
					description: "Another Test Assignment Description",
					dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
					classId: testClass.classId
				}
			});

			const result = await rubricService.linkRubricToAssignments(
				testRubric.rubricId,
				[testAssignment.assignmentId, newAssignment.assignmentId]
			);

			expect(result).toHaveProperty(
				"message",
				"Rubric linked to assignments successfully"
			);
			expect(result.updatedCount).toBe(2);

			const updatedAssignments = await prisma.assignment.findMany({
				where: { rubricId: testRubric.rubricId }
			});
			expect(updatedAssignments).toHaveLength(2);
		});

		it("should throw an error if rubric is not found", async () => {
			await expect(
				rubricService.linkRubricToAssignments("non-existent-id", [])
			).rejects.toThrow("Rubric not found");
		});

		it("should throw an error if no assignment IDs are provided", async () => {
			await expect(
				rubricService.linkRubricToAssignments(testRubric.rubricId, [])
			).rejects.toThrow("Invalid or empty assignment IDs provided");
		});
	});
});
