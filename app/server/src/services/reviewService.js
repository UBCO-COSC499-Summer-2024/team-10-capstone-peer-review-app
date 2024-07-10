import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

// Review operations

const getPeerReviews = async (submissionId) => {
    try {
        const submission = await prisma.review.findMany({
            where: {
                submissionId: submissionId,
                reviewType: "PEER"
            }
        });

        return submission;
    }
    catch (error) {
        throw new apiError("Failed to retrieve submission", 500);
    }
}

const getInstructorReview = async (submissionId) => {
    try {
        const submission = await prisma.review.findMany({
            where: {
                submissionId: submissionId,
                reviewType: "INSTRUCTOR"
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

const createReviewForSubmission = async (userId, submissionId, criterionGrades) => {
    try {
        if (!Array.isArray(criterionGrades)) {
            throw new TypeError('criterionGrades must be an array');
        }

        const user = await prisma.user.findUnique({
            where: {
                userId: userId
            }
        });

        const submission = await prisma.submission.findUnique({
            where: {
                submissionId: submissionId
            }, include: {
                assignment: true
            }
        });

        const assignment = await prisma.assignment.findUnique({
            where: {
                assignmentId: submission.assignmentId
            }, include: {
                rubric: true
            }
        });

        const rubric = await prisma.rubric.findUnique({
            where: {
                rubricId: assignment.rubric[0].rubricId
            }, include: {
                criteria: true
            }
        });


        if (!user) {
            throw new apiError("User not found", 404);
        }

        if (!submission) {
            throw new apiError("Submission not found", 404);
        }

        if (!assignment) {
            throw new apiError("Assignment not found", 404);
        }

        if (!rubric) {
            throw new apiError("Rubric not found", 404);
        }

        //console.log("Rubric: ", assignment.rubric[0].rubricId);

        let type;
        if (user.role === "INSTRUCTOR") {
            const classA = await prisma.class.findUnique({
                where: {
                    classId: assignment.classId
                }
            }); 

            if (classA.instructorId !== userId) {
                throw new apiError("User not authorized to create review for this submission", 403);
            }
            type = "INSTRUCTOR";
        } else if (user.role === "STUDENT") {
            if (assignment.isPeerReview) {
                if (submission.submitterId === userId) {
                    throw new apiError("User not authorized to create review for their own submission", 403);
                }

                // if (submission.submitterGroupId) {
                //     throw new apiError("User not authorized to create review for group submission", 403);
                // }
                // add maxReviews, and same class dueDate check

                type = "PEER";
            } else {
                throw new apiError("This assignment is not meant for peer review", 403);
            }
        } else {
            throw new apiError("User have to be an Instructor or Student to review", 403);
        }

        if (criterionGrades.length !== rubric.criteria.length) {
            throw new apiError("Invalid number of criterion grades", 400);
        }
        
        const reviewGrade = criterionGrades.reduce((acc, criterion) => acc + criterion.grade, 0);

        if (reviewGrade > rubric.totalMarks) {
            throw new apiError("Review grade exceeds total grade", 400);
        }

        const newReview = await prisma.review.create({
            data: {
                assignmentId: submission.assignmentId,
                submissionId: submissionId,
                reviewerId: userId,
                revieweeId: submission.submitterId,
                reviewGrade: reviewGrade,
                reviewType: type,
                criterionGrades: {
                    create: criterionGrades
                }
            }, include: {
                criterionGrades: true
            }
        });

        return newReview;
    } catch (error) {
        throw new apiError("Failed to create review " + error, 500);
    }
}

const updateReview = async (userId, reviewId, criterionGrades) => {
    try {
        if (!userId) {
            throw new apiError("User not found", 404);
        }

        if (!reviewId) {
            throw new apiError("Review not found", 404);
        }

        if (!criterionGrades) {
            throw new apiError("Criterion grades not found", 404);
        }

        // console.log("CriterionGrades: ", criterionGrades.length);

        // if (criterionGrades === undefined || criterionGrades.length === 0) {
        //     throw new apiError("Criterion grades not found", 404);
        // }

        const review = await prisma.review.findUnique({
            where: {
                reviewId: reviewId
            }, 
            include: {
                criterionGrades: true
            }
        });

        //console.log("Review: ", review);

        if (criterionGrades.length !== review.criterionGrades.length) {
            throw new apiError("Invalid number of criterion grades", 400);
        }

        if (userId !== review.reviewerId) {
            throw new apiError("User not authorized to update review", 403);
        }

        const assignment = await prisma.assignment.findUnique({
            where: {
                assignmentId: review.assignmentId
            }, include: {
                rubric: true
            }
        });

        const rubric = await prisma.rubric.findUnique({
            where: {
                rubricId: assignment.rubric[0].rubricId
            }
        });

        if (!Array.isArray(criterionGrades)) {
            throw new TypeError('criterionGrades must be an array');
        }

        const reviewGrade = criterionGrades.reduce((acc, criterion) => acc + criterion.grade, 0);

        if (reviewGrade > rubric.totalMarks) {
            throw new apiError("Review grade exceeds total grade", 400);
        }

        console.log("Review Grade: ", reviewGrade);
        console.log("Rubric Grade: ", rubric.totalGrade);

        const updatedReview = await prisma.review.update({
            where: {
                reviewId: reviewId
            },
            data: {
                criterionGrades: {
                    deleteMany: {
                        reviewId: reviewId
                    },
                    create: criterionGrades
                },
                reviewGrade: reviewGrade,
            },
            include: {
                criterionGrades: true
            }
        });

        return updatedReview;
    } catch (error) {
        throw new apiError("Failed to update review " + error, 500);
    }
}

const deleteReview = async (userId, reviewId) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                userId: userId
            }
        }); 
        
        if (!user) {
            throw new apiError("User not found", 404);
        }

        const review = await prisma.review.findUnique({
            where: {
                reviewId: reviewId
            } 
        });

        if (!review) {
            throw new apiError("Review not found", 404);
        }

        if (user.role !== "INSTRUCTOR") {
            if (userId !== review.reviewerId) {
                throw new apiError("User not authorized to delete review", 403);
            }
        }

        await prisma.criterionGrade.deleteMany({
            where: {
                reviewId: reviewId
            }
        });

        await prisma.review.delete({
            where: {
                reviewId: reviewId
            }
        });

        return;
    } catch (error) {
        throw new apiError("Failed to delete review " + error, 500);
    }
}

export default {
    getPeerReviews,
    getInstructorReview,
    getAllReviews,
    createReviewForSubmission,
    updateReview,
    deleteReview
};