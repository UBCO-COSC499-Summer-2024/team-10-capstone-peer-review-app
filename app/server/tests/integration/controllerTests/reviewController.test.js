import request from "supertest";
import prisma from "../../../prisma/prismaClient.js";

const API_URL = process.env.API_URL || "http://peergrade-server-test:5001"; // Adjust this URL as needed

describe("Review Controller", () => {
	beforeAll(async () => {
		await prisma.$connect();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	beforeEach(async () => {
		await prisma.category.deleteMany();
	});

	describe("POST /review/createReview", () => {
		it("should create a new review", async () => {
            const testReview = {
                submissionId: "testSubmissionId", // change ids to original ids
                reviewerId: "testReviewerId",
                revieweeId: "testRevieweeId",
                reviewGrade: 5,
                isPeerReview: true
            };

            const res = await request(API_URL)
                .post("/review/testReview")
                .send(testReview);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("Success");
		});
	});
});
