import request from "supertest";
import prisma from "../../../prisma/prismaClient.js";

const API_URL = process.env.API_URL || "http://peergrade-server-test:5001"; // Adjust this URL as needed

describe("Auth Controller", () => {
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

	describe("POST /api/auth/register", () => {
		it("should register a new Student user", async () => {
			const testUser = {
				email: "test@example.com",
				password: "password123",
				firstname: "Test",
				lastname: "User",
				role: "STUDENT"
			};

			const res = await request(API_URL).post("/auth/register").send(testUser);

			expect(res.statusCode).toBe(200);
			expect(res.body.status).toBe("Success");
			expect(res.body.message).toContain(
				`Account successfully created! Verification email sent to ${testUser.email}.`
			);

			// Check Database for user
			const user = await prisma.user.findUnique({
				where: { email: testUser.email }
			});

			expect(user).toBeTruthy();
			expect(user.email).toBe(testUser.email);
			expect(user.firstname).toBe(testUser.firstname);
			expect(user.lastname).toBe(testUser.lastname);
			expect(user.role).toBe(testUser.role);
		});
	});
});
