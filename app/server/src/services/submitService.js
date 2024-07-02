import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

// Submit operations

const getStudentSubmission = async (studentId, submissionId) => {
    try {
        const submission = await prisma.submission.findFirst({
            where: {
                studentId: studentId,
                id: submissionId
            }
        });

        return submission;
    } catch (error) {
        throw new apiError("Failed to retrieve submission", 500);
    }
}

const getSubmissionsForAssignment = async (submissionId) => {
    try {
        const assignment = await prisma.assignment.findFirst({
            where: {
                submissionId: submissionId
            }
        });

        return assignment;
    } catch (error) {
        throw new apiError("Failed to retrieve assignment", 500);
    }
}

const createSubmission = async (submission) => {
    try {
        const newSubmission = await prisma.submission.create({
            data: submission
        });

        return newSubmission;
    } catch (error) {
        throw new apiError("Failed to create submission", 500);
    }
};

const updateSubmission = async (submissionId, submission) => {
    try {
        const updatedSubmission = await prisma.submission.update({
            where: {
                id: submissionId
            },
            data: submission
        });

        return updatedSubmission;
    } catch (error) {
        throw new apiError("Failed to update submission", 500);
    }
}

const deleteSubmission = async (submissionId) => {
    try {
        await prisma.submission.delete({
            where: {
                id: submissionId
            }
        });

        return;
    } catch (error) {
        throw new apiError("Failed to delete submission", 500);
    }
}

export default {
    getStudentSubmission,
    getSubmissionsForAssignment,
    createSubmission,
    updateSubmission,
    deleteSubmission
};