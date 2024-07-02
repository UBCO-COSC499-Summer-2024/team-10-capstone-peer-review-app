import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

// Student operations

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

const getAssignment = async (studentId, assignmentId) => {
	try {

		const assignment = await prisma.assignment.findUnique({
			where: {
				assignmentId: assignmentId
			}, include: {
				classes: true
			}
		});

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

const getClassAssignment = async (studentId, classId) => {
	try {
		const studentInClass = await prisma.userInClass.findFirst({
			where: {
				userId: studentId,
				classId: classId
			}
		});

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
				rubric: {
					include: {
						criteria: true
					}
				} // Include the related rubric details
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


// criterion operations

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


// criterion grade operations

// group operations


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

		if (!group) {
			throw new apiError("Group not found", 404);
		}

		const studentInGroup = group.students.find(s => s.userId === studentId);

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
				groups: true
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
