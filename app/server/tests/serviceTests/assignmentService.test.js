// assignService.test.js
import { mockDeep, mockReset } from "jest-mock-extended";
import prisma from "../../prisma/prismaClient.js";
import apiError from "../../src/utils/apiError.js";
import assignService from "../../src/services/assignService.js";

// Mock prisma
jest.mock("../../prisma/prismaClient.js", () => ({
	class: mockDeep(),
	assignment: mockDeep()
}));

describe("assignService", () => {
	beforeEach(() => {
		mockReset(prisma.class);
		mockReset(prisma.assignment);
		jest.clearAllMocks();
	});

	describe("addAssignmentToClass", () => {
		it("should add an assignment to a class", async () => {
			const classId = 1;
			const assignmentData = {
				title: "Test Assignment",
				description: "This is a test assignment",
				dueDate: new Date("2024-12-31")
			};

			prisma.class.findUnique.mockResolvedValue({
				classId: 1,
				startDate: new Date("2024-01-01"),
				endDate: new Date("2024-12-31"),
				Assignments: []
			});

			prisma.assignment.create.mockResolvedValue({
				assignmentId: 1,
				...assignmentData,
				classId
			});

			const result = await assignService.addAssignmentToClass(
				classId,
				assignmentData
			);

			expect(prisma.class.findUnique).toHaveBeenCalledWith({
				where: { classId },
				include: { Assignments: true }
			});
			expect(prisma.assignment.create).toHaveBeenCalledWith({
				data: { ...assignmentData, classId }
			});
			expect(result).toEqual({
				assignmentId: 1,
				...assignmentData,
				classId
			});
		});

		it("should throw an error if the class is not found", async () => {
			prisma.class.findUnique.mockResolvedValue(null);

			await expect(assignService.addAssignmentToClass(1, {})).rejects.toThrow(
				apiError
			);
		});

		it("should throw an error if the due date is outside the class duration", async () => {
			prisma.class.findUnique.mockResolvedValue({
				classId: 1,
				startDate: new Date("2024-01-01"),
				endDate: new Date("2024-12-31"),
				Assignments: []
			});

			const assignmentData = {
				title: "Test Assignment",
				description: "This is a test assignment",
				dueDate: new Date("2025-01-01")
			};

			await expect(
				assignService.addAssignmentToClass(1, assignmentData)
			).rejects.toThrow(apiError);
		});
	});

	describe("removeAssignmentFromClass", () => {
		it("should remove an assignment from a class", async () => {
			const assignmentId = 1;

			prisma.assignment.findUnique.mockResolvedValue({ assignmentId });
			prisma.assignment.delete.mockResolvedValue();

			await assignService.removeAssignmentFromClass(assignmentId);

			expect(prisma.assignment.findUnique).toHaveBeenCalledWith({
				where: { assignmentId }
			});
			expect(prisma.assignment.delete).toHaveBeenCalledWith({
				where: { assignmentId }
			});
		});

		it("should throw an error if the assignment is not found", async () => {
			prisma.assignment.findUnique.mockResolvedValue(null);

			await expect(assignService.removeAssignmentFromClass(1)).rejects.toThrow(
				apiError
			);
		});
	});

	describe("updateAssignmentInClass", () => {
		it("should update an assignment in a class", async () => {
			const classId = 1;
			const assignmentId = 1;
			const updateData = { title: "Updated Assignment" };

			prisma.class.findUnique.mockResolvedValue({ classId });
			prisma.assignment.findUnique.mockResolvedValue({ assignmentId });
			prisma.assignment.update.mockResolvedValue({
				assignmentId,
				...updateData
			});

			const result = await assignService.updateAssignmentInClass(
				classId,
				assignmentId,
				updateData
			);

			expect(prisma.class.findUnique).toHaveBeenCalledWith({
				where: { classId },
				include: { Assignments: true }
			});
			expect(prisma.assignment.findUnique).toHaveBeenCalledWith({
				where: { assignmentId }
			});
			expect(prisma.assignment.update).toHaveBeenCalledWith({
				where: { assignmentId },
				data: updateData
			});
			expect(result).toEqual({
				assignmentId,
				...updateData
			});
		});

		it("should throw an error if the class is not found", async () => {
			prisma.class.findUnique.mockResolvedValue(null);

			await expect(
				assignService.updateAssignmentInClass(1, 1, {})
			).rejects.toThrow(apiError);
		});

		it("should throw an error if the assignment is not found", async () => {
			prisma.class.findUnique.mockResolvedValue({ classId: 1 });
			prisma.assignment.findUnique.mockResolvedValue(null);

			await expect(
				assignService.updateAssignmentInClass(1, 1, {})
			).rejects.toThrow(apiError);
		});
	});

	describe("getAssignmentInClass", () => {
		it("should get an assignment in a class", async () => {
			const classId = 1;
			const assignmentId = 1;
			const assignment = { assignmentId, title: "Test Assignment" };

			prisma.class.findUnique.mockResolvedValue({ classId });
			prisma.assignment.findUnique.mockResolvedValue(assignment);

			const result = await assignService.getAssignmentInClass(
				classId,
				assignmentId
			);

			expect(prisma.class.findUnique).toHaveBeenCalledWith({
				where: { classId },
				include: { Assignments: true }
			});
			expect(prisma.assignment.findUnique).toHaveBeenCalledWith({
				where: { assignmentId }
			});
			expect(result).toEqual(assignment);
		});

		it("should throw an error if the class is not found", async () => {
			prisma.class.findUnique.mockResolvedValue(null);

			await expect(assignService.getAssignmentInClass(1, 1)).rejects.toThrow(
				apiError
			);
		});

		it("should throw an error if the assignment is not found", async () => {
			prisma.class.findUnique.mockResolvedValue({ classId: 1 });
			prisma.assignment.findUnique.mockResolvedValue(null);

			await expect(assignService.getAssignmentInClass(1, 1)).rejects.toThrow(
				apiError
			);
		});
	});

	describe("getAllAssignmentsByClassId", () => {
		it("should get all assignments for a class", async () => {
			const classId = 1;
			const assignments = [
				{ assignmentId: 1, title: "Assignment 1" },
				{ assignmentId: 2, title: "Assignment 2" }
			];

			prisma.class.findUnique.mockResolvedValue({
				classId,
				Assignments: assignments
			});

			const result = await assignService.getAllAssignmentsByClassId(classId);

			expect(prisma.class.findUnique).toHaveBeenCalledWith({
				where: { classId },
				include: { Assignments: true }
			});
			expect(result).toEqual(assignments);
		});

		it("should throw an error if the class is not found", async () => {
			prisma.class.findUnique.mockResolvedValue(null);

			await expect(assignService.getAllAssignmentsByClassId(1)).rejects.toThrow(
				apiError
			);
		});
	});
});
