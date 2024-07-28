import request from "supertest";
import prisma from "../../../prisma/prismaClient.js";

const API_URL = process.env.API_URL || "http://peergrade-server-test:5001"; // Adjust this URL as needed

describe("Rubric Controller", () => {
	beforeAll(async () => {
		await prisma.$connect();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	beforeEach(async () => {
		await prisma.rubric.deleteMany();
	});

    describe('POST rubric/add-rubrics', () => {
        it('should create rubrics for an assignment', async () => {
            // Mock the necessary data
            const creatorId = 'user123'; // Adjust this ID to be a valid user ID
            const assignmentId = 'assignment123';
            const rubricData = {
                title: 'Rubric Title',
                description: 'Rubric Description',
                totalMarks: 100,
                classId: 'class123',
                criterion: [
                    {
                        title: 'Criterion 1',
                        minPoints: 0,
                        maxPoints: 50,
                        criterionRatings: [
                            {
                                text: 'Rating 1',
                                points: 10,
                            },
                            {
                                text: 'Rating 2',
                                points: 20,
                            },
                        ],
                    },
                    {
                        title: 'Criterion 2',
                        minPoints: 0,
                        maxPoints: 50,
                        criterionRatings: [
                            {
                                text: 'Rating 1',
                                points: 10,
                            },
                            {
                                text: 'Rating 2',
                                points: 20,
                            },
                        ],
                    },
                ],
            };

            const res = await request(API_URL)
            .post("/rubric/add-rubrics")
            .send({ creatorId, assignmentId, rubricData });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("Success");
        });
    });
});