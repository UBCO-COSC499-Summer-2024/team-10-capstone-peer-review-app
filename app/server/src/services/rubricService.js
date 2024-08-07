/**
 * @module services/rubricService
 * @fileoverview Rubric service for handling rubric related operations
 */
import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

/**
 * @async
 * @function createRubricsForAssignment
 * @desc Creates a rubric for an assignment
 * @param {number} creatorId - The ID of the creator
 * @param {number} assignmentId - The ID of the assignment
 * @param {Object} rubricData - The rubric data
 * @returns {Promise<Object>} - The created rubric
 * @throws {apiError} - If failed to create rubric
 * @throws {apiError} - If assignment not found
 */
const createRubricsForAssignment = async (
	creatorId,
	assignmentId,
	rubricData
) => {
	try {
		const assignment = await prisma.assignment.findUnique({
			where: { assignmentId: assignmentId }
		});

		// Check if assignment exists
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
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to create rubrics for assignment", 500);
		}
	}
};

/**
 * @async
 * @function getRubricsForAssignment
 * @desc Gets the rubric for an assignment
 * @param {number} assignmentId - The ID of the assignment
 * @returns {Promise<Object>} - The rubric for the assignment
 * @throws {apiError} - If failed to get rubric for assignment
 * @throws {apiError} - If assignment not found
 * @throws {apiError} - If rubric not found for assignment
 */
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

		// Check if assignment exists
		if (!assignment) {
			throw new apiError("Assignment not found", 404);
		}

		// Check if rubric exists for the assignment
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

/**
 * @async
 * @function getAllRubrics
 * @desc Retrieves all rubrics
 * @returns {Promise<Array>} - An array of rubrics
 * @throws {apiError} - If failed to get all rubrics
 */
const getAllRubrics = async () => {
	try {
		const rubrics = await prisma.rubric.findMany();
		return rubrics;
	} catch (error) {
		throw new apiError("Failed to get all rubrics", 500);
	}
};

/**
 * @async
 * @function getAllRubricsInClass
 * @desc Retrieves all rubrics in a class
 * @param {number} classId - The ID of the class
 * @returns {Promise<Array>} - An array of rubrics
 * @throws {apiError} - If failed to get all rubrics
 */
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

/**
 * @async
 * @function getRubricById
 * @desc Retrieves a rubric by its ID
 * @param {number} rubricId - The ID of the rubric
 * @returns {Promise<Object>} - The rubric object
 * @throws {apiError} - If failed to get rubric by ID
 * @throws {apiError} - If rubric not found
 */
const getRubricById = async (rubricId) => {
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

		// Check if rubric exists
		if (!rubric) {
			throw new apiError("Rubric not found", 404);
		}

		return rubric;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to get rubric by ID", 500);
		}
	}
};

/**
 * @async
 * @function updateRubricsForAssignment
 * @desc Updates a rubric for an assignment
 * @param {number} rubricId - The ID of the rubric
 * @param {Object} updateData - The updated rubric data
 * @returns {Promise<Object>} - The updated rubric
 * @throws {apiError} - If failed to update rubric
 * @throws {apiError} - If rubric not found
 */
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

		// Check if rubric exists
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
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to update rubric", 500);
		}
	}
};

/**
 * @async
 * @function deleteRubricsFromAssignment
 * @desc Deletes a rubric from an assignment
 * @param {number} rubricId - The ID of the rubric
 * @returns {Promise<Object>} - A success message
 * @throws {apiError} - If failed to delete rubric
 * @throws {apiError} - If rubric not found
 */
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

		// Check if rubric exists
		if (!rubric) {
			throw new apiError("Rubric not found", 404);
		}

		// Delete related records
		await prisma.$transaction(async (prisma) => {
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
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to delete rubric", 500);
		}
	}
};

// criterion operations
/**
 * @async
 * @function createCriterionForRubric
 * @desc Creates a criterion for a rubric
 * @param {number} rubricId - The ID of the rubric
 * @param {Object} criterionData - The criterion data
 * @returns {Promise<Object>} - The created criterion
 * @throws {apiError} - If failed to create criterion
 * @throws {apiError} - If rubric not found
 * @throws {apiError} - If maxMarks of criteria exceed the rubric's totalMarks
 * @throws {apiError} - If criterion maxMark and minMark are not set properly
 */
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
		// Check if rubric exists
		if (!rubric) {
			throw new apiError("Rubric not found", 404);
		}
		//console.log(rubric.criteria.reduce((sum, criterion) => sum + criterion.maxMark, 0));

		// Check if maxMark and minMark are positive
		if (
			criterionData.maxMark <= 0 ||
			criterionData.minMark < 0 ||
			criterionData.maxMark <= criterionData.minMark ||
			criterionData.maxMark > rubric.totalMarks
		) {
			throw new apiError(
				"Criterion maxMark and minMark are not set properly",
				400
			);
		}

		// Calculate the sum of maxMarks of existing criteria
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

/**
 * @async
 * @function getCriterionForRubric
 * @desc Retrieves the criteria for a rubric
 * @param {number} rubricId - The ID of the rubric
 * @returns {Promise<Array>} - An array of criteria
 * @throws {apiError} - If failed to get criteria for rubric
 * @throws {apiError} - If rubric not found
 */
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

		// Check if rubric exists
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

/**
 * @async
 * @function updateCriterionForRubric
 * @desc Updates a criterion for a rubric
 * @param {number} criterionId - The ID of the criterion
 * @param {Object} updateData - The updated criterion data
 * @returns {Promise<Object>} - The updated criterion
 * @throws {apiError} - If failed to update criterion for rubric
 * @throws {apiError} - If criterion not found
 * @throws {apiError} - If maxMarks of criteria exceed the rubric's totalMarks
 * @throws {apiError} - If criterion maxMark and minMark are not set properly
 */
const updateCriterionForRubric = async (criterionId, updateData) => {
	try {
		const criterion = await prisma.criterion.findUnique({
			where: {
				criterionId: criterionId
			}
		});
		// Check if criterion exists
		if (!criterion) {
			throw new apiError("Criterion not found", 404);
		}

		const rubric = await prisma.rubric.findUnique({
			where: {
				rubricId: criterion.rubricId
			},
			include: {
				criteria: true
			}
		});

		// Check if maxMark and minMark are positive
		if (
			updateData.maxMark <= 0 ||
			updateData.minMark < 0 ||
			updateData.maxMark <= updateData.minMark ||
			updateData.maxMark > rubric.totalMarks
		) {
			throw new apiError(
				"Criterion maxMark and minMark are not set properly",
				400
			);
		}

		// Calculate the sum of maxMarks of existing criteria excluding the current criterion
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

/**
 * @async
 * @function deleteCriterionForRubric
 * @desc Deletes a criterion for a rubric
 * @param {number} criterionId - The ID of the criterion
 * @returns {Promise<Object>} - The deleted criterion
 * @throws {apiError} - If failed to delete criterion for rubric
 * @throws {apiError} - If criterion not found
 */
const deleteCriterionForRubric = async (criterionId) => {
	try {
		const criterion = await prisma.criterion.findUnique({
			where: {
				criterionId: criterionId
			}
		});

		// Check if criterion exists
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

/**
 * @async
 * @function createCriterionRating
 * @desc Creates a rating for a criterion
 * @param {number} criterionId - The ID of the criterion
 * @param {Object} ratingData - The rating data
 * @returns {Promise<Object>} - The created rating
 * @throws {apiError} - If failed to create criterion rating
 */
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

/**
 * @async
 * @function linkRubricToAssignments
 * @desc Links a rubric to multiple assignments
 * @param {number} rubricId - The ID of the rubric
 * @param {Array<number>} assignmentIds - An array of assignment IDs
 * @returns {Promise<Object>} - A success message
 * @throws {apiError} - If failed to link rubric to assignments
 * @throws {apiError} - If rubric not found
 * @throws {apiError} - If invalid or empty assignment IDs provided
 */
const linkRubricToAssignments = async (rubricId, assignmentIds) => {
	try {
		// Check if rubric exists
		const rubric = await prisma.rubric.findUnique({
			where: { rubricId: rubricId }
		});

		// Check if rubric exists
		if (!rubric) {
			throw new apiError("Rubric not found", 404);
		}

		if (!Array.isArray(assignmentIds) || assignmentIds.length === 0) {
			throw new apiError("Invalid or empty assignment IDs provided", 400);
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
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to link rubric to assignments", 500);
		}
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
