import request from "supertest";
import bcrypt from "bcrypt";
import prisma from "../../../prisma/prismaClient.js";

const API_URL = process.env.API_URL || "http://peergrade-server-test:5001"; // Adjust this URL as needed

describe("User Controller", () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        await prisma.user.deleteMany();
    });

    describe("POST /api/user/create", () => {
        it("should create a new user", async () => {
            const testUser = {
                email: "abc@g.com",
                password: bcrypt.hash("abc", 10),
                firstname: "abc",
                lastname: "def",
                isEmailVerified: true,
                isRoleActivated: true,
                role: "STUDENT"
            }
        });
    });
});