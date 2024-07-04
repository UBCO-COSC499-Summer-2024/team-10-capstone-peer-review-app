import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

// class operations

const getAllClasses = async () => {
	try {
		const classes = await prisma.class.findMany({
			include: {
				groups: true,
				usersInClass: true,
				Assignments: true,
				instructor: true,
				EnrollRequest: true
			}
		});
		return classes;
	} catch (error) {
		throw new apiError("Failed to retrieve classes", 500);
	}
};

const getStudentsByClass = async (classId) => {
	try {
		const classWithStudents = await prisma.userInClass.findMany({
			where: {
				classId: classId
			},
			include: {
				user: {
					select: {
						userId: true,
						email: true,
						firstname: true,
						lastname: true
					}
				}
			}
		});
		const students = classWithStudents.map((student) => student.user);
		return students;
	} catch (error) {
		throw new apiError("Failed to retrieve students in class", 500);
	}
};

const getInstructorByClass = async (classId) => {
	try {
		const classWithInstructor = await prisma.class.findUnique({
			where: {
				classId: classId
			},
			include: {
				instructor: {
					select: {
						userId: true,
						email: true,
						firstname: true,
						lastname: true
					}
				}
			}
		});
		return classWithInstructor.instructor;
	} catch (error) {
		throw new apiError("Failed to retrieve instructor in class", 500);
	}
};

const getClassesByInstructor = async (instructorId) => {
	try {
		const classes = await prisma.class.findMany({
			where: {
				instructorId: instructorId
			}
		});
		return classes;
	} catch (error) {
		throw new apiError("Failed to retrieve classes", 500);
	}
};

const getClassById = async (classId) => {
	try {
		const classData = await prisma.class.findUnique({
			where: {
				classId: classId
			},
			include: {
				instructor: true
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

const createClass = async (newClass, instructorId) => {
	try {
		const { classname, description, startDate, endDate, term, classSize } =
			newClass;
		const createdClass = await prisma.class.create({
			data: {
				instructorId,
				classname,
				description,
				startDate,
				endDate,
				term,
				classSize
			}
		});
		return createdClass;
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
		console.log(error);
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

// rubric operations
const createRubricsForAssignment = async (
	creatorId,
	assignmentId,
	rubricData
) => {
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
				assignmentId: assignmentId
			},
			include: {
				rubric: true // Include the related rubric details
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
	  const newRating = await prisma.criteronRating.create({
		data: {
		  ...ratingData,
		  criterionId: criterionId,
		},
	  });
	  return newRating;
	} catch (error) {
	  throw new apiError("Failed to create criterion rating", 500);
	}
  };

  //add update and delete and get crieterion rating here

// criterion grade operations

// group operations

const addGroupToClass = async (classId, groupData) => {
	try {
		const classInfo = await prisma.class.findUnique({
			where: {
				classId: classId
			},
			include: {
				groups: true
			}
		});

		if (!classInfo) {
			throw new apiError("Class not found", 404);
		}

		const newGroup = await prisma.group.create({
			data: {
				...groupData,
				classId: classId
			},
			include: {
				students: true,
				submissions: true // This is to include the students & submissions in the response. Needed for Groups.jsx atm.
			}
		});

		return newGroup;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to add group to class", 500);
		}
	}
};

const removeGroupFromClass = async (groupId) => {
	try {
		const group = await prisma.group.findUnique({
			where: {
				groupId: groupId
			}
		});

		if (!group) {
			throw new apiError("Group not found", 404);
		}

		await prisma.group.delete({
			where: {
				groupId: groupId
			}
		});
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to remove group from class", 500);
		}
	}
};

const updateGroupInClass = async (groupId, updateData) => {
	try {
		const group = await prisma.group.findUnique({
			where: {
				groupId: groupId
			}
		});

		if (!group) {
			throw new apiError("Group not found", 404);
		}

		const updatedGroup = await prisma.group.update({
			where: {
				groupId: groupId
			},
			data: updateData
		});

		return updatedGroup;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to update group in class", 500);
		}
	}
};

const getGroupInClass = async (classId, groupId) => {
	try {
		const classInfo = await prisma.class.findUnique({
			where: {
				classId: classId
			},
			include: {
				groups: true
			}
		});

		if (!classInfo) {
			throw new apiError("Class not found", 404);
		}

		const group = await prisma.group.findUnique({
			where: {
				groupId: groupId,
				classId: classId
			}
		});

		if (!group) {
			throw new apiError("Group not found", 404);
		}

		return group;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to get group in class", 500);
		}
	}
};

const getGroupsInClass = async (classId) => {
	try {
		const classInfo = await prisma.class.findUnique({
			where: {
				classId: classId
			},
			include: {
				groups: {
					include: {
						students: true,
						submissions: true // This is to include the students & submissions in the response. Needed for Groups.jsx atm.
					}
				}
			}
		});

		if (!classInfo) {
			throw new apiError("Class not found", 404);
		}

		return classInfo.groups;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to get groups in class", 500);
		}
	}
};

const addGroupMember = async (groupId, userId) => {
	try {
		const group = await prisma.group.findUnique({
			where: {
				groupId: groupId
			},
			include: {
				students: true
			}
		});

		if (!group) {
			throw new apiError("Group not found", 404);
		}

		const userInfo = await prisma.user.findUnique({
			where: {
				userId: userId
			}
		});

		if (!userInfo) {
			throw new apiError("User not found", 404);
		}

		if (group.students && group.students.length >= group.groupSize) {
			throw new apiError("Adding student exceeds group size", 400);
		}

		await prisma.group.update({
			where: {
				groupId: groupId
			},
			data: {
				students: {
					connect: [{ userId: userId }]
				}
			}
		});
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to add student to group", 500);
		}
	}
};

const removeGroupMember = async (groupId, userId) => {
	try {
		const group = await prisma.group.findFirst({
			where: {
				AND: [{ groupId: groupId }, { students: { some: { userId: userId } } }]
			}
		});

		if (!group) {
			throw new apiError("Group not found with student", 404);
		}

		const userInfo = await prisma.user.findUnique({
			where: {
				userId: userId
			}
		});

		if (!userInfo) {
			throw new apiError("User not found", 404);
		}

		await prisma.group.update({
			where: {
				groupId: groupId
			},
			data: {
				students: {
					disconnect: [{ userId: userId }]
				}
			}
		});
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to remove student from group", 500);
		}
	}
};

const getGroupMembers = async (groupId) => {
	try {
		const group = await prisma.group.findUnique({
			where: {
				groupId: groupId
			},
			include: {
				students: true
			}
		});

		if (!group) {
			throw new apiError("Group not found", 404);
		}

		return group.students;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to get students in group", 500);
		}
	}
};

export const getCategoriesByClassId = async (classId) => {
	return await prisma.category.findMany({
		where: { classId },
		include: {
			assignments: true
		}
	});
};

export default {
	getInstructorByClass,
	getStudentsByClass,
	getClassesByInstructor,
	getAllClasses,
	getClassById,
	createClass,
	updateClass,
	deleteClass,

	addStudentToClass,
	removeStudentFromClass,

	createRubricsForAssignment,
	getRubricsForAssignment,
	updateRubricsForAssignment,
	deleteRubricsForAssignment,

	createCriterionForRubric,
	getCriterionForRubric,
	updateCriterionForRubric,
	deleteCriterionForRubric,
	createCriterionRating,

	addGroupToClass,
	removeGroupFromClass,
	updateGroupInClass,
	getGroupInClass,
	getGroupsInClass,
	getGroupMembers,
	addGroupMember,
	removeGroupMember,

	getCategoriesByClassId
};
