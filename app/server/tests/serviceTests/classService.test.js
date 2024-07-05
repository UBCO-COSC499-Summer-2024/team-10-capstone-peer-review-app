// classService.test.js
import { mockDeep, mockReset } from "jest-mock-extended";
import prisma from "../../prisma/prismaClient.js";
import apiError from "../../src/utils/apiError.js";
import classService from "../../src/services/classService.js";

// Mock prisma
jest.mock("../../prisma/prismaClient.js", () => ({
	class: mockDeep(),
	user: mockDeep(),
	userInClass: mockDeep(),
	group: mockDeep()
}));

describe("classService", () => {
	beforeEach(() => {
		mockReset(prisma.class);
		mockReset(prisma.user);
		mockReset(prisma.userInClass);
		mockReset(prisma.group);
		jest.clearAllMocks();
	});

	describe("getInstructorByClass", () => {
		it("should return the instructor for a given class", async () => {
			const classId = 1;
			const mockInstructor = {
				userId: 1,
				email: "instructor@example.com",
				firstname: "John",
				lastname: "Doe"
			};
			prisma.class.findUnique.mockResolvedValue({ instructor: mockInstructor });

			const result = await classService.getInstructorByClass(classId);

			expect(prisma.class.findUnique).toHaveBeenCalledWith({
				where: { classId },
				include: {
					instructor: {
						select: {
							userId: true,
							email: true,
							firstname: true,
							lastname: true
						}
					}
				}
			});
			expect(result).toEqual(mockInstructor);
		});

		it("should throw an error if class is not found", async () => {
			const classId = 1;
			prisma.class.findUnique.mockResolvedValue(null);

			await expect(classService.getInstructorByClass(classId)).rejects.toThrow(
				apiError
			);
		});
	});

	describe("getStudentsByClass", () => {
		it("should return all students for a given class", async () => {
			const classId = 1;
			const mockStudents = [
				{
					userId: 2,
					email: "student1@example.com",
					firstname: "Alice",
					lastname: "Smith"
				},
				{
					userId: 3,
					email: "student2@example.com",
					firstname: "Bob",
					lastname: "Johnson"
				}
			];
			prisma.userInClass.findMany.mockResolvedValue(
				mockStudents.map((student) => ({ user: student }))
			);

			const result = await classService.getStudentsByClass(classId);

			expect(prisma.userInClass.findMany).toHaveBeenCalledWith({
				where: { classId },
				include: {
					user: {
						select: {
							userId: true,
							email: true,
							firstname: true,
							lastname: true
						}
					}
				}
			});
			expect(result).toEqual(mockStudents);
		});
	});

	describe("getClassesByInstructor", () => {
		it("should return all classes for a given instructor", async () => {
			const instructorId = 1;
			const mockClasses = [
				{ classId: 1, classname: "Math 101" },
				{ classId: 2, classname: "Physics 101" }
			];
			prisma.class.findMany.mockResolvedValue(mockClasses);

			const result = await classService.getClassesByInstructor(instructorId);

			expect(prisma.class.findMany).toHaveBeenCalledWith({
				where: { instructorId }
			});
			expect(result).toEqual(mockClasses);
		});
	});

	describe("getAllClasses", () => {
		it("should return all classes", async () => {
			const mockClasses = [
				{ classId: 1, classname: "Math 101" },
				{ classId: 2, classname: "Physics 101" }
			];
			prisma.class.findMany.mockResolvedValue(mockClasses);

			const result = await classService.getAllClasses();

			expect(prisma.class.findMany).toHaveBeenCalledWith({
				include: {
					groups: true,
					usersInClass: true,
					Assignments: true,
					instructor: true,
					EnrollRequest: true
				}
			});
			expect(result).toEqual(mockClasses);
		});
	});

	describe("getClassById", () => {
		it("should return a specific class by id", async () => {
			const classId = 1;
			const mockClass = {
				classId: 1,
				classname: "Math 101",
				instructor: { name: "John Doe" }
			};
			prisma.class.findUnique.mockResolvedValue(mockClass);

			const result = await classService.getClassById(classId);

			expect(prisma.class.findUnique).toHaveBeenCalledWith({
				where: { classId },
				include: { instructor: true }
			});
			expect(result).toEqual(mockClass);
		});

		it("should throw an error if class is not found", async () => {
			const classId = 1;
			prisma.class.findUnique.mockResolvedValue(null);

			await expect(classService.getClassById(classId)).rejects.toThrow(
				apiError
			);
		});
	});

	describe("createClass", () => {
		it("should create a new class", async () => {
			const newClass = {
				classname: "Math 101",
				description: "Introduction to Mathematics",
				startDate: new Date(),
				endDate: new Date(),
				term: "Fall 2023",
				classSize: 30
			};
			const instructorId = 1;
			const mockCreatedClass = { classId: 1, ...newClass, instructorId };
			prisma.class.create.mockResolvedValue(mockCreatedClass);

			const result = await classService.createClass(newClass, instructorId);

			expect(prisma.class.create).toHaveBeenCalledWith({
				data: { ...newClass, instructorId }
			});
			expect(result).toEqual(mockCreatedClass);
		});
	});

	describe("updateClass", () => {
		it("should update an existing class", async () => {
			const classId = 1;
			const updateData = { classname: "Advanced Math 101" };
			const mockUpdatedClass = { classId, ...updateData };
			prisma.class.update.mockResolvedValue(mockUpdatedClass);

			const result = await classService.updateClass(classId, updateData);

			expect(prisma.class.update).toHaveBeenCalledWith({
				where: { classId },
				data: updateData
			});
			expect(result).toEqual(mockUpdatedClass);
		});
	});

	describe("deleteClass", () => {
		it("should delete a class", async () => {
			const classId = 1;
			prisma.class.delete.mockResolvedValue();

			await classService.deleteClass(classId);

			expect(prisma.class.delete).toHaveBeenCalledWith({
				where: { classId }
			});
		});
	});

	describe("addStudentToClass", () => {
		it("should add a student to a class", async () => {
			const classId = 1;
			const studentId = 2;
			const mockClass = { classId, classSize: 30, usersInClass: [] };
			const mockUser = { userId: studentId, email: "student@example.com" };
			prisma.class.findUnique.mockResolvedValue(mockClass);
			prisma.user.findUnique.mockResolvedValue(mockUser);
			prisma.userInClass.create.mockResolvedValue({
				userId: studentId,
				classId: classId
			});

			const result = await classService.addStudentToClass(classId, studentId);

			expect(prisma.class.findUnique).toHaveBeenCalledWith({
				where: { classId },
				include: { usersInClass: true }
			});
			expect(prisma.user.findUnique).toHaveBeenCalledWith({
				where: { userId: studentId }
			});
			expect(prisma.userInClass.create).toHaveBeenCalledWith({
				data: { userId: studentId, classId: classId }
			});
			expect(result).toEqual(mockUser);
		});

		it("should throw an error if adding student exceeds class size", async () => {
			const classId = 1;
			const studentId = 2;
			const mockClass = {
				classId,
				classSize: 1,
				usersInClass: [{ userId: 3 }]
			};
			prisma.class.findUnique.mockResolvedValue(mockClass);

			await expect(
				classService.addStudentToClass(classId, studentId)
			).rejects.toThrow(apiError);
		});
	});

	describe("removeStudentFromClass", () => {
		it("should remove a student from a class", async () => {
			const classId = 1;
			const studentId = 2;
			prisma.userInClass.findUnique.mockResolvedValue({
				userId: studentId,
				classId
			});
			prisma.userInClass.delete.mockResolvedValue();

			await classService.removeStudentFromClass(classId, studentId);

			expect(prisma.userInClass.findUnique).toHaveBeenCalledWith({
				where: { UserInClassId: { userId: studentId, classId } }
			});
			expect(prisma.userInClass.delete).toHaveBeenCalledWith({
				where: { UserInClassId: { userId: studentId, classId } }
			});
		});

		it("should throw an error if student is not enrolled in the class", async () => {
			const classId = 1;
			const studentId = 2;
			prisma.userInClass.findUnique.mockResolvedValue(null);

			await expect(
				classService.removeStudentFromClass(classId, studentId)
			).rejects.toThrow(Error);
		});
	});

	describe("addGroupToClass", () => {
		it("should add a group to a class", async () => {
			const classId = 1;
			const groupData = { groupName: "Group A" };
			const mockClass = { classId };
			const mockGroup = { groupId: 1, ...groupData, classId };
			prisma.class.findUnique.mockResolvedValue(mockClass);
			prisma.group.create.mockResolvedValue(mockGroup);

			const result = await classService.addGroupToClass(classId, groupData);

			expect(prisma.class.findUnique).toHaveBeenCalledWith({
				where: { classId },
				include: { groups: true }
			});
			expect(prisma.group.create).toHaveBeenCalledWith({
				data: { ...groupData, classId },
				include: { students: true, submissions: true }
			});
			expect(result).toEqual(mockGroup);
		});

		it("should throw an error if class is not found", async () => {
			const classId = 1;
			const groupData = { groupName: "Group A" };
			prisma.class.findUnique.mockResolvedValue(null);

			await expect(
				classService.addGroupToClass(classId, groupData)
			).rejects.toThrow(apiError);
		});
	});

	describe("removeGroupFromClass", () => {
		it("should remove a group from a class", async () => {
			const groupId = 1;
			prisma.group.findUnique.mockResolvedValue({ groupId });
			prisma.group.delete.mockResolvedValue();

			await classService.removeGroupFromClass(groupId);

			expect(prisma.group.findUnique).toHaveBeenCalledWith({
				where: { groupId }
			});
			expect(prisma.group.delete).toHaveBeenCalledWith({
				where: { groupId }
			});
		});

		it("should throw an error if group is not found", async () => {
			const groupId = 1;
			prisma.group.findUnique.mockResolvedValue(null);

			await expect(classService.removeGroupFromClass(groupId)).rejects.toThrow(
				apiError
			);
		});
	});

	describe("updateGroupInClass", () => {
		it("should update a group in a class", async () => {
			const groupId = 1;
			const updateData = { groupName: "Updated Group A" };
			const mockGroup = { groupId, ...updateData };
			prisma.group.findUnique.mockResolvedValue({ groupId });
			prisma.group.update.mockResolvedValue(mockGroup);

			const result = await classService.updateGroupInClass(groupId, updateData);

			expect(prisma.group.findUnique).toHaveBeenCalledWith({
				where: { groupId }
			});
			expect(prisma.group.update).toHaveBeenCalledWith({
				where: { groupId },
				data: updateData
			});
			expect(result).toEqual(mockGroup);
		});

		it("should throw an error if group is not found", async () => {
			const groupId = 1;
			const updateData = { groupName: "Updated Group A" };
			prisma.group.findUnique.mockResolvedValue(null);

			await expect(
				classService.updateGroupInClass(groupId, updateData)
			).rejects.toThrow(apiError);
		});
	});

	describe("getGroupInClass", () => {
		it("should get a specific group in a class", async () => {
			const classId = 1;
			const groupId = 1;
			const mockClass = { classId, groups: [{ groupId }] };
			const mockGroup = { groupId, groupName: "Group A" };
			prisma.class.findUnique.mockResolvedValue(mockClass);
			prisma.group.findUnique.mockResolvedValue(mockGroup);

			const result = await classService.getGroupInClass(classId, groupId);

			expect(prisma.class.findUnique).toHaveBeenCalledWith({
				where: { classId },
				include: { groups: true }
			});
			expect(prisma.group.findUnique).toHaveBeenCalledWith({
				where: { groupId, classId }
			});
			expect(result).toEqual(mockGroup);
		});

		it("should throw an error if class or group is not found", async () => {
			const classId = 1;
			const groupId = 1;
			prisma.class.findUnique.mockResolvedValue(null);

			await expect(
				classService.getGroupInClass(classId, groupId)
			).rejects.toThrow(apiError);
		});
	});
});
