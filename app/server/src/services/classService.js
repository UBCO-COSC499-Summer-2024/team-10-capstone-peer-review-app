import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

// class operations
const getClassById = async (classId) => {
	try {
		const classData = await prisma.class.findUnique({
			where: {
				classId: classId
			}
		});
		if (!classData) {
			throw new apiError("Class not found", 404);
		}
		return classData;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to retrieve class", 500);
		}
	}
};

const createClass = async ({
	classname,
	description,
	startDate,
	endDate,
	term,
	classSize
}, instructorId) => {
	try {
		const newClass = await prisma.class.create({
			data: {
				instructorId,
				classname,
				description,
				startDate,
				endDate,
				term,
				classSize,
			}
		});
		return newClass;
	} catch (error) {
		throw new apiError("Failed to create class", 500);
	}
};

const updateClass = async (classId, updateData) => {
	try {
		const updatedClass = await prisma.class.update({
			where: {
				classId: classId
			},
			data: updateData
		});
		return updatedClass;
	} catch (error) {
		throw new apiError("Failed to update class", 500);
	}
};

const deleteClass = async (classId) => {
	try {
		await prisma.class.delete({
			where: {
				classId: classId
			}
		});
	} catch (error) {
		throw new apiError("Failed to delete class", 500);
	}
};

// student operations
// Refactoring to use student email instead.
const addStudentToClass = async (classId, studentId) => {
	try {
		const classInfo = await prisma.class.findUnique({
			where: {
				classId: classId
			},
			include: {
				usersInClass: true
			}
		});

		if (!classInfo) {
			throw new apiError("Class not found", 404);
		}

		const userInfo = await prisma.user.findUnique({
			where: {
				userId: studentId
			}
		});

		if (!userInfo) {
			throw new apiError("User not found", 404);
		}

		// Check if adding a new student exceeds the class size
		if (
			classInfo.usersInClass &&
			classInfo.usersInClass.length >= classInfo.classSize
		) {
			throw new apiError("Adding student exceeds class size", 400);
		}

		// Proceed to add the student if class size is not exceeded
		await prisma.UserInClass.create({
			data: {
				userId: studentId,
				classId: classId
			}
		});

		//return updatedClass;
	} catch (error) {
		// Rethrow the error if it's an instance of apiError, else throw general apiError
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to add student to class", 500);
		}
	}
};

const removeStudentFromClass = async (classId, studentId) => {
	try {
		const userInClass = await prisma.userInClass.findUnique({
			where: {
				UserInClassId: {
					userId: studentId,
					classId: classId
				}
			}
		});

		// Step 3: Check if the record exists
		if (!userInClass) {
			throw new Error("Student is not enrolled in this class.");
		}

		// Step 4: Delete the record
		await prisma.userInClass.delete({
			where: {
				UserInClassId: {
					userId: studentId,
					classId: classId
				}
			}
		});
		if (!userInClass) {
			throw new Error("Student is not enrolled in this class.");
		}
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to remove student from class", 500);
		}
	}
};

// assignment operations
const addAssignmentToClass = async (classId, assignmentData) => {
	try {
		const classInfo = await prisma.class.findUnique({
			where: {
				classId: classId
			},
			include: {
				Assignments: true
			}
		});

		// Check if the assignment due date is within the class duration
		let dueDate = new Date(assignmentData.dueDate);
    	let startDate = new Date(classInfo.startDate);
    	let endDate = new Date(classInfo.endDate);

		if ( dueDate < startDate || dueDate > endDate) {
			throw new apiError("Assignment due date is outside the class duration", 400);
		}


		if (!classInfo) {
			throw new apiError("Class not found", 404);
		}

		const newAssignment = await prisma.assignment.create({
			data: {
				...assignmentData,
				classId: classId
			}
		});

		return newAssignment;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to add assignment to class", 500);
		}
	}
};

const removeAssignmentFromClass = async (assignmentId) => {
	try {
		const assignment = await prisma.assignment.findUnique({
			where: {
				assignmentId: assignmentId
			}
		});

		if (!assignment) {
			throw new apiError("Assignment not found", 404);
		}

		await prisma.assignment.delete({
			where: {
				assignmentId: assignmentId
			}
		});
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to remove assignment from class", 500);
		}
	}
};

const updateAssignmentInClass = async (classId, assignmentId, updateData) => {
	try {
		const classInfo = await prisma.class.findUnique({
			where: {
				classId: classId
			},
			include: {
				Assignments: true
			}
		});

		if (!classInfo) {
			throw new apiError("Class not found", 404);
		}

		const assignment = await prisma.assignment.findUnique({
			where: {
				assignmentId: assignmentId
			}
		});

		if (!assignment) {
			throw new apiError("Assignment not found", 404);
		}

		const updatedAssignment = await prisma.assignment.update({
			where: {
				assignmentId: assignmentId
			},
			data: updateData
		});

		return updatedAssignment;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to update assignment in class", 500);
		}
	}
};

const getAssignmentInClass = async (classId, assignmentId) => {
	try {
		const classInfo = await prisma.class.findUnique({
			where: {
				classId: classId
			},
			include: {
				Assignments: true
			}
		});

		if (!classInfo) {
			throw new apiError("Class not found", 404);
		}

		const assignment = await prisma.assignment.findUnique({
			where: {
				assignmentId: assignmentId
			}
		});

		if (!assignment) {
			throw new apiError("Assignment not found", 404);
		}

		return assignment;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to get assignment in class", 500);
		}
	}
};

// rubric operations
const createRubricsForAssignment = async (creatorId, assignmentId, rubricData) => {
	try {
		const assignment = await prisma.assignment.findUnique({
			where: {
				assignmentId: assignmentId
			}
		});

		if (!assignment) {
			throw new apiError("Assignment not found", 404);
		}

		const newRubric = await prisma.rubric.create({
			data: {
				...rubricData,
				creatorId: creatorId,
				assignments: {
					create: {
						assignmentId: assignmentId
					}
				}
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
                assignmentId: assignmentId,
            },
            include: {
                rubric: true, // Include the related rubric details
            },
        });

        if (!rubricAssignments.length) {
            throw new apiError("Rubrics not found for the assignment", 404);
        }

        // Map the result to only include rubric details
        const rubrics = rubricAssignments.map(ra => ra.rubric);

        return rubrics;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to get rubrics for assignment", 500);
		}
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
			  rubricId: rubricId,
			},
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
			}
		});

		if (!rubric) {
			throw new apiError("Rubric not found", 404);
		}

		// Check if maxMark and minMark are positive
		if (criterionData.maxMark <= 0 || criterionData.minMark <= 0 || criterionData.maxMark < criterionData.minMark || criterionData.maxMark > rubric.totalMarks) {
			throw new apiError("Criterion maxMark and minMark are not set properly", 400);
		}

		let existingMaxMarksSum = 0;
		if (rubric.criteria || rubric.criteria.length > 0) {
			existingMaxMarksSum = rubric.criteria.reduce((sum, criterion) => sum + criterion.maxMark, 0);
			console.log(existingMaxMarksSum);
		}

		console.log(`Existing Max Marks Sum: ${existingMaxMarksSum}, New Criterion Max Mark: ${criterionData.maxMark}, Rubric Total Marks: ${rubric.totalMarks}`);
		// Check if the sum of maxMarks including the new criterion exceeds totalMarks
		if (existingMaxMarksSum + criterionData.maxMark > rubric.totalMarks) {
			throw new apiError("maxMarks of criteria exceed the rubric's totalMarks", 400);
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
			}
		});

		if (!criterion) {
			throw new apiError("Criterion not found", 404);
		}

		// Check if maxMark and minMark are positive
		if (updateData.maxMark <= 0 || updateData.minMark <= 0 || updateData.maxMark < updateData.minMark || updateData.maxMark > rubric.totalMarks) {
			throw new apiError("Criterion maxMark and minMark are not set properly", 400);
		}

		let existingMaxMarksSum = 0;
		if (rubric.criteria) {
			// Calculate the sum of maxMarks of all existing criteria
			existingMaxMarksSum = rubric.criteria.reduce((sum, criterion) => sum + criterion.maxMark, 0);
			console.log(existingMaxMarksSum, updateData.maxMark, rubric.totalMarks);
		}
		if (existingMaxMarksSum + updateData.maxMark > rubric.totalMarks) {
			throw new apiError("maxMarks of criteria exceed the rubric's totalMarks", 400);
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



export default {
	getClassById,
	createClass,
	updateClass,
	deleteClass,

	addStudentToClass,
	removeStudentFromClass,

	updateAssignmentInClass,
	addAssignmentToClass,
	removeAssignmentFromClass,
	getAssignmentInClass,

	createRubricsForAssignment,
	getRubricsForAssignment,
	updateRubricsForAssignment,
	deleteRubricsForAssignment,

	createCriterionForRubric,
	getCriterionForRubric,
	updateCriterionForRubric,
	deleteCriterionForRubric
};
