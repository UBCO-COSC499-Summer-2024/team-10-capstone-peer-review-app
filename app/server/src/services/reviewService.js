import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

// Review operations
const getReviewById = async (reviewId) => {
    try {
        console.log("Fetching review with ID:", reviewId);
        const review = await prisma.review.findUnique({
            where: {
                reviewId: reviewId
            },
            include: {
                reviewer: {
                    select: {
                        firstname: true,
                        lastname: true
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
                                classes: true,
                                category: true,
                                rubric: {
                                    include: {
                                        criteria: {
                                            include: {
                                                criterionRatings: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

		if (!review) {
			console.log("No review found for ID:", reviewId);
			throw new apiError("Review not found", 404);
		}

		// Add isPeerReview field
		const reviewWithPeerFlag = {
			...review,
			isPeerReview: review.reviewer.role === "STUDENT" // Determine isPeerReview based on reviewer role
		};

		return reviewWithPeerFlag;
	} catch (error) {
		console.error("Error in getReviewById:", error);
		throw new apiError(
			`Failed to retrieve single review: ${error.message}`,
			500
		);
	}
};

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
                        lastname: true
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
    } catch (error) {
        throw new apiError("Failed to retrieve peer reviews", 500);
    }
};

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
						lastname: true
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
};

const getReviewsForAssignment = async (assignmentId) => {
	try {
		const reviews = await prisma.review.findMany({
			where: {
				submission: {
					assignmentId: assignmentId
				}
			},
			include: {
				reviewer: {
					select: {
						firstname: true,
						lastname: true,
						role: true
					}
				},
				reviewee: {
					select: {
						firstname: true,
						lastname: true
					}
				},
				criterionGrades: {
					include: {
						criterion: true
					}
				},
				submission: {
					include: {
						assignment: true
					}
				}
			}
		});

		return reviews;
	} catch (error) {
		console.error("Error in getReviewsForAssignment:", error);
		throw new apiError(
			`Failed to retrieve reviews for assignment: ${error.message}`,
			500
		);
	}
};

const updateReview = async (reviewId, review) => {
	const { criterionGrades, ...reviewData } = review;

	try {
		console.log("Updating review:", reviewId, reviewData);

		// Start a transaction
		const updatedReview = await prisma.$transaction(async (prisma) => {
			// Update the review data
			const updatedReview = await prisma.review.update({
				where: {
					reviewId: reviewId
				},
				data: reviewData
			});

			console.log("Review updated:", updatedReview);

			// Delete existing criterion grades
			await prisma.criterionGrade.deleteMany({
				where: {
					reviewId: reviewId
				}
			});

			// Create new criterion grades
			if (criterionGrades && criterionGrades.length > 0) {
				console.log("Creating new criterion grades:", criterionGrades);
				await prisma.criterionGrade.createMany({
					data: criterionGrades.map((cg) => ({
						reviewId: reviewId,
						criterionId: cg.criterionId,
						grade: cg.grade,
						comment: cg.comment
					}))
				});
			}

			// Fetch the updated review with new criterion grades
			return prisma.review.findUnique({
				where: {
					reviewId: reviewId
				},
				include: {
					criterionGrades: true
					// Include other relations as needed
				}
			});
		});

		return updatedReview;
	} catch (error) {
		console.error("Error in updateReview:", error);
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
};

const createReview = async (userId, review) => {
    try {
        // Remove isGroup from the review object
        const { isGroup, ...reviewData } = review;

        const newReview = await prisma.review.create({
            data: {
                reviewerId: userId,
                ...reviewData,
                criterionGrades: {
                    create: review.criterionGrades.map((cg) => ({
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
        console.error("Error in createReview:", error);
        throw new apiError(`Failed to create review: ${error.message}`, 500);
    }
};

const assignRandomPeerReviews = async (assignmentId, reviewsPerStudent) => {
	try {
		return await prisma.$transaction(async (prisma) => {
			// Fetch the latest submission for each student
			const latestSubmissions = await prisma.submission.findMany({
				where: { assignmentId: assignmentId },
				orderBy: { createdAt: "desc" },
				distinct: ["submitterId"],
				include: { submitter: true }
			});

			const submissionCount = latestSubmissions.length;

			// Check if there are enough submissions for the required number of reviews
			if (submissionCount < 2 || submissionCount <= reviewsPerStudent) {
				throw new apiError(
					`Not enough submissions to assign ${reviewsPerStudent} peer reviews per student. At least ${reviewsPerStudent + 1} submissions are required.`,
					400
				);
			}

			// Fetch existing peer reviews for this assignment
			const existingPeerReviews = await prisma.review.findMany({
				where: {
					submission: { assignmentId: assignmentId },
					isPeerReview: true
				},
				select: {
					reviewerId: true,
					submissionId: true
				}
			});

			const submittingStudentIds = new Set(
				latestSubmissions.map((s) => s.submitterId)
			);
			const shuffledSubmissions = latestSubmissions.sort(
				() => 0.5 - Math.random()
			);
			const reviewAssignments = [];

			for (const reviewerId of submittingStudentIds) {
				let assignedPeerReviews = existingPeerReviews.filter(
					(r) => r.reviewerId === reviewerId
				).length;
				let attempts = 0;
				const maxAttempts = submissionCount * 2; // Arbitrary limit to prevent infinite loops

				while (
					assignedPeerReviews < reviewsPerStudent &&
					attempts < maxAttempts
				) {
					for (
						let j = 0;
						j < shuffledSubmissions.length &&
						assignedPeerReviews < reviewsPerStudent;
						j++
					) {
						const submissionToReview = shuffledSubmissions[j];
						if (
							submissionToReview.submitterId !== reviewerId &&
							!reviewAssignments.some(
								(ra) =>
									ra.reviewerId === reviewerId &&
									ra.submissionId === submissionToReview.submissionId
							) &&
							!existingPeerReviews.some(
								(er) =>
									er.reviewerId === reviewerId &&
									er.submissionId === submissionToReview.submissionId
							)
						) {
							reviewAssignments.push({
								submissionId: submissionToReview.submissionId,
								reviewerId: reviewerId,
								revieweeId: submissionToReview.submitterId
							});
							assignedPeerReviews++;
						}
					}
					attempts++;
				}

				if (assignedPeerReviews < reviewsPerStudent) {
					throw new apiError(
						`Unable to assign ${reviewsPerStudent} unique peer reviews for each student. Please reduce the number of reviews per student or wait for more submissions.`,
						400
					);
				}
			}

			// Create new reviews in bulk
			if (reviewAssignments.length > 0) {
				await prisma.review.createMany({
					data: reviewAssignments.map((ra) => ({
						...ra,
						isPeerReview: true,
						reviewGrade: 0
					}))
				});
			}

			return {
				assignedReviews: reviewAssignments.length
			};
		});
	} catch (error) {
		console.error("Error in assignRandomPeerReviews:", error);
		throw new apiError("Failed to assign peer reviews: " + error.message, 500);
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

const getReviewsAssigned = async (userId) => {
    try {
        const reviewsAssigned = await prisma.review.findMany({
            where: {
                reviewerId: userId
            },
            include: {
                submission: {
                    include: {
                        assignment: {
                            include: {
                                classes: true,
                                category: true,
                                rubric: {
                                    include: {
                                        criteria: {
                                            include: {
                                                criterionRatings: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                reviewer: true,
                reviewee: true,
                criterionGrades: {
                    include: {
                        criterion: true
                    }
                }
            }
        });
        return reviewsAssigned;
    } catch (error) {
        console.error("Error in getReviewsAssigned:", error);
        throw new apiError(
            `Failed to retrieve user reviews: ${error.message}`,
            500
        );
    }
};

const getReviewsReceived = async (userId) => {
    try {
        const reviewsReceived = await prisma.review.findMany({
            where: {
                revieweeId: userId
            },
            include: {
                submission: {
                    include: {
                        assignment: {
                            include: {
                                classes: true,
                                category: true,
                                rubric: {
                                    include: {
                                        criteria: {
                                            include: {
                                                criterionRatings: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                reviewer: true,
                reviewee: true,
                criterionGrades: {
                    include: {
                        criterion: true
                    }
                }
            }
        });
        return reviewsReceived;
    } catch (error) {
        console.error("Error in getReviewsReceived:", error);
        throw new apiError(
            `Failed to retrieve user reviews: ${error.message}`,
            500
        );
    }
};

export default {
	getPeerReviews,
	getInstructorReview,
	getAllReviews,
	getReviewsForAssignment,
	updateReview,
	deleteReview,
	createReview,
	assignRandomPeerReviews,
	getReviewDetails,
	getReviewsAssigned,
	getReviewsReceived,
	getReviewById
};
