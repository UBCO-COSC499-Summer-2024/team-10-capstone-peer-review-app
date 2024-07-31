import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

const createRubricsForAssignment = async (
	creatorId,
	assignmentId,
	rubricData
) => {
	try {
		const assignment = await prisma.assignment.findUnique({
			where: { assignmentId: assignmentId }
		});

		if (!assignment) {
			throw new apiError("Assignment not found", 404);
		}

		// Ensure criteria is always an array
		const criteria = Array.isArray(rubricData.criterion)
			? rubricData.criterion
			: [rubricData.criterion];

		const newRubric = await prisma.rubric.create({
			data: {
				title: rubricData.title,
				description: rubricData.description,
				totalMarks: rubricData.totalMarks,
				classId: rubricData.classId,
				creatorId: creatorId,
				criteria: {
					create: criteria.map((criterion) => ({
						title: criterion.title,
						minMark: criterion.minPoints,
						maxMark: criterion.maxPoints,
						criterionRatings: {
							create: criterion.criterionRatings.map((rating) => ({
								description: rating.text,
								points: rating.points
							}))
						}
					}))
				}
			},
			include: {
				criteria: {
					include: {
						criterionRatings: true
					}
				}
			}
		});

		// Update the assignment with the new rubric
		await prisma.assignment.update({
			where: { assignmentId: assignmentId },
			data: {
				rubricId: newRubric.rubricId
			}
		});

		return newRubric;
	} catch (error) {
		console.error("Error in createRubricsForAssignment:", error);
		throw new apiError(
			`Failed to create rubrics for assignment: ${error.message}`,
			500
		);
	}
};

const getRubricsForAssignment = async (assignmentId) => {
	try {
		const assignment = await prisma.assignment.findUnique({
			where: {
				assignmentId: assignmentId
			},
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
		});

		if (!assignment) {
			throw new apiError("Assignment not found", 404);
		}

		if (!assignment.rubric) {
			throw new apiError("Rubric not found for this assignment", 404);
		}

		return assignment.rubric;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to get rubric for assignment", 500);
		}
	}
};

const getAllRubrics = async () => {
	try {
		const rubrics = await prisma.rubric.findMany();
		return rubrics;
	} catch (error) {
		throw new apiError("Failed to get all rubrics", 500);
	}
};

const getAllRubricsInClass = async (classId) => {
	try {
		const rubrics = await prisma.rubric.findMany({
			where: {
				classId: classId
			}
		});
		return rubrics;
	} catch (error) {
		throw new apiError("Failed to get all rubrics", 500);
	}
};

const getRubricById = async (rubricId) => {
	console.log(rubricId);
	try {
		const rubric = await prisma.rubric.findUnique({
			where: { rubricId },
			include: {
				criteria: {
					include: {
						criterionRatings: true
					}
				}
			}
		});

		if (!rubric) {
			throw new apiError("Rubric not found", 404);
		}

		return rubric;
	} catch (error) {
		throw new apiError("Failed to get rubric by ID", 500);
	}
};

const updateRubricsForAssignment = async (rubricId, updateData) => {
	try {
		const rubric = await prisma.rubric.findUnique({
			where: { rubricId: rubricId },
			include: {
				criteria: {
					include: { criterionRatings: true }
				}
			}
		});

		if (!rubric) {
			throw new apiError("Rubric not found", 404);
		}

		// Update rubric
		const updatedRubric = await prisma.rubric.update({
			where: { rubricId: rubricId },
			data: {
				title: updateData.title,
				description: updateData.description,
				totalMarks: parseInt(updateData.totalMarks, 10),
				criteria: {
					deleteMany: {},
					create: updateData.criteria.map((criterion) => ({
						title: criterion.title,
						minMark: parseInt(criterion.minMark, 10) || 0,
						maxMark:
							parseInt(criterion.maxMark, 10) ||
							criterion.criterionRatings.reduce(
								(sum, rating) => sum + parseInt(rating.points, 10),
								0
							),
						criterionRatings: {
							create: criterion.criterionRatings.map((rating) => ({
								description: rating.description || "",
								points: parseInt(rating.points, 10)
							}))
						}
					}))
				}
			},
			include: {
				criteria: {
					include: { criterionRatings: true }
				}
			}
		});

		return updatedRubric;
	} catch (error) {
		console.error("Error in updateRubricsForAssignment:", error);
		throw new apiError(`Failed to update rubric: ${error.message}`, 500);
	}
};

const deleteRubricsFromAssignment = async (rubricId) => {
	try {
		const rubric = await prisma.rubric.findUnique({
			where: { rubricId: rubricId },
			include: {
				criteria: {
					include: { criterionRatings: true }
				},
				assignments: true
			}
		});

		if (!rubric) {
			throw new apiError("Rubric not found", 404);
		}

		// Delete related records
		await prisma.$transaction(async (prisma) => {
			// // Remove rubric reference from assignments
			// for (const assignment of rubric.assignments) {
			// 	console.log("hoooooo",assignment.assignmentId);
			//     await prisma.assignment.update({
			//         where: { assignmentId: assignment.assignmentId },
			//         data: { rubric: null }
			//     });
			// }

			// Delete criterion ratings
			await prisma.criterionRating.deleteMany({
				where: {
					criterionId: { in: rubric.criteria.map((c) => c.criterionId) }
				}
			});

			// Delete criteria
			await prisma.criterion.deleteMany({
				where: { rubricId: rubricId }
			});

			// Delete the rubric itself
			await prisma.rubric.delete({
				where: { rubricId: rubricId }
			});
		});

		return { message: "Rubric and related data successfully deleted" };
	} catch (error) {
		console.error("Error in deleteRubricsFromAssignment:", error);
		throw new apiError(`Failed to delete rubric: ${error.message}`, 500);
	}
};

// criterion operations
const createCriterionForRubric = async (rubricId, criterionData) => {
	try {
		const rubric = await prisma.rubric.findUnique({
			where: {
				rubricId: rubricId
			},
			include: {
				criteria: true
			}
		});

		if (!rubric) {
			throw new apiError("Rubric not found", 404);
		}
		//console.log(rubric.criteria.reduce((sum, criterion) => sum + criterion.maxMark, 0));

		// Check if maxMark and minMark are positive
		if (
			criterionData.maxMark <= 0 ||
			criterionData.minMark <= 0 ||
			criterionData.maxMark < criterionData.minMark ||
			criterionData.maxMark > rubric.totalMarks
		) {
			throw new apiError(
				"Criterion maxMark and minMark are not set properly",
				400
			);
		}

		let existingMaxMarksSum = 0;
		if (rubric.criteria || rubric.criteria.length > 0) {
			existingMaxMarksSum = rubric.criteria.reduce(
				(sum, criterion) => sum + criterion.maxMark,
				0
			);
			//console.log(existingMaxMarksSum);
		}

		//console.log(`Existing Max Marks Sum: ${existingMaxMarksSum}, New Criterion Max Mark: ${criterionData.maxMark}, Rubric Total Marks: ${rubric.totalMarks}`);
		// Check if the sum of maxMarks including the new criterion exceeds totalMarks
		if (existingMaxMarksSum + criterionData.maxMark > rubric.totalMarks) {
			throw new apiError(
				"maxMarks of criteria exceed the rubric's totalMarks",
				400
			);
		}

		const newCriterion = await prisma.criterion.create({
			data: {
				...criterionData,
				rubricId: rubricId
			}
		});
		return newCriterion;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to create criterion for rubric", 500);
		}
	}
};

const getCriterionForRubric = async (rubricId) => {
	try {
		const rubric = await prisma.rubric.findUnique({
			where: {
				rubricId: rubricId
			},
			include: {
				criteria: true
			}
		});

		if (!rubric) {
			throw new apiError("Rubric not found", 404);
		}

		return rubric.criteria;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to get criteria for rubric", 500);
		}
	}
};

const updateCriterionForRubric = async (criterionId, updateData) => {
	try {
		const criterion = await prisma.criterion.findUnique({
			where: {
				criterionId: criterionId
			}
		});

		const rubric = await prisma.rubric.findUnique({
			where: {
				rubricId: criterion.rubricId
			},
			include: {
				criteria: true
			}
		});

		if (!criterion) {
			throw new apiError("Criterion not found", 404);
		}

		// Check if maxMark and minMark are positive
		if (
			updateData.maxMark <= 0 ||
			updateData.minMark <= 0 ||
			updateData.maxMark < updateData.minMark ||
			updateData.maxMark > rubric.totalMarks
		) {
			throw new apiError(
				"Criterion maxMark and minMark are not set properly",
				400
			);
		}

		let existingMaxMarksSum = 0;
		if (rubric.criteria || rubric.criteria.length > 0) {
			const otherCriteria = rubric.criteria.filter(
				(criterion) => criterion.criterionId !== criterionId
			);
			existingMaxMarksSum = otherCriteria.reduce(
				(sum, criterion) => sum + criterion.maxMark,
				0
			);
			// console.log(existingMaxMarksSum, updateData.maxMark, rubric.totalMarks);
		}
		if (existingMaxMarksSum + updateData.maxMark > rubric.totalMarks) {
			throw new apiError(
				"maxMarks of criteria exceed the rubric's totalMarks",
				400
			);
		}

		const updatedCriterion = await prisma.criterion.update({
			where: {
				criterionId: criterionId
			},
			data: updateData
		});

		return updatedCriterion;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to update criterion for rubric", 500);
		}
	}
};

const deleteCriterionForRubric = async (criterionId) => {
	try {
		const criterion = await prisma.criterion.findUnique({
			where: {
				criterionId: criterionId
			}
		});

		if (!criterion) {
			throw new apiError("Criterion not found", 404);
		}

		await prisma.criterion.delete({
			where: {
				criterionId: criterionId
			}
		});
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to delete criterion for rubric", 500);
		}
	}
};

const createCriterionRating = async (criterionId, ratingData) => {
	try {
		const newRating = await prisma.criterionRating.create({
			data: {
				...ratingData,
				criterionId: criterionId
			}
		});
		return newRating;
	} catch (error) {
		throw new apiError("Failed to create criterion rating", 500);
	}
};

const linkRubricToAssignments = async (rubricId, assignmentIds) => {
	try {
		if (!Array.isArray(assignmentIds) || assignmentIds.length === 0) {
			throw new apiError("Invalid or empty assignment IDs provided", 400);
		}

		const rubric = await prisma.rubric.findUnique({
			where: { rubricId: rubricId }
		});

		if (!rubric) {
			throw new apiError("Rubric not found", 404);
		}

		const updates = await prisma.assignment.updateMany({
			where: {
				assignmentId: {
					in: assignmentIds
				}
			},
			data: {
				rubricId: rubricId
			}
		});

		return {
			message: "Rubric linked to assignments successfully",
			updatedCount: updates.count
		};
	} catch (error) {
		console.error("Error in linkRubricToAssignments:", error);
		throw new apiError(
			`Failed to link rubric to assignments: ${error.message}`,
			500
		);
	}
};

export default {
	createRubricsForAssignment,
	getRubricsForAssignment,
	getAllRubrics,
	getAllRubricsInClass,
	getRubricById,
	updateRubricsForAssignment,
	deleteRubricsFromAssignment,
	createCriterionForRubric,
	getCriterionForRubric,
	updateCriterionForRubric,
	deleteCriterionForRubric,
	createCriterionRating,

	linkRubricToAssignments
};
