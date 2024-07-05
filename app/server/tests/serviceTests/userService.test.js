// userService.test.js
import { mockDeep, mockReset } from "jest-mock-extended";
import prisma from "../../prisma/prismaClient.js";
import apiError from "../../src/utils/apiError.js";
import userService from "../../src/services/userService.js";

// Mock prisma
jest.mock("../../prisma/prismaClient.js", () => ({
	user: mockDeep(),
	class: mockDeep(),
	assignment: mockDeep(),
	group: mockDeep()
}));

describe("userService", () => {
	beforeEach(() => {
		mockReset(prisma.user);
		mockReset(prisma.class);
		mockReset(prisma.assignment);
		mockReset(prisma.group);
		jest.clearAllMocks();
	});

	describe("getAllUsers", () => {
		it("should return all users", async () => {
			const mockUsers = [
				{ id: 1, email: "user1@example.com" },
				{ id: 2, email: "user2@example.com" }
			];
			prisma.user.findMany.mockResolvedValue(mockUsers);

			const result = await userService.getAllUsers();

			expect(prisma.user.findMany).toHaveBeenCalled();
			expect(result).toEqual(mockUsers);
		});

		it("should throw an error if fetching users fails", async () => {
			prisma.user.findMany.mockRejectedValue(new Error("Database error"));

			await expect(userService.getAllUsers()).rejects.toThrow(apiError);
			expect(prisma.user.findMany).toHaveBeenCalled();
		});
	});

	describe("getUsersByRole", () => {
		it("should return users with a specific role", async () => {
			const role = "INSTRUCTOR";
			const mockUsers = [
				{ id: 1, email: "instructor1@example.com", role: "INSTRUCTOR" },
				{ id: 2, email: "instructor2@example.com", role: "INSTRUCTOR" }
			];
			prisma.user.findMany.mockResolvedValue(mockUsers);

			const result = await userService.getUsersByRole(role);

			expect(prisma.user.findMany).toHaveBeenCalledWith({
				where: { role: role }
			});
			expect(result).toEqual(mockUsers);
		});

		it("should throw an error if fetching users by role fails", async () => {
			const role = "INSTRUCTOR";
			prisma.user.findMany.mockRejectedValue(new Error("Database error"));

			await expect(userService.getUsersByRole(role)).rejects.toThrow(apiError);
			expect(prisma.user.findMany).toHaveBeenCalledWith({
				where: { role: role }
			});
		});
	});

	describe("getUserClasses", () => {
		it("should return classes for a student user", async () => {
			const userId = 1;
			const mockUser = {
				userId: 1,
				role: "STUDENT",
				classes: [{ classId: 1 }, { classId: 2 }]
			};
			const mockClasses = [
				{ classId: 1, name: "Class 1" },
				{ classId: 2, name: "Class 2" }
			];

			prisma.user.findUnique.mockResolvedValue(mockUser);
			prisma.class.findMany.mockResolvedValue(mockClasses);

			const result = await userService.getUserClasses(userId);

			expect(prisma.user.findUnique).toHaveBeenCalledWith({
				where: { userId: userId },
				include: { classes: true, classesInstructed: true }
			});
			expect(prisma.class.findMany).toHaveBeenCalledWith({
				where: { classId: { in: [1, 2] } },
				include: { instructor: true }
			});
			expect(result).toEqual(mockClasses);
		});

		it("should return classes for an instructor user", async () => {
			const userId = 2;
			const mockUser = {
				userId: 2,
				role: "INSTRUCTOR",
				classesInstructed: [{ classId: 3 }, { classId: 4 }]
			};
			const mockClasses = [
				{ classId: 3, name: "Class 3" },
				{ classId: 4, name: "Class 4" }
			];

			prisma.user.findUnique.mockResolvedValue(mockUser);
			prisma.class.findMany.mockResolvedValue(mockClasses);

			const result = await userService.getUserClasses(userId);

			expect(prisma.user.findUnique).toHaveBeenCalledWith({
				where: { userId: userId },
				include: { classes: true, classesInstructed: true }
			});
			expect(prisma.class.findMany).toHaveBeenCalledWith({
				where: { classId: { in: [3, 4] } },
				include: { instructor: true }
			});
			expect(result).toEqual(mockClasses);
		});

		it("should throw an error if user is not found", async () => {
			const userId = 999;
			prisma.user.findUnique.mockResolvedValue(null);

			await expect(userService.getUserClasses(userId)).rejects.toThrow(
				apiError
			);
			expect(prisma.user.findUnique).toHaveBeenCalledWith({
				where: { userId: userId },
				include: { classes: true, classesInstructed: true }
			});
		});
	});

	describe("getUserAssignments", () => {
		it("should return assignments for a student user", async () => {
			const userId = 1;
			const mockUser = {
				userId: 1,
				role: "STUDENT",
				classes: [{ classId: 1 }, { classId: 2 }]
			};
			const mockAssignments = [
				{ assignmentId: 1, name: "Assignment 1", classId: 1 },
				{ assignmentId: 2, name: "Assignment 2", classId: 2 }
			];

			prisma.user.findUnique.mockResolvedValue(mockUser);
			prisma.assignment.findMany.mockResolvedValue(mockAssignments);

			const result = await userService.getUserAssignments(userId);

			expect(prisma.user.findUnique).toHaveBeenCalledWith({
				where: { userId: userId },
				include: { classes: true, classesInstructed: true }
			});
			expect(prisma.assignment.findMany).toHaveBeenCalledWith({
				where: { classId: { in: [1, 2] } },
				include: { classes: true }
			});
			expect(result).toEqual(mockAssignments);
		});

		it("should throw an error if user is not found", async () => {
			const userId = 999;
			prisma.user.findUnique.mockResolvedValue(null);

			await expect(userService.getUserAssignments(userId)).rejects.toThrow(
				apiError
			);
			expect(prisma.user.findUnique).toHaveBeenCalledWith({
				where: { userId: userId },
				include: { classes: true, classesInstructed: true }
			});
		});
	});

	describe("getGroups", () => {
		it("should return groups for a user", async () => {
			const userId = 1;
			const mockGroups = [
				{
					groupId: 1,
					name: "Group 1",
					students: [{ userId: 1 }, { userId: 2 }]
				},
				{
					groupId: 2,
					name: "Group 2",
					students: [{ userId: 1 }, { userId: 3 }]
				}
			];

			prisma.group.findMany.mockResolvedValue(mockGroups);

			const result = await userService.getGroups(userId);

			expect(prisma.group.findMany).toHaveBeenCalledWith({
				include: { students: true },
				where: { students: { some: { userId: userId } } }
			});
			expect(result).toEqual(mockGroups);
		});

		it("should throw an error if fetching groups fails", async () => {
			const userId = 1;
			prisma.group.findMany.mockRejectedValue(new Error("Database error"));

			await expect(userService.getGroups(userId)).rejects.toThrow(apiError);
			expect(prisma.group.findMany).toHaveBeenCalledWith({
				include: { students: true },
				where: { students: { some: { userId: userId } } }
			});
		});
	});
});
