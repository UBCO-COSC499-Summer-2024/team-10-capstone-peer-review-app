import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

const createRubricsForAssignment = async (creatorId, assignmentId, rubricData) => {
    try {
        const assignment = await prisma.assignment.findUnique({
            where: { assignmentId: assignmentId },
        });

        if (!assignment) {
            throw new apiError("Assignment not found", 404);
        }

        // Ensure criteria is always an array
        const criteria = Array.isArray(rubricData.criterion) ? rubricData.criterion : [rubricData.criterion];

        const newRubric = await prisma.rubric.create({
            data: {
                title: rubricData.title,
                description: rubricData.description,
                totalMarks: rubricData.totalMarks,
				classId: rubricData.classId,
                creatorId: creatorId,
                criteria: {
                    create: criteria.map(criterion => ({
                        title: criterion.title,
                        minMark: criterion.minPoints,
                        maxMark: criterion.maxPoints,
                        criterionRatings: {
                            create: criterion.criterionRatings.map(rating => ({
                                description: rating.text,
                                points: rating.points
                            }))
                        }
                    }))
                },
                assignments: {
                    create: {
                        assignmentId: assignmentId,
                    }
                }
            },
            include: {
                criteria: {
                    include: {
                        criterionRatings: true
                    }
                },
                assignments: true
            }
        });

        return newRubric;
    } catch (error) {
        console.error("Error in createRubricsForAssignment:", error);
        throw new apiError(`Failed to create rubrics for assignment: ${error.message}`, 500);
    }
};


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
				},
				assignments: {
					create: {
						assignmentId: assignmentId
					}
				}
			},
			include: {
				criteria: {
					include: {
						criterionRatings: true
					}
				},
				assignments: true
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
				rubric: true
			}
		});

		if (!assignment) {
			throw new apiError("Assignment not found", 404);
		}

		if (!assignment.rubric) {
			throw new apiError("Rubrics not found", 404);
		}

		const rubricAssignments = await prisma.rubricForAssignment.findMany({
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

		if (!rubricAssignments.length) {
			throw new apiError("Rubrics not found for the assignment", 404);
		}

		// Map the result to only include rubric details
		const rubrics = rubricAssignments.map((ra) => ra.rubric);

		return rubrics;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to get rubrics for assignment", 500);
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
				criteria: 
				{
					include: {
						criterionRatings: true
					}
				}
			 },
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
			where: {
				rubricId: rubricId
			}
		});

		if (!rubric) {
			throw new apiError("Rubric not found", 404);
		}

		const updatedRubric = await prisma.rubric.update({
			where: {
				rubricId: rubricId
			},
			data: updateData
		});

		return updatedRubric;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to update rubrics for assignment", 500);
		}
	}
};

const deleteRubricsForAssignment = async (rubricId) => {
	try {
		const rubric = await prisma.rubric.findUnique({
			where: {
				rubricId: rubricId
			}
		});

		if (!rubric) {
			throw new apiError("Rubric not found", 404);
		}

		await prisma.rubricForAssignment.deleteMany({
			where: {
				rubricId: rubricId
			}
		});

		await prisma.rubric.delete({
			where: {
				rubricId: rubricId
			}
		});
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to delete rubrics for assignment", 500);
		}
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

//add update and delete and get crieterion rating here

// criterion grade operations

export default {
	createRubricsForAssignment,
	getRubricsForAssignment,
	getAllRubrics,
	getAllRubricsInClass,
	getRubricById,
	updateRubricsForAssignment,
	deleteRubricsForAssignment,

	createCriterionForRubric,
	getCriterionForRubric,
	updateCriterionForRubric,
	deleteCriterionForRubric,
	createCriterionRating
};
