import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

// Grading operations

const getGrades = async (studentId) => {
    try {
        const grades = await prisma.criterionGrade.findMany({
            where: {
                studentId: studentId
            }
        });

        return grades;
    } catch (error) {
        if (error instanceof apiError) {
			throw error;
		}
        throw new apiError("Failed to retrieve grades", 500);
    }
};

const getSubmissionGrade = async (submissionId) => {
    try {

        const submission = await prisma.review.findMany({
            where: {
                submissionId: submissionId
            }, include: {
                reviewer: true,
                criterionGrades: true
            }
        });

        let grade = 0;
        if (submission.reviewer.role === "INSTRUCTOR") {
            criterionGrades = submission.criterionGrades;
            criterionGrades.forEach(criterionGrade => {
                grade += criterionGrade.grade;
            });
        }

        // const grade = await prisma.criterionGrade.findFirst({
        //     where: {
        //         submissionId: submissionId
        //     }
        // });

        return grade;
    } catch (error) {
        if (error instanceof apiError) {
			throw error;
		}
        throw new apiError("Failed to retrieve grade", 500);
    }
}

const createGrade = async (grade) => {
    try {
        const newGrade = await prisma.criterionGrade.create({
            data: grade
        });

        return newGrade;
    } catch (error) {
        if (error instanceof apiError) {
			throw error;
		}
        throw new apiError("Failed to create grade", 500);
    }
};

const updateGrade = async (gradeId, grade) => {
    try {
        const updatedGrade = await prisma.criterionGrade.update({
            where: {
                criterionGradeId: gradeId
            },
            data: grade
        });

        return updatedGrade;
    } catch (error) {
        if (error instanceof apiError) {
			throw error;
		}
        throw new apiError("Failed to update grade", 500);
    }
}

const deleteGrade = async (gradeId) => {
    try {
        const deletedGrade = await prisma.criterionGrade.delete({
            where: {
                criterionGradeId: gradeId
            }
        });

        return deletedGrade;
    } catch (error) {
        if (error instanceof apiError) {
			throw error;
		}
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