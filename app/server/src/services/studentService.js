/**
 * This module contains the service functions for the student operations.
 * @module studentService
 */
import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

// Student operations

/**
 * @async
 * @function getStudentAssignment
 * @desc Retrieves the assignments for a student.
 * @param {number} studentId - The ID of the student.
 * @returns {Promise<Object>} The assignments for the student.
 * @throws {apiError} If the student is not found or if there is an error retrieving the assignments.
 */
const getStudentAssignment = async (studentId) => {
	try {
		const student = await prisma.user.findUnique({
			where: {
				userId: studentId
			}, include: {
				classes: {
					include: {
						class: {
							include: {
								Assignments: true
							}
						}
					}
				}
			}
		});
		// Check if the student exists
		if (!student) {
			throw new apiError("Student not found", 404);
		}
		
		return student.classes.map(c => c.class.Assignments);
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to retrieve student assignment", 500);
		}
	}
};

/**
 * @async
 * @function getClassesHavingStudent
 * @desc Retrieves the classes that a student is enrolled in.
 * @param {number} studentId - The ID of the student.
 * @returns {Promise<Object>} The classes that the student is enrolled in.
 * @throws {apiError} If there is an error retrieving the classes.
 */
const getClassesHavingStudent = async (studentId) => {
	try {
		const classesId = await prisma.userInClass.findMany({
			where: {
				userId: studentId
			}
		});

        const classes = await prisma.class.findMany({
            where: {
                classId: {
                    in: classesId.map(c => c.classId),
                },
            },
        });

		return classes;
	} catch (error) {
		throw new apiError("Failed to retrieve classes", 500);
	}
};

/**
 * @async
 * @function getClassById
 * @desc Retrieves a class by its ID.
 * @param {number} classId - The ID of the class.
 * @returns {Promise<Object>} The class.
 * @throws {apiError} If the class is not found or if there is an error retrieving the class.
 * @throws {apiError} If the student is not in the class.
 */
const getClassById = async (classId) => {
	try {
		const classData = await prisma.class.findUnique({
			where: {
				classId: classId
			}, include: {
				Assignments: true,
				groups: true,
				usersInClass: true
			}
		});
		// Check if the class exists
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

// Assignment operations
/**
 * @async
 * @function getAssignment
 * @desc Retrieves an assignment by its ID.
 * @param {number} studentId - The ID of the student.
 * @param {number} assignmentId - The ID of the assignment.
 * @returns {Promise<Object>} The assignment.
 * @throws {apiError} If the assignment is not found or if there is an error retrieving the assignment.
 * @throws {apiError} If the student is not in the class.
 */
const getAssignment = async (studentId, assignmentId) => {
	try {

		const assignment = await prisma.assignment.findUnique({
			where: {
				assignmentId: assignmentId
			}, include: {
				classes: true
			}
		});
		// Check if the assignment exists
		if (!assignment) {
			throw new apiError("Assignment not found", 404);
		}

		const classId = assignment.classes.classId;
		const studentInClass = await prisma.userInClass.findFirst({
			where: {
				userId: studentId,
				classId: classId
			}
		});
		// Check if the student is in the class
		if (!studentInClass) {
			throw new apiError("Student not in class", 403);
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

/**
 * @async
 * @function getClassAssignment
 * @desc Retrieves the assignments for a class.
 * @param {number} studentId - The ID of the student.
 * @param {number} classId - The ID of the class.
 * @returns {Promise<Object>} The assignments for the class.
 * @throws {apiError} If the student is not in the class.
 * @throws {apiError} If the class is not found or if there is an error retrieving the assignments.
 */
const getClassAssignment = async (studentId, classId) => {
	try {
		const studentInClass = await prisma.userInClass.findFirst({
			where: {
				userId: studentId,
				classId: classId
			}
		});
		// Check if the student is in the class
		if (!studentInClass) {
			throw new apiError("Student not in class", 403);
		}

		const classInfo = await prisma.class.findUnique({
			where: {
				classId: classId
			},
			include: {
				Assignments: true
			}
		});
		// Check if the class exists
		if (!classInfo) {
			throw new apiError("Class not found", 404);
		}

		return classInfo.Assignments;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to get assignment in class", 500);
		}
	}
};

// rubric operations

/**
 * @async
 * @function getRubricsForAssignment
 * @desc Retrieves the rubrics for an assignment.
 * @param {number} assignmentId - The ID of the assignment.
 * @returns {Promise<Object>} The rubrics for the assignment.
 * @throws {apiError} If the assignment is not found or if there is an error retrieving the rubrics.
 * @throws {apiError} If the rubrics are not found for the assignment.
 */
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
		// Check if the assignment exists
		if (!assignment) {
			throw new apiError("Assignment not found", 404);
		}
		// Check if the rubric exists for the assignment
		if (!assignment.rubric) {
			throw new apiError("Rubrics not found", 404);
		}

		const rubricAssignments = await prisma.rubricForAssignment.findMany({
            where: {
                assignmentId: assignmentId,
            },
            include: {
				rubric: {
					include: {
						criteria: true
					}
				} // Include the related rubric details
            },
        });
		// Check if the rubrics are found for the assignment
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


// criterion operations

/**
 * @async
 * @function getCriterionForRubric
 * @desc Retrieves the criteria for a rubric.
 * @param {number} rubricId - The ID of the rubric.
 * @returns {Promise<Object>} The criteria for the rubric.
 * @throws {apiError} If the rubric is not found or if there is an error retrieving the criteria.
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
		// Check if the rubric exists
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


// criterion grade operations

// group operations

/**
 * @async
 * @function updateGroupInClass
 * @desc Updates a group in a class.
 * @param {number} studentId - The ID of the student.
 * @param {number} groupId - The ID of the group.
 * @param {string} groupName - The name of the group.
 * @param {string} groupDescription - The description of the group.
 * @returns {Promise<Object>} The updated group.
 * @throws {apiError} If the group is not found or if there is an error updating the group.
 * @throws {apiError} If the student is not in the group.
 */
const updateGroupInClass = async (studentId, groupId, groupName, groupDescription) => {
	try {
		const group = await prisma.group.findUnique({
			where: {
				groupId: groupId
			},
			include: {
				students: true
			}
		});
		// Check if the group exists
		if (!group) {
			throw new apiError("Group not found", 404);
		}

		const studentInGroup = group.students.find(s => s.userId === studentId);
		// Check if the student is in the group
		if (!studentInGroup) {
			throw new apiError("Student not in group", 403);
		}

		const updatedGroup = await prisma.group.update({
			where: {
				groupId: groupId
			},
			data: {
				groupName: groupName,
				groupDescription: groupDescription
			}
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

/**
 * @async
 * @function getGroupInClass
 * @desc Retrieves a group in a class.
 * @param {number} classId - The ID of the class.
 * @param {number} groupId - The ID of the group.
 * @returns {Promise<Object>} The group.
 * @throws {apiError} If the group is not found or if there is an error retrieving the group.
 */
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
		// Check if the class exists
		if (!classInfo) {
			throw new apiError("Class not found", 404);
		}

		const group = await prisma.group.findUnique({
			where: {
				groupId: groupId,
				classId: classId
			}
		});
		// Check if the group exists
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

/**
 * @async
 * @function getGroupsInClass
 * @desc Retrieves the groups in a class.
 * @param {number} classId - The ID of the class.
 * @returns {Promise<Object>} The groups in the class.
 * @throws {apiError} If the class is not found or if there is an error retrieving the groups.
 */
const getGroupsInClass = async (classId) => {
	try {
		const classInfo = await prisma.class.findUnique({
			where: {
				classId: classId
			},
			include: {
				groups: true
			}
		});
		// Check if the class exists
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

/**
 * @async
 * @function getGroupMembers
 * @desc Retrieves the members of a group.
 * @param {number} groupId - The ID of the group.
 * @returns {Promise<Object>} The members of the group.
 * @throws {apiError} If the group is not found or if there is an error retrieving the members.
 */
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
		// Check if the group exists
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


export default {
	getClassesHavingStudent,
	getClassById,

	getAssignment,
	getStudentAssignment,
	getClassAssignment,

	getRubricsForAssignment,

	getCriterionForRubric,

	updateGroupInClass,
	getGroupInClass,
	getGroupsInClass,
	getGroupMembers
};
