import request  from "supertest";
import bcrypt from "bcrypt";
import prisma from "../../../prisma/prismaClient.js";
//import { user } from "pg/lib/defaults.js";

const API_URL = process.env.API_URL || "http://peergrade-server-test:5001"; // Adjust this URL as needed

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("classController Integration Tests", () => {
	let testInstructor, testStudent, testClass, testGroup;

	beforeEach(async () => {
		await prisma.$transaction(async (prisma) => {
			// Clean up
			await prisma.userInClass.deleteMany();
			await prisma.group.deleteMany();
			await prisma.class.deleteMany();
			await prisma.user.deleteMany();

            // Create test instructor
            testInstructor = await prisma.user.create({
                data: {
                    email: "instructor@example.com",
                    password: await bcrypt.hash("password123", 10),
                    firstname: "Test",
                    lastname: "Instructor",
                    role: "INSTRUCTOR",
                    isEmailVerified: true,
                    isRoleActivated: true
                }
            });

            // Create test student
            testStudent = await prisma.user.create({
                data: {
                    email: "student@example.com",
                    password: "password123",
                    firstname: "Test",
                    lastname: "Student",
                    role: "STUDENT",
                    isEmailVerified: true,
                    isRoleActivated: true
                }
            });

            // Create test class
            // testClass = await prisma.class.create({
            //     data: {
            //         classname: "Test Class",
            //         description: "Test Description",
            //         startDate: new Date(),
            //         endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            //         instructorId: testInstructor.userId
            //     }
            // });

			// Create test group
			// testGroup = await prisma.group.create({
			// 	data: {
			// 		classId: testClass.classId,
			// 		groupName: "Test Group",
			// 		groupSize: 5
			// 	}
			// });
		});
	});

	describe("GET /classes/all", () => {
		it("should retrieve all classes with counts", async () => {
            const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success");


            const res = await request(API_URL).get("/classes/all").set("Cookie", cookie);
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("Success");
            expect(res.body.message).toBe("Classes retrieved");
		});
	});

    describe("POST /classes/create", () => {
        it("should create a new class", async () => {
            const res1 = await request(API_URL).post("/auth/login").send({
				email: "instructor@example.com",
				password: "password123"
			});

			const cookie = res1.headers["set-cookie"];
			expect(cookie).toBeTruthy();
			
			expect(res1.body.message).toBe("You have been logged in!");
			expect(res1.statusCode).toBe(200);
			expect(res1.body.status).toBe("Success");

            // expect(user).toBeTruthy();
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: "2024-05-01T00:00:00Z",
                endDate: "2024-08-30T23:59:59Z",
                term: "Spring 2024",
                classSize: 4
            };

            const res = await request(API_URL).post("/classes/create").set("Cookie", cookie).send(testClass);
            console.log(API_URL);

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe("Success");
            expect(res.body.message).toContain("Class successfully created");

            // Check Database for class
            const classData = await prisma.class.findFirst({
                where: { classname: testClass.classname }
            });

            expect(classData).toBeTruthy();
            expect(classData.classname).toBe(testClass.classname);
            expect(classData.description).toBe(testClass.description);
        });
    });

    describe("Get /classes/my-classes", () => {
        it("should get my class(es)", async () => {
                const res1 = await request(API_URL).post("/auth/login").send({
                    email: "instructor@example.com",
                    password: "password123"
                });
    
                const cookie = res1.headers["set-cookie"];
                expect(cookie).toBeTruthy();
                
                expect(res1.body.message).toBe("You have been logged in!");
                expect(res1.statusCode).toBe(200);
                expect(res1.body.status).toBe("Success");
    
                // expect(user).toBeTruthy();
                const testClass = {
                    classname: "Test Class",
                    description: "This is a test class",
                    startDate: "2024-05-01T00:00:00Z",
                    endDate: "2024-08-30T23:59:59Z",
                    term: "Spring 2024",
                    classSize: 4
                };
    
                const res = await request(API_URL).post("/classes/create").set("Cookie", cookie).send(testClass);
                console.log(API_URL);
    
                expect(res.statusCode).toBe(201);
                expect(res.body.status).toBe("Success");
                expect(res.body.message).toContain("Class successfully created");
    
                // Check Database for class
                const classData = await prisma.class.findFirst({
                    where: { classname: testClass.classname }
                });
    
                expect(classData).toBeTruthy();
                expect(classData.classname).toBe(testClass.classname);
                expect(classData.description).toBe(testClass.description);

                const res2 = await request(API_URL).get("/classes/my-classes").set("Cookie", cookie);
                expect(res2.statusCode).toBe(200);
                expect(res2.body.status).toBe("Success");
                expect(res2.body.data).toBeTruthy();
            });
        });

    describe("POST classes/add-student", () => {
        it("should add a student to a class", async () => {
            const res1 = await request(API_URL).post("/auth/login").send({
                email: "instructor@example.com",
                password: "password123"
            });

            const cookie = res1.headers["set-cookie"];
            expect(cookie).toBeTruthy();
            
            expect(res1.body.message).toBe("You have been logged in!");
            expect(res1.statusCode).toBe(200);
            expect(res1.body.status).toBe("Success");

            // expect(user).toBeTruthy();
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: "2024-05-01T00:00:00Z",
                endDate: "2024-08-30T23:59:59Z",
                term: "Spring 2024",
                classSize: 4
            };

            const res = await request(API_URL).post("/classes/create").set("Cookie", cookie).send(testClass);
            console.log(API_URL);

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe("Success");
            expect(res.body.message).toContain("Class successfully created");

            // Check Database for user student
            const studentData = await prisma.user.findFirst({
                where: { email: "student@example.com" }
            });

            const classData = await prisma.class.findFirst({
                where: { classname: testClass.classname }
            });

            const res2 = await request(API_URL).post("/classes/add-student").set("Cookie", cookie).send({
                classId: classData.classId,
                studentId: studentData.userId
            });

            expect(res2.statusCode).toBe(200);
            expect(res2.body.status).toBe("Success");
            expect(res2.body.message).toContain("Student successfully added to class");
        });
    });

    describe("POST classes/remove-student", () => {
        it("should remove a student from a class", async () => {
            const res1 = await request(API_URL).post("/auth/login").send({
                email: "instructor@example.com",
                password: "password123"
            });

            const cookie = res1.headers["set-cookie"];
            expect(cookie).toBeTruthy();
            
            expect(res1.body.message).toBe("You have been logged in!");
            expect(res1.statusCode).toBe(200);
            expect(res1.body.status).toBe("Success");

            // expect(user).toBeTruthy();
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: "2024-05-01T00:00:00Z",
                endDate: "2024-08-30T23:59:59Z",
                term: "Spring 2024",
                classSize: 4
            };

            const res = await request(API_URL).post("/classes/create").set("Cookie", cookie).send(testClass);
            console.log(API_URL);

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe("Success");
            expect(res.body.message).toContain("Class successfully created");

            // Check Database for user student
            const studentData = await prisma.user.findFirst({
                where: { email: "student@example.com" }
            });

            const classData = await prisma.class.findFirst({
                where: { classname: testClass.classname }
            });

            const res2 = await request(API_URL).post("/classes/add-student").set("Cookie", cookie).send({
                classId: classData.classId,
                studentId: studentData.userId
            });

            expect(res2.statusCode).toBe(200);
            expect(res2.body.status).toBe("Success");
            expect(res2.body.message).toContain("Student successfully added to class");

            const res3 = await request(API_URL).post("/classes/remove-student").set("Cookie", cookie).send({
                classId: classData.classId,
                studentId: studentData.userId
            });

            expect(res3.statusCode).toBe(200);
            expect(res3.body.status).toBe("Success");
            expect(res3.body.message).toContain("Student successfully removed from class");
        });
    });

    describe("POST classes/add-group", () => {
        it("should add a group to a class", async () => {
            const res1 = await request(API_URL).post("/auth/login").send({
                email: "instructor@example.com",
                password: "password123"
            });

            const cookie = res1.headers["set-cookie"];
            expect(cookie).toBeTruthy();
            
            expect(res1.body.message).toBe("You have been logged in!");
            expect(res1.statusCode).toBe(200);
            expect(res1.body.status).toBe("Success");

            // expect(user).toBeTruthy();
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: "2024-05-01T00:00:00Z",
                endDate: "2024-08-30T23:59:59Z",
                term: "Spring 2024",
                classSize: 4
            };

            const res = await request(API_URL).post("/classes/create").set("Cookie", cookie).send(testClass);
            console.log(API_URL);

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe("Success");
            expect(res.body.message).toContain("Class successfully created");

            // Check Database for user student
            const studentData = await prisma.user.findFirst({
                where: { email: "student@example.com" }
            });

            const classData = await prisma.class.findFirst({
                where: { classname: testClass.classname }
            });

            const res2 = await request(API_URL).post("/classes/add-student").set("Cookie", cookie).send({
                classId: classData.classId,
                studentId: studentData.userId
            });

            expect(res2.statusCode).toBe(200);
            expect(res2.body.status).toBe("Success");
            expect(res2.body.message).toContain("Student successfully added to class");

            const groupData = {
                groupName: "Test Group",
                groupSize: 4
            };

            const res3 = await request(API_URL).post("/classes/add-group").set("Cookie", cookie).send({
                classId: classData.classId,
                groupData: groupData
            });

            expect(res3.statusCode).toBe(200);
            expect(res3.body.status).toBe("Success");
            expect(res3.body.message).toContain("Group successfully added to class");
        });
    });

    describe("POST classes/remove-group", () => {
        it("should remove a group from a class", async () => {
            const res1 = await request(API_URL).post("/auth/login").send({
                email: "instructor@example.com",
                password: "password123"
            });

            const cookie = res1.headers["set-cookie"];
            expect(cookie).toBeTruthy();
            
            expect(res1.body.message).toBe("You have been logged in!");
            expect(res1.statusCode).toBe(200);
            expect(res1.body.status).toBe("Success");

            // expect(user).toBeTruthy();
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: "2024-05-01T00:00:00Z",
                endDate: "2024-08-30T23:59:59Z",
                term: "Spring 2024",
                classSize: 4
            };

            const res = await request(API_URL).post("/classes/create").set("Cookie", cookie).send(testClass);
            console.log(API_URL);

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe("Success");
            expect(res.body.message).toContain("Class successfully created");

            // Check Database for user student
            const studentData = await prisma.user.findFirst({
                where: { email: "student@example.com" }
            });

            const classData = await prisma.class.findFirst({
                where: { classname: testClass.classname }
            });

            const res2 = await request(API_URL).post("/classes/add-student").set("Cookie", cookie).send({
                classId: classData.classId,
                studentId: studentData.userId
            });

            expect(res2.statusCode).toBe(200);
            expect(res2.body.status).toBe("Success");
            expect(res2.body.message).toContain("Student successfully added to class");

            const groupData = {
                groupName: "Test Group",
                groupSize: 4
            };

            const res3 = await request(API_URL).post("/classes/add-group").set("Cookie", cookie).send({
                classId: classData.classId,
                groupData: groupData
            });

            const groupId = await prisma.group.findFirst({
                where: { groupName: "Test Group" }
            });

            const res4 = await request(API_URL).post("/classes/remove-group").set("Cookie", cookie).send({
                groupId: groupId.groupId
            });

            expect(res4.statusCode).toBe(200);
            expect(res4.body.status).toBe("Success");
            expect(res4.body.message).toContain("Group successfully removed from class");
        });
    });

    describe("POST classes/update-group", () => {
        it("should update a group in a class", async () => {
            const res1 = await request(API_URL).post("/auth/login").send({
                email: "instructor@example.com",
                password: "password123"
            });

            const cookie = res1.headers["set-cookie"];
            expect(cookie).toBeTruthy();
            
            expect(res1.body.message).toBe("You have been logged in!");
            expect(res1.statusCode).toBe(200);
            expect(res1.body.status).toBe("Success");

            // expect(user).toBeTruthy();
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: "2024-05-01T00:00:00Z",
                endDate: "2024-08-30T23:59:59Z",
                term: "Spring 2024",
                classSize: 4
            };

            const res = await request(API_URL).post("/classes/create").set("Cookie", cookie).send(testClass);
            console.log(API_URL);

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe("Success");
            expect(res.body.message).toContain("Class successfully created");

            // Check Database for user student
            const studentData = await prisma.user.findFirst({
                where: { email: "student@example.com" }
            });

            const classData = await prisma.class.findFirst({
                where: { classname: testClass.classname }
            });

            const res2 = await request(API_URL).post("/classes/add-student").set("Cookie", cookie).send({
                classId: classData.classId,
                studentId: studentData.userId
            });

            expect(res2.statusCode).toBe(200);
            expect(res2.body.status).toBe("Success");
            expect(res2.body.message).toContain("Student successfully added to class");

            const groupData = {
                groupName: "Test Group",
                groupSize: 4
            };

            const res3 = await request(API_URL).post("/classes/add-group").set("Cookie", cookie).send({
                classId: classData.classId,
                groupData: groupData
            });

            const groupId = await prisma.group.findFirst({
                where: { groupName: "Test Group" }
            });

            const updatedGroupData = {
                groupName: "Updated Group",
                groupSize: 6
            };

            const res4 = await request(API_URL).post("/classes/update-group").set("Cookie", cookie).send({
                groupId: groupId.groupId,
                updateData: updatedGroupData
            });

            expect(res4.statusCode).toBe(200);
            expect(res4.body.status).toBe("Success");
            expect(res4.body.message).toContain("Group successfully updated in class");
        });
    });

    describe("POST classes/get-group", () => {
        it("should get a group in a class", async () => {
            const res1 = await request(API_URL).post("/auth/login").send({
                email: "instructor@example.com",
                password: "password123"
            });

            const cookie = res1.headers["set-cookie"];
            expect(cookie).toBeTruthy();
            
            expect(res1.body.message).toBe("You have been logged in!");
            expect(res1.statusCode).toBe(200);
            expect(res1.body.status).toBe("Success");

            // expect(user).toBeTruthy();
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: "2024-05-01T00:00:00Z",
                endDate: "2024-08-30T23:59:59Z",
                term: "Spring 2024",
                classSize: 4
            };

            const res = await request(API_URL).post("/classes/create").set("Cookie", cookie).send(testClass);
            console.log(API_URL);

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe("Success");
            expect(res.body.message).toContain("Class successfully created");

            // Check Database for user student
            const studentData = await prisma.user.findFirst({
                where: { email: "student@example.com" }
            });

            const classData = await prisma.class.findFirst({
                where: { classname: testClass.classname }
            });

            const res2 = await request(API_URL).post("/classes/add-student").set("Cookie", cookie).send({
                classId: classData.classId,
                studentId: studentData.userId
            });

            expect(res2.statusCode).toBe(200);
            expect(res2.body.status).toBe("Success");
            expect(res2.body.message).toContain("Student successfully added to class");

            const groupData = {
                groupName: "Test Group",
                groupSize: 4
            };

            const res3 = await request(API_URL).post("/classes/add-group").set("Cookie", cookie).send({
                classId: classData.classId,
                groupData: groupData
            });

            const groupId = await prisma.group.findFirst({
                where: { groupName: "Test Group" }
            });

            const res4 = await request(API_URL).post("/classes/get-group").set("Cookie", cookie).send({
                groupId: groupId.groupId,
                classId: classData.classId
            });

            expect(res4.statusCode).toBe(200);
            expect(res4.body.status).toBe("Success");
            expect(res4.body.data).toBeTruthy();
        });
    });

    describe("POST classes/get-groups", () => {
        it("should get groups in a class", async () => {
            const res1 = await request(API_URL).post("/auth/login").send({
                email: "instructor@example.com",
                password: "password123"
            });

            const cookie = res1.headers["set-cookie"];
            expect(cookie).toBeTruthy();
            
            expect(res1.body.message).toBe("You have been logged in!");
            expect(res1.statusCode).toBe(200);
            expect(res1.body.status).toBe("Success");

            // expect(user).toBeTruthy();
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: "2024-05-01T00:00:00Z",
                endDate: "2024-08-30T23:59:59Z",
                term: "Spring 2024",
                classSize: 4
            };

            const res = await request(API_URL).post("/classes/create").set("Cookie", cookie).send(testClass);
            console.log(API_URL);

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe("Success");
            expect(res.body.message).toContain("Class successfully created");

            // Check Database for user student
            const studentData = await prisma.user.findFirst({
                where: { email: "student@example.com" }
            });

            const classData = await prisma.class.findFirst({
                where: { classname: testClass.classname }
            });

            const res2 = await request(API_URL).post("/classes/add-student").set("Cookie", cookie).send({
                classId: classData.classId,
                studentId: studentData.userId
            });

            expect(res2.statusCode).toBe(200);
            expect(res2.body.status).toBe("Success");
            expect(res2.body.message).toContain("Student successfully added to class");

            const groupData = {
                groupName: "Test Group",
                groupSize: 4
            };

            const res3 = await request(API_URL).post("/classes/add-group").set("Cookie", cookie).send({
                classId: classData.classId,
                groupData: groupData
            });

            const groupId = await prisma.group.findFirst({
                where: { groupName: "Test Group" }
            });

            const res4 = await request(API_URL).post("/classes/get-groups").set("Cookie", cookie).send({
                classId: classData.classId
            });

            expect(res4.statusCode).toBe(200);
            expect(res4.body.status).toBe("Success");
            expect(res4.body.data).toBeTruthy();
        });
    });

    describe("POST classes/add-group-member", () => {
        it("should add a student to a group in a class", async () => {
            const res1 = await request(API_URL).post("/auth/login").send({
                email: "instructor@example.com",
                password: "password123"
            });

            const cookie = res1.headers["set-cookie"];
            expect(cookie).toBeTruthy();
            
            expect(res1.body.message).toBe("You have been logged in!");
            expect(res1.statusCode).toBe(200);
            expect(res1.body.status).toBe("Success");

            // expect(user).toBeTruthy();
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: "2024-05-01T00:00:00Z",
                endDate: "2024-08-30T23:59:59Z",
                term: "Spring 2024",
                classSize: 4
            };

            const res = await request(API_URL).post("/classes/create").set("Cookie", cookie).send(testClass);
            console.log(API_URL);

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe("Success");
            expect(res.body.message).toContain("Class successfully created");

            // Check Database for user student
            const studentData = await prisma.user.findFirst({
                where: { email: "student@example.com" }
            });

            const classData = await prisma.class.findFirst({
                where: { classname: testClass.classname }
            });

            const res2 = await request(API_URL).post("/classes/add-student").set("Cookie", cookie).send({
                classId: classData.classId,
                studentId: studentData.userId
            });

            expect(res2.statusCode).toBe(200);
            expect(res2.body.status).toBe("Success");
            expect(res2.body.message).toContain("Student successfully added to class");

            const groupData = {
                groupName: "Test Group",
                groupSize: 4
            };

            const res3 = await request(API_URL).post("/classes/add-group").set("Cookie", cookie).send({
                classId: classData.classId,
                groupData: groupData
            });

            const groupId = await prisma.group.findFirst({
                where: { groupName: "Test Group" }
            });

            const res4 = await request(API_URL).post("/classes/add-group-member").set("Cookie", cookie).send({
                groupId: groupId.groupId,
                userId: studentData.userId
            });

            expect(res4.statusCode).toBe(200);
            expect(res4.body.status).toBe("Success");
            expect(res4.body.message).toContain("Member successfully added to group");
        });
    });

    describe("POST classes/remove-group-member", () => {
        it("should remove a student from a group in a class", async () => {
            const res1 = await request(API_URL).post("/auth/login").send({
                email: "instructor@example.com",
                password: "password123"
            });

            const cookie = res1.headers["set-cookie"];
            expect(cookie).toBeTruthy();
            
            expect(res1.body.message).toBe("You have been logged in!");
            expect(res1.statusCode).toBe(200);
            expect(res1.body.status).toBe("Success");

            // expect(user).toBeTruthy();
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: "2024-05-01T00:00:00Z",
                endDate: "2024-08-30T23:59:59Z",
                term: "Spring 2024",
                classSize: 4
            };

            const res = await request(API_URL).post("/classes/create").set("Cookie", cookie).send(testClass);
            console.log(API_URL);

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe("Success");
            expect(res.body.message).toContain("Class successfully created");

            // Check Database for user student
            const studentData = await prisma.user.findFirst({
                where: { email: "student@example.com" }
            });

            const classData = await prisma.class.findFirst({
                where: { classname: testClass.classname }
            });

            const res2 = await request(API_URL).post("/classes/add-student").set("Cookie", cookie).send({
                classId: classData.classId,
                studentId: studentData.userId
            });

            expect(res2.statusCode).toBe(200);
            expect(res2.body.status).toBe("Success");
            expect(res2.body.message).toContain("Student successfully added to class");

            const groupData = {
                groupName: "Test Group",
                groupSize: 4
            };

            const res3 = await request(API_URL).post("/classes/add-group").set("Cookie", cookie).send({
                classId: classData.classId,
                groupData: groupData
            });

            const groupId = await prisma.group.findFirst({
                where: { groupName: "Test Group" }
            });

            const res4 = await request(API_URL).post("/classes/add-group-member").set("Cookie", cookie).send({
                groupId: groupId.groupId,
                userId: studentData.userId
            });

            const res5 = await request(API_URL).post("/classes/remove-group-member").set("Cookie", cookie).send({
                groupId: groupId.groupId,
                userId: studentData.userId
            });

            expect(res5.statusCode).toBe(200);
            expect(res5.body.status).toBe("Success");
            expect(res5.body.message).toContain("Member successfully removed from group");
        });
    });
});