import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

// Review operations

const getPeerReviews = async (submissionId) => {
    try {
        const submission = await prisma.review.findFirst({
            where: {
                submissionId: submissionId
            }, include: {
                reviewer: true
            }
        });

        if (submission.reviewer.role === "STUDENT") {
            return submission;
        }

        return;
    }
    catch (error) {
        throw new apiError("Failed to retrieve submission", 500);
    }
}


const getInstructorReview = async (submissionId) => {
    try {
        const submission = await prisma.review.findFirst({
            where: {
                submissionId: submissionId
            }, include: {
                reviewer: true
            }
        });

        if (submission.reviewer.role === "INSTRUCTOR") {
            return submission;
        }

        return;
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

const createReview = async (userId, review) => {
    try {
        const newReview = await prisma.review.create({
            reviewerId: userId,
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
                reviewId: reviewId
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
                reviewId: reviewId
            }
        });

        return;
    } catch (error) {
        throw new apiError("Failed to delete review", 500);
    }
}

export default {
    getPeerReviews,
    getInstructorReview,
    getAllReviews,
    createReview,
    updateReview,
    deleteReview
};