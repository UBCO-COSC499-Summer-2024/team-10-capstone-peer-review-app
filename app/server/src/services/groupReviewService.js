import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

const getGroupReviews = async (submissionId) => {
    try {
        const submission = await prisma.submission.findUnique({
            where: {
                submissionId: submissionId
            }
        });

        if (!submission) {
            throw new apiError("Submission not found", 404);
        }

        const reviews = await prisma.review.findMany({
            where: {
                submissionId: submissionId
            }
        });

        return reviews;
    } catch (error) {
        if (error instanceof apiError) {
			throw error;
		}
        if (error instanceof apiError) {
            throw error;
        }
        throw new apiError("Failed to retrieve group reviews", 500);
    }
}

const createGroupReviewRubric = async (userId, assignmentId) => {
    try {
        let xgroup = null;
        const user = await prisma.user.findUnique({
            where: {
                userId: userId
            }, include: {
                classes: true,
                groups: {
                    include: {
                        students: true
                    }
                }
            }
        });

        const assignment = await prisma.assignment.findUnique({
            where: {
                assignmentId: assignmentId
            }, include: {
                classes: true,
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

        if (!assignment) {
            throw new apiError("Assignment not found", 404);
        }

        if (!assignment.isGroupReview) {
            throw new apiError("This assignment is not meant for group review", 403);
        }

        if (!rubric) {
            throw new apiError("Rubric not found", 404);
        }

        if (assignment.dueDateGroupReview <= assignment.dueDate) {
            throw new apiError("Group review due date should be after assignment due date", 403);
        }

        //let type;
        if (user.role === "STUDENT") {
            if (assignment.isGroupReview) {
                // if (submission.submitterGroupId) {
                //     throw new apiError("User not authorized to create review for group submission", 403);
                // }

                const userInClass = await prisma.userInClass.findFirst({
                    where: {
                        userId: userId,
                        classId: assignment.classId
                    }
                });

                if (!userInClass) {
                    throw new apiError("User not in the same class", 403);
                }

                if (assignment.dueDateGroupReview < new Date()) {
                    throw new apiError("Group Review due date has passed", 403);
                }

                if (user.groups.length === 0) {
                    throw new apiError("User not in a group for this class", 403);
                }

                
                user.groups.forEach(group => { 
                    if (group.classId === assignment.classId) {
                        xgroup = group;
                    }
                });

                if (!xgroup) {
                    throw new apiError("User not in a group for this class", 403);
                }

                if (xgroup.students.length < 2) {
                    throw new apiError("Group must have at least 2 students", 403);
                }


            } else {
                throw new apiError("This assignment is not meant for group review", 403);
            }
        } else {
            throw new apiError("User have to be a Student to review", 403);
        }

        if (!xgroup || xgroup.students.length < 2) {
            throw new apiError("Group error", 403);
        }

        // xgroup.students.map(student => {
        //     console.log(student);
        // });

        const newGroupRubric = await prisma.rubric.create({
            data: {
                title: assignment.title + " " + xgroup.groupName + " Group Review",
                totalMarks: 100,
                creatorId: assignment.classes.instructorId,
                classId: assignment.classId,
                isGroupReviewRubric: true,
                groupId: xgroup.groupId,
                criteria: {
                    create: xgroup.students.map(student => {
                        return {
                            title: student.firstname + " " + student.lastname,
                            userId: student.userId,
                            maxMark: 100,
                            minMark: 0,
                            // criterionRatings: {
                            //     create: rubric.criteria[0].criterionRatings.map(rating => {
                            //         return {
                            //             points: rating.rating,
                            //             description: rating.description
                            //         }
                            //     })
                            // }
                        }
                    })
                },
                assignments: {
                    connect: {
                        assignmentId: assignmentId,
                    }
                }
            }, include: {
                criteria: true
            }
        });


        return newGroupRubric;

    } catch (error) {
        if (error instanceof apiError) {
			throw error;
		}
        if (error instanceof apiError) {
            throw error;
        }
        throw new apiError("Failed to create group review " + error, 500);
    }
}

const addGroupReview = async (userId, assignmentId, criterionGrades) => {
    try {

        const user = await prisma.user.findUnique({
            where: {
                userId: userId
            }, include: {
                    groups: {
                        include: {
                            students: true,
                            rubric: {
                                where: {
                                    isGroupReviewRubric: true,
                                }, include: {
                                    criteria: true,
                                    assignments: true
                                }
                            }
                        }
                    }
            }
        });

        const assignment = await prisma.assignment.findUnique({
            where: {
                assignmentId: assignmentId
            }, include: {
                rubric: true
            }
        });


        if (!user) {
            throw new apiError("User not found", 404);
        }

        if (!assignment) {
            throw new apiError("Assignment not found", 404);
        }

        if (!Array.isArray(criterionGrades)) {
            throw new TypeError('criterionGrades must be an array');
        }

        if (criterionGrades.length === 0) {
            throw new apiError("Criterion grades not found", 404);
        }

        let sum = 0;
        let xgroup = null;
        for (let i = 0; i < criterionGrades.length; i++) {
            const criterion = await prisma.criterion.findUnique({
                where: {
                    criterionId: criterionGrades[i].criterionId
                }, include: {
                    rubric: true
                }
            });


            if (criterion.rubric.isGroupReviewRubric === false) {
                throw new apiError("Criterion Invalid", 404);
            }

            
            user.groups.forEach(group => { 
                if (group.classId === assignment.classId) {
                    xgroup = group;
                }
            });

            if (criterion.rubric.groupId !== xgroup.groupId) {
                throw new apiError("Rubric and group don't match", 404);
            }

            // check for criterion grades match with the userId
            sum += criterionGrades[i].grade;

            if (!criterion) {
                throw new apiError("Criterion not found, please check or call /createGroupReviewRubric first", 404);
            }
        }

        if (sum !== 100) {
            throw new apiError("Total grade not equal to 100", 400);
        }
        
        let type;
        if (user.role === "STUDENT") {
            if (assignment.isGroupReview) {

                // if (submission.submitterGroupId) {
                //     throw new apiError("User not authorized to create review for group submission", 403);
                // }

                const userInClass = await prisma.userInClass.findFirst({
                    where: {
                        userId: userId,
                        classId: assignment.classId
                    }
                });

                if (!userInClass) {
                    throw new apiError("User not in the same class", 403);
                }

                if (assignment.dueDateGroupReview < new Date()) {
                    throw new apiError("Group Review due date has passed", 403);
                }

                type = "GROUP";
            } else {
                throw new apiError("This assignment is not meant for group review", 403);
            }
        } else {
            throw new apiError("User have to be a Student to review", 403);
        }

        if (criterionGrades.length !== xgroup.students.length) {
            throw new apiError("Invalid number of criterion grades", 400);
        }
        
        const reviewGrade = criterionGrades.reduce((acc, criterion) => acc + criterion.grade, 0);

        // if (reviewGrade !== rubric.totalMarks) {
        //     throw new apiError("Review grade not equal to total grade", 400);
        // }


        const newReview = await prisma.review.create({
            data: {
                assignmentId: assignmentId,
                rubricId: xgroup.rubric[0].rubricId,
                reviewerId: userId,
                isGroup: true,
                groupId: xgroup.groupId,
                reviewGrade: reviewGrade,
                reviewType: type,
                criterionGrades: {
                    create: criterionGrades
                }
            }, include: {
                rubric: {
                    include: {
                        criteria: true
                    }
                },
                criterionGrades: true
            }
        });

        return newReview;
    } catch (error) {
        if (error instanceof apiError) {
			throw error;
		}
        if (error instanceof apiError) {
            throw error;
        }
        throw new apiError("Failed to create review " + error, 500);
    }
}

const updateGroupReview = async (userId, reviewId, criterionGrades) => {
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


        if (!Array.isArray(criterionGrades)) {
            throw new TypeError('criterionGrades must be an array');
        }

        const reviewGrade = criterionGrades.reduce((acc, criterion) => acc + criterion.grade, 0);

        if (reviewGrade !== 100) {
            throw new apiError("Review grade exceeds total grade", 400);
        }

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
                rubric: {
                    include: {
                        criteria: true
                    }
                },
                criterionGrades: true
            }
        });

        return updatedReview;
    } catch (error) {
        if (error instanceof apiError) {
            throw error;
        }
        throw new apiError("Failed to update review " + error, 500);
    }
}

const deleteGroupReview = async (userId, reviewId) => {
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
        if (error instanceof apiError) {
			throw error;
		}
        throw new apiError("Failed to delete review " + error, 500);
    }
}


export default {
    addGroupReview,
    getGroupReviews,
    createGroupReviewRubric,
    updateGroupReview,
    deleteGroupReview,
};