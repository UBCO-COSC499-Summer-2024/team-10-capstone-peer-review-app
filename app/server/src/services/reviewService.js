/**
 * @module services/reviewService
 * @desc Provides functions for review operations
 */
import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

// Fisher-Yates (Knuth) Shuffle Algorithm for the randomzation of Auto Assign
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
// Review operations

/**
 * @desc Retrieves a review by its ID.
 * @async
 * @param {string} reviewId - The ID of the review.
 * @returns {Promise<Object>} - The review object.
 * @throws {apiError} - If there is an error fetching the review or the review is not found.
 */
const getReviewById = async (reviewId) => {
	try {
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

		// Check if review exists
		if (!review) {
			throw new apiError("Review not found", 404);
		}

		// Add isPeerReview field
		const reviewWithPeerFlag = {
			...review,
			isPeerReview: review.reviewer.role === "STUDENT" // Determine isPeerReview based on reviewer role
		};

		return reviewWithPeerFlag;
	} catch (error) {
		throw new apiError(
			`Failed to retrieve single review: ${error.message}`,
			500
		);
	}
};

/**
 * @desc Retrieves all peer reviews for a submission.
 * @async
 * @param {string} submissionId - The ID of the submission.
 * @returns {Promise<Array>} - An array of peer reviews.
 * @throws {apiError} - If there is an error fetching the peer reviews.
 */
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

/**
 * @desc Retrieves the instructor review for a submission.
 * @async
 * @param {string} submissionId - The ID of the submission.
 * @returns {Promise<Object>} - The instructor review object.
 * @throws {apiError} - If there is an error fetching the instructor review.
 */
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
		throw new apiError("Failed to retrieve instructor review", 500);
	}
};

/**
 * @desc Retrieves all reviews.
 * @async
 * @returns {Promise<Array>} - An array of all reviews.
 * @throws {apiError} - If there is an error fetching the reviews.
 */
const getAllReviews = async () => {
	try {
		const reviews = await prisma.review.findMany({
			include: {
				reviewer: {
					select: {
						userId: true,
						firstname: true,
						lastname: true,
						role: true
					}
				},
				reviewee: {
					select: {
						userId: true,
						firstname: true,
						lastname: true,
						role: true
					}
				},
				submission: {
					include: {
						assignment: {
							include: {
								classes: {
									select: {
										classId: true,
										classname: true
									}
								},
								rubric: {
									select: {
										totalMarks: true
									}
								}
							}
						}
					}
				},
				criterionGrades: true
			}
		});

		return reviews;
	} catch (error) {
		throw new apiError("Failed to retrieve reviews", 500);
	}
};

/**
 * @desc Retrieves all reviews for an assignment.
 * @async
 * @param {string} assignmentId - The ID of the assignment.
 * @returns {Promise<Array>} - An array of reviews.
 * @throws {apiError} - If there is an error fetching the reviews.
 */
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
		throw new apiError(
			`Failed to retrieve reviews for assignment: ${error.message}`,
			500
		);
	}
};

/**
 * @desc Updates a review.
 * @async
 * @param {string} reviewId - The ID of the review.
 * @param {Object} review - The updated review object.
 * @returns {Promise<Object>} - The updated review object.
 * @throws {apiError} - If there is an error updating the review.
 * @throws {apiError} - If the review is not found.
 */
const updateReview = async (reviewId, review) => {
	const { criterionGrades, ...reviewData } = review;

	try {
		// Start a transaction
		const updatedReview = await prisma.$transaction(async (prisma) => {
			// Update the review data
			const updatedReview = await prisma.review.update({
				where: {
					reviewId: reviewId
				},
				data: reviewData
			});

			// Delete existing criterion grades
			await prisma.criterionGrade.deleteMany({
				where: {
					reviewId: reviewId
				}
			});

			// Create new criterion grades
			if (criterionGrades && criterionGrades.length > 0) {
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
		throw new apiError(`Failed to update review: ${error.message}`, 500);
	}
};

/**
 * @desc Deletes a review.
 * @async
 * @param {string} reviewId - The ID of the review.
 * @throws {apiError} - If there is an error deleting the review.
 * @throws {apiError} - If the review is not found.
 * @returns {Promise<void>}
 */
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

/**
 * @desc Creates a new review.
 * @async
 * @param {string} userId - The ID of the user creating the review.
 * @param {Object} review - The review object to be created.
 * @returns {Promise<Object>} - The newly created review object.
 * @throws {apiError} - If there is an error creating the review.
 */
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
		throw new apiError(`Failed to create review: ${error.message}`, 500);
	}
};

/**
 * @desc Assigns random peer reviews for an assignment.
 * @async
 * @param {string} assignmentId - The ID of the assignment.
 * @param {number} reviewsPerStudent - The number of reviews to assign per student.
 * @returns {Promise<Object>} - The number of peer reviews assigned.
 * @throws {apiError} - If there is an error assigning peer reviews.
 */
const assignRandomPeerReviews = async (assignmentId, reviewsPerStudent) => {
	try {
		if (reviewsPerStudent < 1) {
			throw new apiError(
				"Reviews per student must be greater than or equal to 1",
				400
			);
		}
		return await prisma.$transaction(async (prisma) => {
			// Fetch the latest submission for each student
			const latestSubmissions = await prisma.submission.findMany({
				where: { assignmentId: assignmentId },
				orderBy: { createdAt: "desc" },
				distinct: ["submitterId"],
				include: { submitter: true }
			});

			const submissionCount = latestSubmissions.length;

			if (submissionCount < 2) {
				throw new apiError(
					"Not enough submissions to assign peer reviews. At least 2 submissions are required.",
					400
				);
			}

			if (submissionCount <= reviewsPerStudent) {
				throw new apiError(
					`Not enough submissions to assign ${reviewsPerStudent} reviews per student. At least ${reviewsPerStudent + 1} submissions are required.`,
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

			const submittingStudentIds = latestSubmissions.map((s) => s.submitterId);

			// Map to keep track of how many reviews each student has been assigned
			const reviewsAssignedToStudent = new Map(
				submittingStudentIds.map((id) => [
					id,
					existingPeerReviews.filter((er) => er.reviewerId === id).length
				])
			);

			const reviewAssignments = [];

			// Iterate through each submission
			for (const submission of latestSubmissions) {
				const potentialReviewers = shuffleArray(
					submittingStudentIds.filter((id) => id !== submission.submitterId)
				);

				let assignedReviewsForThisSubmission = 0;

				// Assign reviews until the required number is reached
				while (
					assignedReviewsForThisSubmission < reviewsPerStudent &&
					potentialReviewers.length > 0
				) {
					const reviewerId = potentialReviewers.pop();
					const currentReviewsForReviewer =
						reviewsAssignedToStudent.get(reviewerId);

					// Check if this reviewer can be assigned to this submission
					if (currentReviewsForReviewer < reviewsPerStudent) {
						const alreadyAssigned =
							existingPeerReviews.some(
								(er) =>
									er.reviewerId === reviewerId &&
									er.submissionId === submission.submissionId
							) ||
							reviewAssignments.some(
								(ra) =>
									ra.reviewerId === reviewerId &&
									ra.submissionId === submission.submissionId
							);

						if (!alreadyAssigned) {
							// Add this review assignment to our list
							reviewAssignments.push({
								submissionId: submission.submissionId,
								reviewerId: reviewerId,
								revieweeId: submission.submitterId
							});

							// Increment counters
							reviewsAssignedToStudent.set(
								reviewerId,
								currentReviewsForReviewer + 1
							);
							assignedReviewsForThisSubmission++;
						}
					}
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
			} else {
				throw new apiError(
					`Maximum amount of peer reviews per student (${reviewsPerStudent}) has already been achieved for this assignment.`,
					400
				);
			}

			return {
				assignedReviews: reviewAssignments.length,
				totalReviewsPerStudent: Object.fromEntries(reviewsAssignedToStudent)
			};
		});
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError(
				`Failed to assign peer reviews: ${error.message}`,
				500
			);
		}
	}
};

/**
 * @desc Retrieves the details of a review.
 * @async
 * @param {string} reviewId - The ID of the review.
 * @returns {Promise<Object>} - The review details.
 * @throws {apiError} - If there is an error fetching the review details.
 * @throws {apiError} - If the review is not found.
 */
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
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to retrieve review details", 500);
		}
	}
};

/**
 * @desc Retrieves all reviews assigned to a user.
 * @async
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array>} - An array of reviews assigned to the user.
 * @throws {apiError} - If there is an error fetching the reviews.
 */
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
		throw new apiError(
			`Failed to retrieve user reviews: ${error.message}`,
			500
		);
	}
};

/**
 * @desc Retrieves all reviews received by a user.
 * @async
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array>} - An array of reviews received by the user.
 * @throws {apiError} - If there is an error fetching the reviews.
 */
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
