import request  from "supertest";
import prisma from "../../../prisma/prismaClient.js";

const API_URL = process.env.API_URL || "http://peergrade-server-test:5001"; // Adjust this URL as needed

describe("Class Controller", () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        await prisma.class.deleteMany();
    });

    describe("POST /api/class/createClass", () => {
        it("should create a new class", async () => {
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                instructorId: 1
            };

            const res = await request(API_URL).post("/classes/create").send(testClass);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("Success");
            expect(res.body.message).toContain("Class successfully created!");

            // Check Database for class
            const classData = await prisma.class.findUnique({
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

        it("should not create a new class with invalid data", async () => {
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
                instructorId: 1
            };

            const res = await request(API_URL).post("/classes/create").send(testClass);

            expect(res.statusCode).toBe(401);
            expect(res.body.status).toBe("Error");
            expect(res.body.message).toContain("Invalid class data provided.");
        });

        it("should not create a new class with missing data", async () => {
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: new Date(),
                instructorId: 1
            };

            const res = await request(API_URL).post("/classes/create").send(testClass);

            expect(res.statusCode).toBe(401);
            expect(res.body.status).toBe("Error");
            expect(res.body.message).toContain("Invalid class data provided.");
        });

        it("should not create a new class with missing instructorId", async () => {
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            };

            const res = await request(API_URL).post("/classes/create").send(testClass);

            expect(res.statusCode).toBe(401);
            expect(res.body.status).toBe("Error");
            expect(res.body.message).toContain("Invalid class data provided.");
        });

        it("should not create a new class with invalid instructorId", async () => {
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                instructorId: 100
            };

            const res = await request(API_URL).post("/classes/create").send(testClass);

            expect(res.statusCode).toBe(401);
            expect(res.body.status).toBe("Error");
            expect(res.body.message).toContain("Invalid class data provided.");
        });
    });
});