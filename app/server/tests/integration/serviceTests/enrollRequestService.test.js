import prisma from "../../../prisma/prismaClient.js";
import enrollRequestService from "../../../src/services/enrollRequestService.js";
import apiError from "../../../src/utils/apiError.js";

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("enrollRequestService Integration Tests", () => {
	let testUser, testClass, testEnrollRequest;

	beforeEach(async () => {
		await prisma.$transaction(async (prisma) => {
			// Clean up
			await prisma.enrollRequest.deleteMany();
			await prisma.userInClass.deleteMany();
			await prisma.class.deleteMany();
			await prisma.user.deleteMany();

			// Create test user
			testUser = await prisma.user.create({
				data: {
					email: "testuser@example.com",
					password: "password123",
					firstname: "Test",
					lastname: "User",
					role: "STUDENT"
				}
			});

			// Create test class
			testClass = await prisma.class.create({
				data: {
					classname: "Test Class",
					description: "Test Description",
					startDate: new Date(),
					endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
					instructorId: testUser.userId
				}
			});
		});
	});

	describe("createEnrollRequest", () => {
		it("should create a new enrollment request", async () => {
			const enrollRequest = await enrollRequestService.createEnrollRequest(
				testUser.userId,
				testClass.classId,
				"Please enroll me in this class"
			);

			expect(enrollRequest).toBeTruthy();
			expect(enrollRequest.userId).toBe(testUser.userId);
			expect(enrollRequest.classId).toBe(testClass.classId);
			expect(enrollRequest.senderMessage).toBe(
				"Please enroll me in this class"
			);
		});

		it("should throw an error if an enrollment request already exists", async () => {
			await enrollRequestService.createEnrollRequest(
				testUser.userId,
				testClass.classId,
				"First request"
			);

			await expect(
				enrollRequestService.createEnrollRequest(
					testUser.userId,
					testClass.classId,
					"Second request"
				)
			).rejects.toThrow(
				new apiError("An enrollment request for this class already exists", 400)
			);
		});
	});

	describe("getAllEnrollRequests", () => {
		it("should retrieve all enrollment requests", async () => {
			await enrollRequestService.createEnrollRequest(
				testUser.userId,
				testClass.classId,
				"Test request"
			);

			const requests = await enrollRequestService.getAllEnrollRequests();

			expect(requests).toHaveLength(1);
			expect(requests[0].userId).toBe(testUser.userId);
			expect(requests[0].classId).toBe(testClass.classId);
		});
	});

	describe("getEnrollRequestsForClass", () => {
		it("should retrieve enrollment requests for a specific class", async () => {
			await enrollRequestService.createEnrollRequest(
				testUser.userId,
				testClass.classId,
				"Test request"
			);

			const requests = await enrollRequestService.getEnrollRequestsForClass(
				testClass.classId
			);

			expect(requests).toHaveLength(1);
			expect(requests[0].userId).toBe(testUser.userId);
			expect(requests[0].classId).toBe(testClass.classId);
		});
	});

	describe("getEnrollRequestsForUser", () => {
		it("should retrieve enrollment requests for a specific user", async () => {
			await enrollRequestService.createEnrollRequest(
				testUser.userId,
				testClass.classId,
				"Test request"
			);

			const requests = await enrollRequestService.getEnrollRequestsForUser(
				testUser.userId
			);

			expect(requests).toHaveLength(1);
			expect(requests[0].userId).toBe(testUser.userId);
			expect(requests[0].classId).toBe(testClass.classId);
		});
	});

	describe("updateEnrollRequestStatus", () => {
		beforeEach(async () => {
			testEnrollRequest = await enrollRequestService.createEnrollRequest(
				testUser.userId,
				testClass.classId,
				"Test request"
			);
		});

		it("should update the status of an enrollment request to APPROVED", async () => {
			const updatedRequest =
				await enrollRequestService.updateEnrollRequestStatus(
					testEnrollRequest.enrollRequestId,
					"APPROVED",
					"Welcome to the class!"
				);

			expect(updatedRequest.status).toBe("APPROVED");

			// Check if user is added to the class
			const userInClass = await prisma.userInClass.findUnique({
				where: {
					UserInClassId: {
						userId: testUser.userId,
						classId: testClass.classId
					}
				}
			});
			expect(userInClass).toBeTruthy();
		});

		it("should update the status of an enrollment request to DENIED", async () => {
			const updatedRequest =
				await enrollRequestService.updateEnrollRequestStatus(
					testEnrollRequest.enrollRequestId,
					"DENIED",
					"Sorry, the class is full"
				);

			expect(updatedRequest.status).toBe("DENIED");
		});
	});

	describe("deleteEnrollRequest", () => {
		beforeEach(async () => {
			testEnrollRequest = await enrollRequestService.createEnrollRequest(
				testUser.userId,
				testClass.classId,
				"Test request"
			);
		});

		it("should delete an enrollment request", async () => {
			await enrollRequestService.deleteEnrollRequest(
				testEnrollRequest.enrollRequestId,
				testUser.userId
			);

			const deletedRequest = await prisma.enrollRequest.findUnique({
				where: { enrollRequestId: testEnrollRequest.enrollRequestId }
			});
			expect(deletedRequest).toBeNull();
		});

		it("should throw an error when trying to delete a non-existent request", async () => {
			await expect(
				enrollRequestService.deleteEnrollRequest(
					"non-existent-id",
					testUser.userId
				)
			).rejects.toThrow(
				new apiError("Enrollment request not found or unauthorized", 404)
			);
		});
	});
});
