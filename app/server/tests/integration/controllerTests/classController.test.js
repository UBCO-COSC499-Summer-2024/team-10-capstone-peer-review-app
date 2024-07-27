import request  from "supertest";
import authService from "../../../src/services/authService.js";
import prisma from "../../../prisma/prismaClient.js";
//import { user } from "pg/lib/defaults.js";

const API_URL = process.env.API_URL || "http://peergrade-server-test:5001"; // Adjust this URL as needed

describe("Class Controller", () => {
    let user;
    beforeAll(async () => {
        await prisma.$connect();
        const userData = {
            email: "verified@example.com",
            password: "password123",
            firstname: "Verified",
            lastname: "User",
            role: "STUDENT"
        };

        await authService.registerUser(userData);
        await prisma.user.update({
            where: { email: userData.email },
            data: { isEmailVerified: true, isRoleActivated: true }
        });

        user = await authService.loginUser(
            userData.email,
            userData.password
        );
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        await prisma.class.deleteMany();
    });

    describe("POST /classes/create", () => {
        it("should create a new class", async () => {
            expect(user).toBeTruthy();
            const testClass = {
                //instructorId: user.userId,
                classname: "Test Class",
                description: "This is a test class",
                startDate: "2024-05-01T00:00:00Z",
                endDate: "2024-08-30T23:59:59Z",
                term: "Spring 2024",
                classSize: 4
            };

            const res = await request(API_URL).post("/classes/create").send(testClass);

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe("Success");
            expect(res.body.message).toContain("Class successfully created!");

            // Check Database for class
            const classData = await prisma.class.findFirst({
                where: { classname: testClass.classname }
            });

            expect(classData).toBeTruthy();
            expect(classData.classname).toBe(testClass.classname);
            expect(classData.description).toBe(testClass.description
            );
            expect(classData.startDate).toBe(testClass.startDate.toISOString());
            expect(classData.endDate).toBe(testClass.endDate.toISOString());
            expect(classData.instructorId).toBe(testClass.instructorId);

        });

        // it("should not create a new class with invalid data", async () => {
        //     const testClass = {
        //         classname: "Test Class",
        //         description: "This is a test class",
        //         startDate: new Date(),
        //         endDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        //         instructorId: user.userId
        //     };

        //     const res = await request(API_URL).post("/classes/create").send(testClass);

        //     expect(res.statusCode).toBe(401);
        //     expect(res.body.status).toBe("Error");
        //     expect(res.body.message).toContain("Invalid class data provided.");
        // });

        // it("should not create a new class with missing data", async () => {
        //     const testClass = {
        //         classname: "Test Class",
        //         description: "This is a test class",
        //         startDate: new Date(),
        //         instructorId: 1
        //     };

        //     const res = await request(API_URL).post("/classes/create").send(testClass);

        //     expect(res.statusCode).toBe(401);
        //     expect(res.body.status).toBe("Error");
        //     expect(res.body.message).toContain("Invalid class data provided.");
        // });

        // it("should not create a new class with missing instructorId", async () => {
        //     const testClass = {
        //         classname: "Test Class",
        //         description: "This is a test class",
        //         startDate: new Date(),
        //         endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        //     };

        //     const res = await request(API_URL).post("/classes/create").send(testClass);

        //     expect(res.statusCode).toBe(401);
        //     expect(res.body.status).toBe("Error");
        //     expect(res.body.message).toContain("Invalid class data provided.");
        // });

        // it("should not create a new class with invalid instructorId", async () => {
        //     const testClass = {
        //         classname: "Test Class",
        //         description: "This is a test class",
        //         startDate: new Date(),
        //         endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        //         instructorId: 100
        //     };

        //     const res = await request(API_URL).post("/classes/create").send(testClass);

        //     expect(res.statusCode).toBe(401);
        //     expect(res.body.status).toBe("Error");
        //     expect(res.body.message).toContain("Invalid class data provided.");
        // });
    });
});