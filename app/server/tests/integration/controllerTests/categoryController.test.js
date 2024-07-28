import request from "supertest";
import prisma from "../../../prisma/prismaClient.js";

const API_URL = process.env.API_URL || "http://peergrade-server-test:5001"; // Adjust this URL as needed

describe("Category Controller", () => {
	beforeAll(async () => {
		await prisma.$connect();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	beforeEach(async () => {
		await prisma.category.deleteMany();
	});

	describe("POST /category/createCategory", () => {
		it("should create a new category", async () => {
            const testCategory = {
                classId: "1", // Adjust this ID to be a valid class ID
                name: "Test Category"
            };

            const res = await request(API_URL)
                .post("/category/createCategory")
                .send(testCategory);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("Success");
		});
	});
});
