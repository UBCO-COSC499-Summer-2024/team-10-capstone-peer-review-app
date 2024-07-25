import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

// Review operations
const getReviewById = async (reviewId) => {
	try {
		console.log("Fetching review with ID:", reviewId);
		const review = await prisma.review.findUnique({
			where: {
				reviewId: reviewId // Change this line
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

			return prisma.review.findUnique({
				where: { reviewId: reviewId },
				include: {
					criterionGrades: {
						include: {
							criterion: {
								include: { criterionRatings: true }
							}
						}
					},
					submission: {
						include: {
							assignment: {
								include: {
									rubric: {
										include: {
											rubric: {
												include: {
													criteria: {
														include: { criterionRatings: true }
													}
												}
											}
										}
									}
								}
							}
						}
					},
					reviewer: true,
					reviewee: true
				}
			});
		});
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
		const newReview = await prisma.review.create({
			data: {
				reviewerId: userId,
				...review,
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
								// The rubrics for assignment is called rubric, bit confusing..
								rubric: {
									include: {
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
	updateReview,
	deleteReview,
	createReview,
	getReviewDetails,
	getReviewsAssigned,
	getReviewsReceived,
	getReviewById
};
