import prisma from "../../../prisma/prismaClient.js";
import classService from "../../../src/services/classService.js";
import apiError from "../../../src/utils/apiError.js";
import {
	sendNotificationToRole,
	sendNotificationToUser
} from "../../../src/services/notifsService.js";

// Mock the notification service
jest.mock("../../../src/services/notifsService.js", () => ({
	sendNotificationToRole: jest.fn(),
	sendNotificationToUser: jest.fn()
}));

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("classService Integration Tests", () => {
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
					password: "password123",
					firstname: "Test",
					lastname: "Instructor",
					role: "INSTRUCTOR"
				}
			});

			// Create test student
			testStudent = await prisma.user.create({
				data: {
					email: "student@example.com",
					password: "password123",
					firstname: "Test",
					lastname: "Student",
					role: "STUDENT"
				}
			});

			// Create test class
			testClass = await prisma.class.create({
				data: {
					classname: "Test Class",
					description: "Test Description",
					startDate: new Date(),
					endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
					instructorId: testInstructor.userId,
					classSize: 30
				}
			});

			// Create test group
			testGroup = await prisma.group.create({
				data: {
					classId: testClass.classId,
					groupName: "Test Group",
					groupSize: 5
				}
			});
		});
	});

	describe("getAllClasses", () => {
		it("should retrieve all classes with counts", async () => {
			const classes = await classService.getAllClasses();
			expect(classes).toHaveLength(1);
			expect(classes[0]).toHaveProperty("assignmentCount");
			expect(classes[0]).toHaveProperty("userCount");
		});
	});

	describe("getAllClassesUserIsNotIn", () => {
		it("should retrieve classes user is not in", async () => {
			const classes = await classService.getAllClassesUserIsNotIn(
				testStudent.userId
			);
			expect(classes).toHaveLength(1);
			expect(classes[0]).toHaveProperty("availableSeats");
		});
	});

	describe("getStudentsByClass", () => {
		it("should retrieve students in a class", async () => {
			await prisma.userInClass.create({
				data: {
					userId: testStudent.userId,
					classId: testClass.classId
				}
			});
			const students = await classService.getStudentsByClass(testClass.classId);
			expect(students).toHaveLength(1);
			expect(students[0].userId).toBe(testStudent.userId);
		});
	});

	describe("getInstructorByClass", () => {
		it("should retrieve the instructor of a class", async () => {
			const instructor = await classService.getInstructorByClass(
				testClass.classId
			);
			expect(instructor.userId).toBe(testInstructor.userId);
		});
	});

	describe("createClass", () => {
		it("should create a new class", async () => {
			const newClassData = {
				classname: "New Test Class",
				description: "New Test Description",
				startDate: new Date(),
				endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
				term: "Fall 2023",
				classSize: 25
			};
			const newClass = await classService.createClass(
				newClassData,
				testInstructor.userId
			);
			expect(newClass.classname).toBe(newClassData.classname);
			expect(sendNotificationToRole).toHaveBeenCalled();
		});

		it("should throw an error if start date is after end date", async () => {
			const invalidClassData = {
				classname: "Invalid Class",
				description: "Invalid Description",
				startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
				endDate: new Date(),
				term: "Fall 2023",
				classSize: 25
			};
			await expect(
				classService.createClass(invalidClassData, testInstructor.userId)
			).rejects.toThrow("Invalid class data provided.");
		});
	});

	describe("updateClass", () => {
		it("should update a class", async () => {
			const updateData = { classname: "Updated Class Name" };
			const updatedClass = await classService.updateClass(
				testClass.classId,
				updateData
			);
			expect(updatedClass.classname).toBe(updateData.classname);
			expect(sendNotificationToRole).toHaveBeenCalled();
		});

		it("should throw an error if new class size is less than current number of students", async () => {
			await prisma.userInClass.create({
				data: {
					userId: testStudent.userId,
					classId: testClass.classId
				}
			});
			const updateData = { classSize: 0 };
			await expect(
				classService.updateClass(testClass.classId, updateData)
			).rejects.toThrow(
				"The new class size given is less than the number of students in the class"
			);
		});
	});

	describe("addStudentToClass", () => {
		it("should add a student to a class", async () => {
			await classService.addStudentToClass(
				testClass.classId,
				testStudent.userId
			);
			const students = await classService.getStudentsByClass(testClass.classId);
			expect(students).toHaveLength(1);
			expect(students[0].userId).toBe(testStudent.userId);
			expect(sendNotificationToUser).toHaveBeenCalled();
		});

		it("should throw an error if adding student exceeds class size", async () => {
			await prisma.class.update({
				where: { classId: testClass.classId },
				data: { classSize: 1 }
			});
			await classService.addStudentToClass(
				testClass.classId,
				testStudent.userId
			);
			const anotherStudent = await prisma.user.create({
				data: {
					email: "another@example.com",
					password: "password123",
					firstname: "Another",
					lastname: "Student",
					role: "STUDENT"
				}
			});
			await expect(
				classService.addStudentToClass(testClass.classId, anotherStudent.userId)
			).rejects.toThrow("Adding student exceeds class size");
		});
	});

	describe("addGroupToClass", () => {
		it("should add a group to a class", async () => {
			const groupData = { groupName: "New Group", groupSize: 5 };
			const newGroup = await classService.addGroupToClass(
				testClass.classId,
				groupData
			);
			expect(newGroup.groupName).toBe(groupData.groupName);
			expect(newGroup.classId).toBe(testClass.classId);
		});
	});

	describe("addGroupMember", () => {
		it("should add a student to a group", async () => {
			await classService.addGroupMember(testGroup.groupId, testStudent.userId);
			const groupMembers = await classService.getGroupMembers(
				testGroup.groupId
			);
			expect(groupMembers).toHaveLength(1);
			expect(groupMembers[0].userId).toBe(testStudent.userId);
			expect(sendNotificationToUser).toHaveBeenCalled();
		});

		it("should throw an error if adding student exceeds group size", async () => {
			await prisma.group.update({
				where: { groupId: testGroup.groupId },
				data: { groupSize: 1 }
			});
			await classService.addGroupMember(testGroup.groupId, testStudent.userId);
			const anotherStudent = await prisma.user.create({
				data: {
					email: "another@example.com",
					password: "password123",
					firstname: "Another",
					lastname: "Student",
					role: "STUDENT"
				}
			});
			await expect(
				classService.addGroupMember(testGroup.groupId, anotherStudent.userId)
			).rejects.toThrow("Adding student exceeds group size");
		});
	});

	describe("deleteClass", () => {
		it("should delete a class", async () => {
			await classService.deleteClass(testClass.classId);
			const deletedClass = await prisma.class.findUnique({
				where: { classId: testClass.classId }
			});
			expect(deletedClass).toBeNull();
			expect(sendNotificationToRole).toHaveBeenCalled();
		});
	});

	describe("removeStudentFromClass", () => {
		it("should remove a student from a class", async () => {
			await prisma.userInClass.create({
				data: {
					userId: testStudent.userId,
					classId: testClass.classId
				}
			});
			await classService.removeStudentFromClass(
				testClass.classId,
				testStudent.userId
			);
			const studentsInClass = await classService.getStudentsByClass(
				testClass.classId
			);
			expect(studentsInClass).toHaveLength(0);
			expect(sendNotificationToUser).toHaveBeenCalled();
		});

		it("should throw an error if student is not in the class", async () => {
			await expect(
				classService.removeStudentFromClass(
					testClass.classId,
					testStudent.userId
				)
			).rejects.toThrow("Student is not enrolled in this class.");
		});
	});

	describe("removeGroupFromClass", () => {
		it("should remove a group from a class", async () => {
			await classService.removeGroupFromClass(testGroup.groupId);
			const deletedGroup = await prisma.group.findUnique({
				where: { groupId: testGroup.groupId }
			});
			expect(deletedGroup).toBeNull();
		});

		it("should throw an error if group is not found", async () => {
			await expect(
				classService.removeGroupFromClass("non-existent-id")
			).rejects.toThrow("Group not found");
		});
	});

	describe("updateGroupInClass", () => {
		it("should update a group in a class", async () => {
			const updateData = { groupName: "Updated Group Name" };
			const updatedGroup = await classService.updateGroupInClass(
				testGroup.groupId,
				updateData
			);
			expect(updatedGroup.groupName).toBe(updateData.groupName);
		});

		it("should throw an error if group is not found", async () => {
			await expect(
				classService.updateGroupInClass("non-existent-id", {})
			).rejects.toThrow("Group not found");
		});
	});

	describe("getGroupInClass", () => {
		it("should retrieve a group in a class", async () => {
			const group = await classService.getGroupInClass(
				testClass.classId,
				testGroup.groupId
			);
			expect(group.groupId).toBe(testGroup.groupId);
		});

		it("should throw an error if group is not found", async () => {
			await expect(
				classService.getGroupInClass(testClass.classId, "non-existent-id")
			).rejects.toThrow("Group not found");
		});
	});

	describe("getGroupsInClass", () => {
		it("should retrieve all groups in a class", async () => {
			const groups = await classService.getGroupsInClass(testClass.classId);
			expect(groups).toHaveLength(1);
			expect(groups[0].groupId).toBe(testGroup.groupId);
		});

		it("should throw an error if class is not found", async () => {
			await expect(
				classService.getGroupsInClass("non-existent-id")
			).rejects.toThrow("Class not found");
		});
	});

	describe("removeGroupMember", () => {
		it("should remove a student from a group", async () => {
			await prisma.group.update({
				where: { groupId: testGroup.groupId },
				data: { students: { connect: { userId: testStudent.userId } } }
			});
			await classService.removeGroupMember(
				testGroup.groupId,
				testStudent.userId
			);
			const groupMembers = await classService.getGroupMembers(
				testGroup.groupId
			);
			expect(groupMembers).toHaveLength(0);
			expect(sendNotificationToUser).toHaveBeenCalled();
		});

		it("should throw an error if group or student is not found", async () => {
			await expect(
				classService.removeGroupMember(testGroup.groupId, "non-existent-id")
			).rejects.toThrow("Group not found with student");
		});
	});

	describe("isUserInGroup", () => {
		it("should return true if user is in a group", async () => {
			await prisma.group.update({
				where: { groupId: testGroup.groupId },
				data: { students: { connect: { userId: testStudent.userId } } }
			});
			const isInGroup = await classService.isUserInGroup(
				testClass.classId,
				testStudent.userId
			);
			expect(isInGroup).toBe(true);
		});

		it("should return false if user is not in a group", async () => {
			const isInGroup = await classService.isUserInGroup(
				testClass.classId,
				testStudent.userId
			);
			expect(isInGroup).toBe(false);
		});

		it("should throw an error if class is not found", async () => {
			await expect(
				classService.isUserInGroup("non-existent-id", testStudent.userId)
			).rejects.toThrow("Class not found");
		});
	});

	describe("getStudentsNotInAnyGroup", () => {
		it("should retrieve students not in any group", async () => {
			await prisma.userInClass.create({
				data: {
					userId: testStudent.userId,
					classId: testClass.classId
				}
			});
			const studentsNotInGroup = await classService.getStudentsNotInAnyGroup(
				testClass.classId
			);
			expect(studentsNotInGroup).toHaveLength(1);
			expect(studentsNotInGroup[0].userId).toBe(testStudent.userId);
		});

		it("should return an empty array if all students are in groups", async () => {
			await prisma.userInClass.create({
				data: {
					userId: testStudent.userId,
					classId: testClass.classId
				}
			});
			await prisma.group.update({
				where: { groupId: testGroup.groupId },
				data: { students: { connect: { userId: testStudent.userId } } }
			});
			const studentsNotInGroup = await classService.getStudentsNotInAnyGroup(
				testClass.classId
			);
			expect(studentsNotInGroup).toHaveLength(0);
		});

		it("should throw an error if class is not found", async () => {
			await expect(
				classService.getStudentsNotInAnyGroup("non-existent-id")
			).rejects.toThrow("Class not found");
		});
	});

	describe("getCategoriesByClassId", () => {
		it("should retrieve categories for a class", async () => {
			const category = await prisma.category.create({
				data: {
					name: "Test Category",
					classId: testClass.classId
				}
			});
			const categories = await classService.getCategoriesByClassId(
				testClass.classId
			);
			expect(categories).toHaveLength(1);
			expect(categories[0].name).toBe(category.name);
		});

		it("should return an empty array if no categories exist", async () => {
			const categories = await classService.getCategoriesByClassId(
				testClass.classId
			);
			expect(categories).toHaveLength(0);
		});
	});
});
