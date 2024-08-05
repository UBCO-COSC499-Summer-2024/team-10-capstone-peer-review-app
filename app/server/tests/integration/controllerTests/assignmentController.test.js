import request from "supertest";
import prisma from "../../../prisma/prismaClient.js";

const API_URL = process.env.API_URL || "http://peergrade-server-test:5001"; // Adjust this URL as needed

describe("Assignment Controller", () => {
	beforeAll(async () => {
		await prisma.$connect();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	beforeEach(async () => {
		await prisma.user.deleteMany();
		await prisma.roleRequest.deleteMany();
	});

	describe("POST /assignment/add-assignment", () => {
		it("should create a new assignment", async () => {
			const testAsg = {
				title: "Test Assignment",
				description: "This is a test assignment",
				dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
				classId: 10, // Link to class
				assignmentFilePath:
					"https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK", // dummy file
				categoryId: 31 // Link to category
			};

			const res = await request(API_URL)
				.post("/assignment/add-assignment")
				.send(testAsg);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toContain(
				"Assignment successfully added to class and category"
			);

			// Check Database for user
			const asg = await prisma.assignment.findFirst({
				where: { classId: testAsg.classId }
			});

			expect(asg).toBeTruthy();
			expect(asg.title).toBe(testAsg.title);
			expect(asg.description).toBe(testAsg.description);
			expect(asg.dueDate).toBe(testAsg.dueDate.toISOString());
			expect(asg.classId).toBe(testAsg.classId);
			expect(asg.assignmentFilePath).toBe(testAsg.assignmentFilePath);
			expect(asg.categoryId).toBe(testAsg.categoryId);
		});
	});
});
