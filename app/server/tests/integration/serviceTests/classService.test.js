import prisma from "../../../prisma/prismaClient";
import classService from "../../../src/services/classService.js";
import apiError from "../../../src/utils/apiError";


beforeAll(async () => {
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.$disconnect();
});

beforeEach(async () => {
    await prisma.class.deleteMany();
});

describe("Class Service Integration Tests", () => {
    describe("createClass", () => {
        it("should create a new class", async () => {
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                instructorId: 1
            };

            const newClass = await classService.createClass(testClass);

            expect(newClass).toBeTruthy();
            expect(newClass.classname).toBe(testClass.classname);
            expect(newClass.description).toBe(testClass.description);
            expect(newClass.startDate).toBe(testClass.startDate.toISOString());
            expect(newClass.endDate).toBe(testClass.endDate.toISOString());
            expect(newClass.instructorId).toBe(testClass.instructorId);
        });
    });

    describe("createClass with invalid data", () => {
        it("should not create a new class with invalid data", async () => {
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
                instructorId: 1
            };

            try {
                await classService.createClass(testClass);
            } catch (error) {
                expect(error).toBeInstanceOf(apiError);
                expect(error.message).toContain("Invalid class data provided.");
            }
        });
    });

    describe("getClasses", () => {
        it("should return all classes", async () => {
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                instructorId: 1
            };

            await classService.createClass(testClass);

            const classes = await classService.getClasses();

            expect(classes).toBeTruthy();
            expect(classes.length).toBe(1);
            expect(classes[0].classname).toBe(testClass.classname);
            expect(classes[0].description).toBe(testClass.description);
            expect(classes[0].startDate).toBe(testClass.startDate.toISOString());

        });
    });

    describe("getClassById", () => {
        it("should return a class by ID", async () => {
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                instructorId: 1
            };

            const newClass = await classService.createClass(testClass);

            const classData = await classService.getClassById(newClass.classId);

            expect(classData).toBeTruthy();
            expect(classData.classname).toBe(testClass.classname);
            expect(classData.description).toBe(testClass.description);
            expect(classData.startDate).toBe(testClass.startDate.toISOString());
            expect(classData.endDate).toBe(testClass.endDate.toISOString());
            expect(classData.instructorId).toBe(testClass.instructorId);
        });
    });

    describe("updateClass", () => {
        it("should update a class", async () => {
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                instructorId: 1
            };

            const newClass = await classService.createClass(testClass);

            const updatedClass = await classService.updateClass(newClass.classId, {
                classname: "Updated Class",
                description: "This is an updated class",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                instructorId: 1
            });

            expect(updatedClass).toBeTruthy();
            expect(updatedClass.classname).toBe("Updated Class");
            expect(updatedClass.description).toBe("This is an updated class");
        });
    });

    describe("deleteClass", () => {
        it("should delete a class", async () => {
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                instructorId: 1
            };

            const newClass = await classService.createClass(testClass);

            await classService.deleteClass(newClass.classId);

            const classes = await classService.getClasses();

            expect(classes).toBeTruthy();
            expect(classes.length).toBe(0);
        });
    });

    describe("enrollStudent", () => {
        it("should enroll a student in a class", async () => {
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                instructorId: 1
            };

            const newClass = await classService.createClass(testClass);

            const student = {
                userId: 2,
                classId: newClass.classId
            };

            const enrolledStudent = await classService.enrollStudent(student);

            expect(enrolledStudent).toBeTruthy();
            expect(enrolledStudent.userId).toBe(student.userId);
            expect(enrolledStudent.classId).toBe(student.classId);
        });
    });

    describe("getStudentsInClass", () => {
        it("should return all students in a class", async () => {
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                instructorId: 1
            };

            const newClass = await classService.createClass(testClass);

            const student = {
                userId: 2,
                classId: newClass.classId
            };

            await classService.enrollStudent(student);

            const students = await classService.getStudentsInClass(newClass.classId);

            expect(students).toBeTruthy();
            expect(students.length).toBe(1);
            expect(students[0].userId).toBe(student.userId);
            expect(students[0].classId).toBe(student.classId);
        });
    });

    describe("removeStudentFromClass", () => {
        it("should remove a student from a class", async () => {
            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                instructorId: 1
            };

            const newClass = await classService.createClass(testClass);

            const student = {
                userId: 2,
                classId: newClass.classId
            };

            await classService.enrollStudent(student);

            await classService.removeStudentFromClass(student.userId, student.classId);

            const students = await classService.getStudentsInClass(newClass.classId);

            expect(students).toBeTruthy();
            expect(students.length).toBe(0);
        });
    });

    describe("getClassesByInstructor", () => {
        it("should return all classes by instructor ID", async () => {
            const instructor = {
                userId: 1,
                email: "abc@gcom",
                password: "123",
                firstname: "abc",
                lastname: "def",
                role: "INSTRUCTOR",
                isEmailVerified: true,
                isRoleActivated: true
            };

                const testClass = {
                    classname: "Test Class",
                    description: "This is a test class",
                    startDate: new Date(),
                    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                    instructorId: instructor.userId
                };

                await classService.createClass(testClass);

                const classes = await classService.getClassesByInstructor(instructor.userId);

                expect(classes).toBeTruthy();
                expect(classes.length).toBe(1);
                expect(classes[0].instructorId).toBe(instructor.userId);
            });
        });
    });

    describe("getClassesByStudent", () => {
        it("should return all classes by student ID", async () => {
            const student = {
                userId: 2,
                email: "abc@gcom",
                password: "123",
                firstname: "abc",
                lastname: "def",
                role: "STUDENT",
                isEmailVerified: true,
                isRoleActivated: true
            };

            const testClass = {
                classname: "Test Class",
                description: "This is a test class",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                instructorId: 1
            };

            const newClass = await classService.createClass(testClass);

            const studentClass = {
                userId: student.userId,
                classId: newClass.classId
            };

            await classService.enrollStudent(studentClass);

            const classes = await classService.getClassesByStudent(student.userId);

            expect(classes).toBeTruthy();
            expect(classes.length).toBe(1);
            expect(classes[0].classId).toBe(newClass.classId);
        });
    });

    describe("getStudentsInAllClasses", () => {
        it("should return all students in all classes", async () => {
            const student1 = {
                userId: 2,
                email: "abc@gcom",
                password: "123",
                firstname: "abc",
                lastname: "def",
                role: "STUDENT",
                isEmailVerified: true,
                isRoleActivated: true
            };

            const student2 = {
                userId: 3,
                email: "def@gcom",
                password: "123",
                firstname: "def",
                lastname: "ghi",
                role: "STUDENT",
                isEmailVerified: true,
                isRoleActivated: true
            };

            const testClass1 = {
                classname: "Test Class 1",
                description: "This is a test class",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                instructorId: 1
            };

            const testClass2 = {
                classname: "Test Class 2",
                description: "This is another test class",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                instructorId: 1
            };

            const newClass1 = await classService.createClass(testClass1);
            const newClass2 = await classService.createClass(testClass2);

            const studentClass1 = {
                userId: student1.userId,
                classId: newClass1.classId
            };

            const studentClass2 = {
                userId: student2.userId,
                classId: newClass2.classId
            };

            await classService.enrollStudent(studentClass1);
            await classService.enrollStudent(studentClass2);

            const students = await classService.getStudentsInAllClasses();

            expect(students).toBeTruthy();
            expect(students.length).toBe(2);
            expect(students[0].userId).toBe(student1.userId);
            expect(students[1].userId).toBe(student2.userId);
        });
    });
