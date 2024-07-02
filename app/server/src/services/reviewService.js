import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

// Review operations

const getStudentReview = async (studentId, submissionId) => {
    try {
        const submission = await prisma.submission.findFirst({
            where: {
                studentId: studentId,
                id: submissionId
            }
        });

        return submission;
    }
    catch (error) {
        throw new apiError("Failed to retrieve submission", 500);
    }
}


const getInstructorReview = async (instructorId, submissionId) => {
    try {
        const submission = await prisma.submission.findFirst({
            where: {
                instructorId: instructorId,
                id: submissionId
            }
        });

        return submission;
    } catch (error) {
        throw new apiError("Failed to retrieve submission", 500);
    }
}

const getAllReviews = async (submissionId) => {
    try {
        const reviews = await prisma.review.findMany({
            where: {
                submissionId: submissionId
            }
        });

        return reviews;
    } catch (error) {
        throw new apiError("Failed to retrieve reviews", 500);
    }
}

const createReview = async (review) => {
    try {
        const newReview = await prisma.review.create({
            data: review
        });

        return newReview;
    } catch (error) {
        throw new apiError("Failed to create review", 500);
    }
}

const updateReview = async (reviewId, review) => {
    try {
        const updatedReview = await prisma.review.update({
            where: {
                id: reviewId
            },
            data: review
        });

        return updatedReview;
    } catch (error) {
        throw new apiError("Failed to update review", 500);
    }
}

const deleteReview = async (reviewId) => {
    try {
        await prisma.review.delete({
            where: {
                id: reviewId
            }
        });

        return;
    } catch (error) {
        throw new apiError("Failed to delete review", 500);
    }
}

export default {
    getStudentReview,
    getInstructorReview,
    getAllReviews,
    createReview,
    updateReview,
    deleteReview
};