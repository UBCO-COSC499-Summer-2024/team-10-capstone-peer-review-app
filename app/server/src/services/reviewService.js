import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

// Review operations
const getPeerReviews = async (submissionId) => {
    try {
        const submission = await prisma.review.findMany({
            where: {
                submissionId: submissionId,
                reviewType: "PEER"
            }, include: {
                rubric: {
                    include: {
                        criteria: true
                    }
                },
                criterionGrades: true
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
            }, include: {
                rubric: {
                    include: {
                        criteria: true
                    }
                },
                criterionGrades: true
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
            }, include: {
                rubric: {
                    include: {
                        criteria: true
                    }
                },
                criterionGrades: true
            }
        });

        return reviews;
    } catch (error) {
        throw new apiError("Failed to retrieve reviews", 500);
    }
}

const createReviewForSubmission = async (userId, submissionId, criterionGrades) => {
    try {
        const duplicateReview = await prisma.review.findFirst({
            where: {
                submissionId: submissionId,
                reviewerId: userId
            }
        });

        if (duplicateReview) {
            throw new apiError("User has already reviewed this submission", 400);
        }

        if (!Array.isArray(criterionGrades)) {
            throw new TypeError('criterionGrades must be an array');
        }

        const user = await prisma.user.findUnique({
            where: {
                userId: userId
            }, include: {
                classes: true
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

        const classA = await prisma.class.findUnique({
            where: {
                classId: assignment.classId
            }
        }); 

        let type;
        if (user.role === "INSTRUCTOR") {
            if (classA.instructorId !== userId) {
                throw new apiError("User not authorized to create review for another class", 403);
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

                const userInClass = await prisma.userInClass.findFirst({
                    where: {
                        userId: userId,
                        classId: assignment.classId
                    }
                });

                if (!userInClass) {
                    throw new apiError("User not in the same class", 403);
                }

                if (assignment.dueDateReview < new Date()) {
                    throw new apiError("Peer Review due date has passed", 403);
                }

                if (assignment.numReviewsRequired > 0) {
                    const numReviews = await prisma.review.count({
                        where: {
                            reviewerId: userId
                        }
                    });

                    if (numReviews >= assignment.numReviewsRequired) {
                        throw new apiError("User has reached the maximum number of reviews to be given", 403);
                    }
                }

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
                rubricId: rubric.rubricId,
                reviewerId: userId,
                revieweeId: submission.submitterId,
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

// Extra operations

const getSubmissionCriteria = async (submissionId) => {
    try {
        const submission = await prisma.submission.findUnique({
            where: {
                submissionId: submissionId
            }
        });

        if (!submission) {
            throw new apiError("Submission not found", 404);
        }

        const assignment = await prisma.assignment.findUnique({
            where: {
                assignmentId: submission.assignmentId
            }, include: {
                rubric: true
            }
        });

        if (!assignment) {
            throw new apiError("Assignment not found", 404);
        }

        const rubric = await prisma.rubric.findUnique({
            where: {
                rubricId: assignment.rubric[0].rubricId
            }, include: {
                criteria: {
                    include: {
                        criterionRatings: true
                    }
                }
            }
        });

        return rubric.criteria;
    } catch (error) {
        throw new apiError("Failed to retrieve submission criteria", 500);
    }
}

const getOpenToReviewAssignment = async (userId, assignmentId) => {
    try {
        const assignment = await prisma.assignment.findUnique({
            where: {
                assignmentId: assignmentId
            }, include: {
                submissions: true
            }
        });

        if (!assignment) {
            throw new apiError("Assignment not found", 404);
        }

        const user = await prisma.user.findUnique({
            where: {
                userId: userId
            }
        });

        if (!user) {
            throw new apiError("User not found", 404);
        }

        if (user.role === "INSTRUCTOR") {
            // if (assignment.isPeerReview) {
            //     if (assignment.dueDateReview < new Date()) {
            //         throw new apiError("Peer Review due date has passed", 403);
            //     }
            // }
            let submissionsLeft = [];
            for (const submission of assignment.submissions) {
                const review = await prisma.review.findFirst({
                    where: {
                        submissionId: submission.submissionId,
                    }
                });

                if (!review) {
                    submissionsLeft.push(submission);
                }

                if (review && review.reviewType !== "INSTRUCTOR") {
                    submissionsLeft.push(submission);
                }
            }

            return submissionsLeft;
        } else if (user.role === "STUDENT") {

            const userInClass = await prisma.userInClass.findFirst({
                where: {
                    userId: userId,
                    classId: assignment.classId
                }
            });

            if (!userInClass) {
                throw new apiError("User not in the same class", 403);
            }

            if (assignment.isPeerReview) {
                if (assignment.dueDateReview < new Date()) {
                    throw new apiError("Peer Review due date has passed", 403);
                }

                const numReviews = await prisma.review.count({
                    where: {
                        assignmentId: assignmentId,
                        reviewerId: userId
                    }
                });

                if (numReviews >= assignment.numReviewsRequired) {
                    throw new apiError("Number of reviews required is fulfilled for this assignment", 403);
                }

                let submissionsLeft = [];
                for (const submission of assignment.submissions) {
                    const review = await prisma.review.findFirst({
                        where: {
                            submissionId: submission.submissionId,
                            reviewerId: userId
                        }
                    });

                    if (!review) {
                        if (submission.submitterId !== userId) {
                            submissionsLeft.push(submission);
                        }
                    }
                }

                return submissionsLeft;
            }

        } else {
            throw new apiError("User have to be an Instructor or Student to review", 403);
        }
    }
    catch (error) {
        throw new apiError("Failed to retrieve open reviews " + error, 500);
    }
}

const getClosedReviewsAssignment = async (userId, assignmentId) => {
    try {
        const assignment = await prisma.assignment.findUnique({
            where: {
                assignmentId: assignmentId
            }
        });

        const user = await prisma.user.findUnique({
            where: {
                userId: userId
            }, include: {
                reviewsDone: true
            }
        });

        if (!user) {
            throw new apiError("User not found", 404);
        }

        if (!assignment) {
            throw new apiError("Assignment not found", 404);
        }
        if (user.role === "INSTRUCTOR") {
            const isInstructor = await prisma.class.findFirst({
                where: {
                    instructorId: userId,
                    classId: assignment.classId
                }
            });

            if (!isInstructor) {
                throw new apiError("User not in the same class", 403);
            }

            const reviews = await prisma.review.findMany({
                where: {
                    assignmentId: assignmentId,
                    reviewType: "INSTRUCTOR"
                }
            });

            return reviews;

        } else if (user.role === "STUDENT") {
            const userInClass = await prisma.userInClass.findFirst({
                where: {
                    userId: userId,
                    classId: assignment.classId
                }
            });

            if (!userInClass) {
                throw new apiError("User not in the same class", 403);
            }

            if (assignment.isPeerReview) {
                if (assignment.dueDateReview < new Date()) {
                    throw new apiError("Peer Review due date has passed", 403);
                }

                const numReviews = await prisma.review.count({
                    where: {
                        assignmentId: assignmentId,
                        reviewerId: userId
                    }
                });

                if (numReviews >= assignment.numReviewsRequired) {
                    throw new apiError("Number of reviews required is fulfilled for this assignment", 403);
                }

                const userInClass = await prisma.userInClass.findFirst({
                    where: {
                        userId: userId,
                        classId: assignment.classId
                    }
                });

                if (!userInClass) {
                    throw new apiError("User not in the same class", 403);
                }

                const reviews = await prisma.review.findMany({
                    where: {
                        assignmentId: assignmentId,
                        reviewType: "PEER"
                    }
                });

                return reviews;

            } else {    
                throw new apiError("This assignment is not meant for peer review", 403);
            }

        } else {
            throw new apiError("User have to be an Instructor or Student to review", 403);
        }

        // const reviews = await prisma.review.findMany({
        //     where: {
        //         assignmentId: assignmentId,
        //         reviewType: "PEER"
        //     }
        // });
    } catch (error) {
        throw new apiError("Failed to retrieve closed reviews "+ error, 500);
    }
}

const getOpenReviewsClass = async (classId) => {
    try {
        const classA = await prisma.class.findUnique({
            where: {
                classId: classId
            }
        });

        if (!classA) {
            throw new apiError("Class not found", 404);
        }

        const reviews = await prisma.review.findMany({
            where: {
                classId: classId,
                reviewType: "PEER"
            }
        });

        return reviews;
    } catch (error) {
        throw new apiError("Failed to retrieve open reviews", 500);
    }
}

const getClosedReviewsClass = async (classId) => {
    try {
        const classA = await prisma.class.findUnique({
            where: {
                classId: classId
            }
        });

        if (!classA) {
            throw new apiError("Class not found", 404);
        }

        const reviews = await prisma.review.findMany({
            where: {
                classId: classId,
                reviewType: "PEER"
            }
        });

        return reviews;
    } catch (error) {
        throw new apiError("Failed to retrieve closed reviews", 500);
    }
}

const getStudentReviews = async (submissionId, studentId) => {
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
                submissionId: submissionId,
                revieweeId: studentId
            }
        });

        return reviews;
    } catch (error) {
        throw new apiError("Failed to retrieve student reviews", 500);
    }
}

const getStudentGradeAsg = async (studentId, assignmentId) => {
    try {
        const assignment = await prisma.assignment.findUnique({
            where: {
                assignmentId: assignmentId
            }, include: {
                rubric: true
            }
        });

        if (!assignment) {
            throw new apiError("Submission not found", 404);
        }

        const user = await prisma.user.findUnique({
            where: {
                userId: studentId
            }
        });

        if (!user) {
            throw new apiError("User not found", 404);
        }

        const submission = await prisma.submission.findFirst({
            where: {
                assignmentId: assignmentId,
                submitterId: studentId
            }
        });

        if (!submission) {
            throw new apiError("Submission not found", 404);
        }

        const instructorReview = await prisma.review.findFirst({
            where: {
                submissionId: submission.submissionId,
                revieweeId: studentId,
                reviewType: "INSTRUCTOR"
            }
        });
        if (!instructorReview) {
            throw new apiError("Instructor review not found", 404);
        }

        let grades = {
            "Instructor": instructorReview.reviewGrade
        };
        if (assignment.isPeerReview) {
            const peerReviews = await prisma.review.findMany({
                where: {
                    submissionId: submission.submissionId,
                    revieweeId: studentId,
                    reviewType: "PEER"
                }
            });

            if (peerReviews.length === 0) {
                throw new apiError("Peer reviews not found", 404);
            }

            const totalPeerGrade = peerReviews.reduce((acc, review) => acc + review.reviewGrade, 0);
            grades["Peer Average"] = totalPeerGrade / peerReviews.length;
            grades["Peer Grade Percent"] = (totalPeerGrade / assignment.rubric[0].totalMarks) * 100;
        }

        grades["Instructor Grade Percent"] = (instructorReview.reviewGrade / assignment.rubric[0].totalMarks) * 100;
        //const totalGrade = reviews.reduce((acc, review) => acc + review.reviewGrade, 0);

        return grades;
    } catch (error) {
        throw new apiError("Failed to retrieve student average grade " + error, 500);
    }
}

const getStudentGradeClass = async (studentId, classId) => {
    try {
        const classA = await prisma.class.findUnique({
            where: {
                classId: classId
            }, include : {
                Assignments: true
            }
        });

        if (!classA) {
            throw new apiError("Class not found", 404);
        }

        const assignments = await prisma.assignment.findMany({
            where: {
                classId: classId
            }
        });

        let grades = {
            "Instructor": 0,
            "Peer Average": 0,
            "Instructor Grade Percent": 0,
            "Peer Grade Percent": 0
        };

        let numAssignments = 0;
        let peerAssignments = 0;
        for (const assignment of assignments) {
            let gradeA = await getStudentGradeAsg(studentId, assignment.assignmentId);
            let instructorGradeA = gradeA["Instructor"];
            let peerGradeA = gradeA["Peer Average"];
            grades["Instructor"] += instructorGradeA;
            grades["Peer Average"] += peerGradeA;
            grades["Instructor Grade Percent"] += gradeA["Instructor Grade Percent"];
            grades["Peer Grade Percent"] += gradeA["Peer Grade Percent"];
            numAssignments++;
            if (assignment.isPeerReview) {
                peerAssignments++;
            }
        }

        console.log(peerAssignments);
        grades["Instructor"] = grades["Instructor"] / numAssignments;
        grades["Instructor Grade Percent"] = grades["Instructor Grade Percent"] / numAssignments;
        grades["Peer Grade Percent"] = grades["Peer Grade Percent"] / peerAssignments;

        return grades;
    } catch (error) {
        throw new apiError("Failed to retrieve student average grade", 500);
    }
}


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
        throw new apiError("Failed to retrieve group reviews", 500);
    }
}

const createGroupReviewRubric = async (userId, assignmentId) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                userId: userId
            }, include: {
                    groups: {
                        include: {
                            students: true
                    },
                classes: true
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
                    throw new apiError("Peer Review due date has passed", 403);
                }

                if (user.groups.length === 0) {
                    throw new apiError("User not in a group for this class", 403);
                }

                let xgroup = null;
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

        const newGroupRubric = await prisma.rubric.create({
            data: {
                title: assignment.assignmentName + " Group Review",
                totalMarks: 100,
                creatorId: assignment.classes[0].instructorId,
                criteria: {
                    create: xgroup.students.map(student => {
                        return {
                            title: student.firstName + " " + student.lastName,
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
                }
            }
        });


        return newGroupRubric;

    } catch (error) {
        throw new apiError("Failed to create group review " + error, 500);
    }
}

const addGroupReview = async (userId, assignmentId, criterionGrades) => {
    try {

        if (!Array.isArray(criterionGrades)) {
            throw new TypeError('criterionGrades must be an array');
        }

        if (criterionGrades.length === 0) {
            throw new apiError("Criterion grades not found", 404);
        }

        for (let i = 0; i < criterionGrades.length; i++) {
            const criterion = await prisma.criterion.findUnique({
                where: {
                    criterionId: criterionGrades[i].criterionId
                }
            });

            if (!criterion) {
                throw new apiError("Criterion not found, please call /createGroupReviewRubric first", 404);
            }
        }


        const user = await prisma.user.findUnique({
            where: {
                userId: userId
            }, include: {
                    groups: {
                        include: {
                            students: true
                    },
                classes: true
                    }
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

        if (!assignment) {
            throw new apiError("Assignment not found", 404);
        }

        if (!rubric) {
            throw new apiError("Rubric not found", 404);
        }
        
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

                type = "PEER";
            } else {
                throw new apiError("This assignment is not meant for peer review", 403);
            }
        } else {
            throw new apiError("User have to be a Student to review", 403);
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
                rubricId: rubric.rubricId,
                reviewerId: userId,
                revieweeId: submission.submitterId,
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
        throw new apiError("Failed to create review " + error, 500);
    }
}

const updateGroupReview = async (groupReview) => {
    try {
        const updatedGroupReview = await prisma.review.update({
            where: {
                reviewId: groupReview.reviewId
            },
            data: groupReview
        });

        return updatedGroupReview;
    } catch (error) {
        throw new apiError("Failed to update group review", 500);
    }
}

const deleteGroupReview = async (reviewId) => {
    try {
        const deletedGroupReview = await prisma.review.delete({
            where: {
                reviewId: reviewId
            }
        });

        return deletedGroupReview;
    } catch (error) {
        throw new apiError("Failed to delete group review", 500);
    }
}

export default {
    getSubmissionCriteria,
    getOpenToReviewAssignment,
    getClosedReviewsAssignment,
    getOpenReviewsClass,
    getClosedReviewsClass,
    getStudentReviews,
    getStudentGradeAsg,
    getStudentGradeClass,
    getGroupReviews,
    createGroupReviewRubric,
    updateGroupReview,
    deleteGroupReview,

    getPeerReviews,
    getInstructorReview,
    getAllReviews,
    createReviewForSubmission,
    updateReview,
    deleteReview,
    addGroupReview
};