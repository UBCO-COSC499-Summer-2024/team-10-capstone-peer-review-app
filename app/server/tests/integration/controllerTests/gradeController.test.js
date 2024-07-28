import request from "supertest";
import prisma from "../../../prisma/prismaClient.js";

const API_URL = process.env.API_URL || "http://peergrade-server-test:5001"; // Adjust this URL as needed

describe("Grade Controller", () => {
	beforeAll(async () => {
		await prisma.$connect();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	beforeEach(async () => {
		await prisma.criterionGrade.deleteMany();
	});

	describe("POST /grade/createGrade", () => {
		it("should create a new grade", async () => {
            const testGrade = {
                reviewId: "1", // Adjust this ID to be a valid review ID
                grade: 90,
                criterionId: "1", // Adjust this ID to be a valid criterion ID
                comment: "comment"
            };

            const res = await request(API_URL)
                .post("/grade/createGrade")
                .send(testGrade);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("Success");
		});
	});
});
