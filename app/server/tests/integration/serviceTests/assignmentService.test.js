import prisma from "../../../prisma/prismaClient";
import assignService from "../../../src/services/assignService.js";
import apiError from "../../../src/utils/apiError";

describe('Assignment Service', () => {
    describe('addAssignmentToClass', () => {
        it('should add an assignment to a class successfully', async () => {
            prisma.class.findUnique.mockResolvedValue({
                classId: 'class1',
                startDate: new Date('2023-01-01'),
                endDate: new Date('2023-12-31'),
                Assignments: []
            });
            prisma.assignment.create.mockResolvedValue({
                assignmentId: 'assignment1',
                assignmentFilePath: 'path/to/assignment',
                dueDate: new Date('2023-06-01')
            });
            prisma.category.update.mockResolvedValue({});

            const assignmentData = {
                assignmentFilePath: 'path/to/assignment',
                dueDate: new Date('2023-06-01').toISOString()
            };
            const result = await assignmentService.addAssignmentToClass('class1', 'category1', assignmentData);

            expect(result).toHaveProperty('assignmentId', 'assignment1');
            expect(prisma.class.findUnique).toHaveBeenCalledWith({
                where: { classId: 'class1' },
                include: { Assignments: true }
            });
        });

        it('should throw an error if class not found', async () => {
            prisma.class.findUnique.mockResolvedValue(null);

            await expect(assignmentService.addAssignmentToClass('class1', 'category1', {}))
                .rejects.toThrow(new apiError("Class not found", 404));
        });
    });

    describe('removeAssignmentFromClass', () => {
        it('should remove an assignment from a class successfully', async () => {
            prisma.assignment.findUnique.mockResolvedValue({
                assignmentId: 'assignment1'
            });
            prisma.assignment.delete.mockResolvedValue({});

            await expect(assignmentService.removeAssignmentFromClass('assignment1')).resolves.not.toThrow();
        });

        it('should throw an error if assignment not found', async () => {
            prisma.assignment.findUnique.mockResolvedValue(null);

            await expect(assignmentService.removeAssignmentFromClass('assignment1'))
                .rejects.toThrow(new apiError("Assignment not found", 404));
        });
    });
});