import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

// Grading operations

const getGrades = async (studentId) => {
    try {
        const grades = await prisma.grade.findMany({
            where: {
                studentId: studentId
            }
        });

        return grades;
    } catch (error) {
        throw new apiError("Failed to retrieve grades", 500);
    }
};

const getSubmissionGrade = async (submissionId) => {
    try {
        const grade = await prisma.grade.findFirst({
            where: {
                submissionId: submissionId
            }
        });

        return grade;
    } catch (error) {
        throw new apiError("Failed to retrieve grade", 500);
    }
}

const createGrade = async (grade) => {
    try {
        const newGrade = await prisma.grade.create({
            data: grade
        });

        return newGrade;
    } catch (error) {
        throw new apiError("Failed to create grade", 500);
    }
};

const updateGrade = async (gradeId, grade) => {
    try {
        const updatedGrade = await prisma.grade.update({
            where: {
                id: gradeId
            },
            data: grade
        });

        return updatedGrade;
    } catch (error) {
        throw new apiError("Failed to update grade", 500);
    }
}

const deleteGrade = async (gradeId) => {
    try {
        const deletedGrade = await prisma.grade.delete({
            where: {
                id: gradeId
            }
        });

        return deletedGrade;
    } catch (error) {
        throw new apiError("Failed to delete grade", 500);
    }
}

export default {
    getGrades,
    getSubmissionGrade,
    createGrade,
    updateGrade,
    deleteGrade
};