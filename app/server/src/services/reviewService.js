import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

// Review operations

const getPeerReviews = async (submissionId) => {
    try {
        const peerReviews = await prisma.review.findMany({
            where: {
                submissionId: submissionId,
                reviewer: {
                    role: "STUDENT"
                }
            },
            include: {
                reviewer: { 
                    select: {
                        firstname: true, 
                        lastname: true,
                    }
                }, 
                criterionGrades: {
                    include: {
                        criterion: {
                            include: { 
                                criterionRatings: true
                            }
                        }
                    }
                },
                submission: {
                    include: {
                        assignment: {
                            include: {
                                rubric: true
                            }
                        }
                    }
                }
            }
        });
        return peerReviews;
    }
    catch (error) {
        throw new apiError("Failed to retrieve peer reviews", 500);
    }
}

const getInstructorReview = async (submissionId) => {
    try {
        const instructorReview = await prisma.review.findFirst({
            where: {
                submissionId: submissionId,
                reviewer: {
                    role: "INSTRUCTOR"
                }
            },
            include: {
                reviewer: { 
                    select: {
                        firstname: true, 
                        lastname: true,
                    }
                }, 
                criterionGrades: {
                    include: {
                        criterion: {
                            include: { 
                                criterionRatings: true
                            }
                        }
                    }
                },
                submission: {
                    include: {
                        assignment: {
                            include: {
                                rubric: true
                            }
                        }
                    }
                }
            }
        }); 

        return instructorReview; // This will be null if no review is found
    } catch (error) {
        console.error("Error in getInstructorReview:", error);
        throw new apiError("Failed to retrieve instructor review", 500);
    }
};



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

const updateReview = async (reviewId, review) => {
    const { criterionGrades, ...reviewData } = review;

    try {
        console.log('Updating review:', reviewId, reviewData);
        // Update the review data
        const updatedReview = await prisma.review.update({
            where: {
                reviewId: reviewId
            },
            data: reviewData
        });

        console.log('Review updated:', updatedReview);

        // Upsert criterion grades
        if (criterionGrades && criterionGrades.length > 0) {
            console.log('Updating criterion grades:', criterionGrades);
            for (const criterionGrade of criterionGrades) {
                try {
                    const updatedGrade = await prisma.criterionGrade.upsert({
                        where: {
                            UniqueCriteronGradePerReview: {
                                criterionId: criterionGrade.criterionId,
                                reviewId: reviewId
                            }
                        },
                        update: {
                            grade: criterionGrade.grade,
                            comment: criterionGrade.comment
                        },
                        create: {
                            reviewId: reviewId,
                            criterionId: criterionGrade.criterionId,
                            grade: criterionGrade.grade,
                            comment: criterionGrade.comment
                        }
                    });
                    console.log('Updated grade:', updatedGrade);
                } catch (gradeError) {
                    console.error('Error updating grade:', gradeError);
                    throw gradeError;
                }
            }
        }

        return updatedReview;
    } catch (error) {
        console.error('Error in updateReview:', error);
        throw new apiError(`Failed to update review: ${error.message}`, 500);
    }
};

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

const createReview = async (userId, review) => {
    try {
        const newReview = await prisma.review.create({
            data: {
                reviewerId: userId,
                ...review,
                criterionGrades: {
                    create: review.criterionGrades.map(cg => ({
                        criterionId: cg.criterionId,
                        grade: cg.grade,
                        comment: cg.comment
                    }))
                }
            },
            include: {
                criterionGrades: true
            }
        });

        // Update the submission's final grade
        await prisma.submission.update({
            where: { submissionId: review.submissionId },
            data: { finalGrade: newReview.reviewGrade }
        });

        return newReview;
    } catch (error) {
        throw new apiError("Failed to create review", 500);
    }
};


const getReviewDetails = async (reviewId) => {
    try {
        const review = await prisma.review.findUnique({
            where: { reviewId },
            include: {
                criterionGrades: {
                    include: {
                        criterion: true
                    }
                },
                submission: {
                    include: {
                        assignment: {
                            include: {
                                rubric: true
                            }
                        }
                    }
                }
            }
        });

        if (!review) {
            throw new apiError("Review not found", 404);
        }

        return review;
    } catch (error) {
        throw new apiError("Failed to retrieve review details", 500);
    }
};

const getUserReviews = async (userId) => {
    try {
        console.log('Fetching reviews for userId:', userId);
        const reviews = await prisma.review.findMany({
            where: {
                reviewerId: userId
            },
            include: {
                submission: {
                    include: {
                        assignment: {
                            include: {
                                classes: true, // Changed from 'class' to 'classes'
                                category: true,
                                rubric: true
                            }
                        }
                    }
                },
                criterionGrades: {
                    include: {
                        criterion: true
                    }
                }
            }
        });
        console.log('Retrieved reviews:', reviews);
        return reviews;
    } catch (error) {
        console.error('Error in getUserReviews:', error);
        throw new apiError(`Failed to retrieve user reviews: ${error.message}`, 500);
    }
};

export default {
    getPeerReviews,
    getInstructorReview,
    getAllReviews,
    updateReview,
    deleteReview,
    createReview,
    getReviewDetails,
    getUserReviews
};