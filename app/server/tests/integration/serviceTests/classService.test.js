import prisma from "../../../prisma/prismaClient";
import classService from "../../../src/services/classService.js";
import authService from "../../../src/services/authService.js";
import apiError from "../../../src/utils/apiError";
import e from "express";

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
    await prisma.user.deleteMany();
    await prisma.$disconnect();
});

beforeEach(async () => {
    await prisma.class.deleteMany();
});

describe("Class Service Integration Tests", () => {
    describe("createClass", () => {
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

            const newClass = await classService.createClass(testClass, user.userId);

            expect(newClass).toBeTruthy();
            expect(newClass.classname).toBe(testClass.classname);
            expect(newClass.description).toBe(testClass.description);
            expect(newClass.startDate).toBe(testClass.startDate);
            expect(newClass.endDate).toBe(testClass.endDate);
            expect(newClass.instructorId).toBe(testClass.instructorId);
        });
    });

    // describe("createClass with invalid data", () => {
    //     it("should not create a new class with invalid data", async () => {
    //         const testClass = {
    //             classname: "Test Class",
    //             description: 5,
    //             startDate: "2024-05-01",
    //             endDate: "2024-08-30",
    //             instructorId: 1
    //         };

    //         try {
    //             await classService.createClass(testClass);
    //         } catch (error) {
    //             expect(error).toBeInstanceOf(apiError);
    //             expect(error.message).toContain("Invalid class data provided.");
    //         }
    //     });
    // });

    // describe("getClasses", () => {
    //     it("should return all classes", async () => {
    //         const testClass = {
    //             //instructorId: user.userId,
    //             classname: "Test Class",
    //             description: "This is a test class",
    //             startDate: "2024-05-01T00:00:00Z",
    //             endDate: "2024-08-30T23:59:59Z",
    //             term: "Spring 2024",
    //             classSize: 4
    //         };

    //         await classService.createClass(testClass);

    //         const classes = await classService.getAllClasses();

    //         expect(classes).toBeTruthy();
    //         expect(classes.length).toBe(1);
    //         expect(classes[0].classname).toBe(testClass.classname);
    //         expect(classes[0].description).toBe(testClass.description);
    //         expect(classes[0].startDate).toBe(testClass.startDate.toISOString());

    //     });
    // });

    // describe("getClassById", () => {
    //     it("should return a class by ID", async () => {
    //         const testClass = {
    //             //instructorId: user.userId,
    //             classname: "Test Class",
    //             description: "This is a test class",
    //             startDate: "2024-05-01T00:00:00Z",
    //             endDate: "2024-08-30T23:59:59Z",
    //             term: "Spring 2024",
    //             classSize: 4
    //         };
    //         const newClass = await classService.createClass(testClass);

    //         const classData = await classService.getClassById(newClass.classId);

    //         expect(classData).toBeTruthy();
    //         expect(classData.classname).toBe(testClass.classname);
    //         expect(classData.description).toBe(testClass.description);
    //         // expect(classData.startDate).toBe(testClass.startDate.toISOString());
    //         // expect(classData.endDate).toBe(testClass.endDate.toISOString());
    //         expect(classData.instructorId).toBe(testClass.instructorId);
    //     });
    // });

    // describe("updateClass", () => {
    //     it("should update a class", async () => {
    //         const testClass = {
    //             //instructorId: user.userId,
    //             classname: "Test Class",
    //             description: "This is a test class",
    //             startDate: "2024-05-01T00:00:00Z",
    //             endDate: "2024-08-30T23:59:59Z",
    //             term: "Spring 2024",
    //             classSize: 4
    //         };

    //         const newClass = await classService.createClass(testClass);

    //         const updatedClass = await classService.updateClass(newClass.classId, {
    //                 //instructorId: user.userId,
    //                 classname: "Updated Test Class",
    //                 description: "This is an updated test class",
    //                 startDate: "2024-05-01T00:00:00Z",
    //                 endDate: "2024-08-30T23:59:59Z",
    //                 term: "Spring 2024",
    //                 classSize: 4
    //         });

    //         expect(updatedClass).toBeTruthy();
    //         expect(updatedClass.classname).toBe("Updated Class");
    //         expect(updatedClass.description).toBe("This is an updated class");
    //     });
//     });

    // describe("deleteClass", () => {
    //     it("should delete a class", async () => {
    //         const testClass = {
    //             //instructorId: user.userId,
    //             classname: "Test Class",
    //             description: "This is a test class",
    //             startDate: "2024-05-01T00:00:00Z",
    //             endDate: "2024-08-30T23:59:59Z",
    //             term: "Spring 2024",
    //             classSize: 4
    //         };

    //         const newClass = await classService.createClass(testClass);

    //         await classService.deleteClass(newClass.classId);

    //         const classes = await classService.getAllClasses();

    //         expect(classes).toBeTruthy();
    //         expect(classes.length).toBe(0);
    //     });
    // });

    // describe("enrollStudent", () => {
    //     it("should enroll a student in a class", async () => {
    //         const testClass = {
    //             //instructorId: user.userId,
    //             classname: "Test Class",
    //             description: "This is a test class",
    //             startDate: "2024-05-01T00:00:00Z",
    //             endDate: "2024-08-30T23:59:59Z",
    //             term: "Spring 2024",
    //             classSize: 4
    //         };

    //         const newClass = await classService.createClass(testClass);

    //         const student = {
    //             userId: 2,
    //             classId: newClass.classId
    //         };

    //         const enrolledStudent = await classService.enrollStudent(student);

    //         expect(enrolledStudent).toBeTruthy();
    //         expect(enrolledStudent.userId).toBe(student.userId);
    //         expect(enrolledStudent.classId).toBe(student.classId);
    //     });
    // });

    // describe("getStudentsInClass", () => {
    //     it("should return all students in a class", async () => {
    //         const testClass = {
    //             //instructorId: user.userId,
    //             classname: "Test Class",
    //             description: "This is a test class",
    //             startDate: "2024-05-01T00:00:00Z",
    //             endDate: "2024-08-30T23:59:59Z",
    //             term: "Spring 2024",
    //             classSize: 4
    //         };

    //         const newClass = await classService.createClass(testClass);

    //         const student = {
    //             userId: 2,
    //             classId: newClass.classId
    //         };

    //         await classService.enrollStudent(student);

    //         const students = await classService.getStudentsByClass(newClass.classId);

    //         expect(students).toBeTruthy();
    //         expect(students.length).toBe(1);
    //         expect(students[0].userId).toBe(student.userId);
    //         expect(students[0].classId).toBe(student.classId);
    //     });
    // });

    // describe("removeStudentFromClass", () => {
    //     it("should remove a student from a class", async () => {
    //         const testClass = {
    //             //instructorId: user.userId,
    //             classname: "Test Class",
    //             description: "This is a test class",
    //             startDate: "2024-05-01T00:00:00Z",
    //             endDate: "2024-08-30T23:59:59Z",
    //             term: "Spring 2024",
    //             classSize: 4
    //         };

    //         const newClass = await classService.createClass(testClass);

    //         const student = {
    //             userId: 2,
    //             classId: newClass.classId
    //         };

    //         await classService.enrollStudent(student);

    //         await classService.removeStudentFromClass(student.userId, student.classId);

    //         const students = await classService.getStudentsByClass(newClass.classId);

    //         expect(students).toBeTruthy();
    //         expect(students.length).toBe(0);
    //     });
    // });

    // describe("getClassesByInstructor", () => {
    //     it("should return all classes by instructor ID", async () => {
    //         const testClass = {
    //             //instructorId: user.userId,
    //             classname: "Test Class",
    //             description: "This is a test class",
    //             startDate: "2024-05-01T00:00:00Z",
    //             endDate: "2024-08-30T23:59:59Z",
    //             term: "Spring 2024",
    //             classSize: 4
    //         };

    //             await classService.createClass(testClass);

    //             const classes = await classService.getClassesByInstructor(instructor.userId);

    //             expect(classes).toBeTruthy();
    //             expect(classes.length).toBe(1);
    //             expect(classes[0].instructorId).toBe(instructor.userId);
    //         });
    //     });
    // });

    // describe("getClassesByStudent", () => {
    //     it("should return all classes by student ID", async () => {
    //         const student = {
    //             userId: 2,
    //             email: "abc@gcom",
    //             password: "123",
    //             firstname: "abc",
    //             lastname: "def",
    //             role: "STUDENT",
    //             isEmailVerified: true,
    //             isRoleActivated: true
    //         };

    //         const testClass = {
    //             //instructorId: user.userId,
    //             classname: "Test Class",
    //             description: "This is a test class",
    //             startDate: "2024-05-01T00:00:00Z",
    //             endDate: "2024-08-30T23:59:59Z",
    //             term: "Spring 2024",
    //             classSize: 4
    //         };

    //         const newClass = await classService.createClass(testClass);

    //         const studentClass = {
    //             userId: student.userId,
    //             classId: newClass.classId
    //         };

    //         await classService.enrollStudent(studentClass);

    //         const classes = await classService.getClassesByStudent(student.userId);

    //         expect(classes).toBeTruthy();
    //         expect(classes.length).toBe(1);
    //         expect(classes[0].classId).toBe(newClass.classId);
    //     });
    // });
});