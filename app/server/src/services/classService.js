import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";
import { sendNotificationToRole, sendNotificationToUser } from "./notifsService.js";

// class operations

const getAllClasses = async () => {
	try {
		const classes = await prisma.class.findMany({
			include: {
				groups: true,
				usersInClass: true,
				Assignments: true,
				instructor: {
					select: {
						userId: true,
						email: true,
						firstname: true,
						lastname: true,
						classesInstructed: true
					}
				},
				EnrollRequest: true
			}
		});

		// Map the classes to include the assignment & user counts directly in the class object
		const classesWithCounts = classes.map((classItem) => ({
			...classItem,
			assignmentCount: classItem.Assignments.length,
			userCount: classItem.usersInClass.length,
		}));

		return classesWithCounts;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		}
		throw new apiError("Failed to retrieve classes", 500);
	}
};

const getAllClassesUserIsNotIn = async (userId) => {
	try {
	  // Get all classes
	  const allClasses = await prisma.class.findMany({
		include: {
		  usersInClass: true,
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
	  
  
	  // Filter out classes the user is in and calculate available seats
	  const filteredClasses = allClasses.filter(classItem => {
		const isUserInClass = classItem.usersInClass.some(user => user.userId === userId);
		const availableSeats = classItem.classSize - classItem.usersInClass.length;
		
		// Add availableSeats to the class object
		classItem.availableSeats = availableSeats;
  
		// Remove usersInClass from the response to avoid sending unnecessary data
		delete classItem.usersInClass;
  
		return !isUserInClass;
	  });
  
	  return filteredClasses;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		}
		throw new apiError("Failed to retrieve students in class", 500);
  };
}
  

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

        // Extract unique students based on userId since this seems to return as many entries as there are matching in UserInClass
        const uniqueStudents = Array.from(new Map(classWithStudents.map(student => [student.user.userId, student])).values()).map(entry => entry.user);

        return uniqueStudents;
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
		if (error instanceof apiError) {
			throw error;
		}
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
		const { classname, description, startDate, endDate, term, classSize } = newClass;
		if (startDate >= endDate) {
			throw new apiError("Invalid class data provided", 400);
		}

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

		await sendNotificationToRole(null, `A new class '${classname}' has been created`, "", "ADMIN", 'class');
		return createdClass;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to create class", 500);
		}
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

		const classInfo = await prisma.class.findUnique({
			where: {
				classId: classId
			},
			include: {
				usersInClass: true
			}
		});

		// Check if new class size (if given) is less than the current number of students in the class
		if (
			updateData.classSize &&
			updateData.classSize < classInfo.usersInClass.length
		) {
			throw new apiError("The new class size given is less than the number of students in the class", 400);
		}

		await sendNotificationToRole(null, `The class '${classInfo.classname}' has been updated`, "", "ADMIN", 'class');
		return updatedClass;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		}
		throw new apiError("Failed to update class", 500);
	}
};

const deleteClass = async (classId) => {
	try {
		const classInfo = await prisma.class.findUnique({
			where: {
				classId: classId
			}
		});

		await sendNotificationToRole(null, `The class '${classInfo.classname}' has been deleted`, "", "ADMIN", 'class');
		
		await prisma.class.delete({
			where: {
				classId: classId
			}
		});
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		}
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
		await prisma.userInClass.create({
			data: {
				userId: studentId,
				classId: classId
			}
		});

		await sendNotificationToUser(null, `You've been added to the class ${classInfo.classname}`, "", studentId, 'class');

		return userInfo;
	} catch (error) {
		// Rethrow the error if it's an instance of apiError, else throw general apiError
		if (error instanceof apiError) {
			console.log("hey",error);
			throw error;
		} else {
			console.log("hey",error);
			throw new apiError(`Failed to add student to class: ${error}`, 500);
		}
	}
};

const addStudentsByEmail = async (classId, emails) => {
	try {
		const classInfo = await prisma.class.findUnique({
			where: { classId },
			include: { usersInClass: true }
		});

		if (!classInfo) {
			throw new apiError("Class not found", 404);
		}

		const results = { valid: [], invalid: [] };
		let currentClassSize = classInfo.usersInClass.length;

		for (const email of emails) {
			const user = await prisma.user.findUnique({
				where: { email }
			});

			if (user && user.role === "STUDENT") {
				// Check if the student is already in the class
				const alreadyInClass = classInfo.usersInClass.some(
					(u) => u.userId === user.userId
				);

				if (!alreadyInClass) {
					// Check if adding this student would exceed the class size
					if (currentClassSize < classInfo.classSize) {
						await prisma.userInClass.create({
							data: {
								userId: user.userId,
								classId: classId
							}
						});
						results.valid.push({ email, userId: user.userId });
						currentClassSize++;
						await sendNotificationToUser(null, `You've been added to the class ${classInfo.classname}`, "", user.userId, 'class');
					} else {
						results.invalid.push({ email, reason: "Class is full" });
					}
				} else {
					results.invalid.push({ email, reason: "Already in class" });
				}
			} else {
				results.invalid.push({
					email,
					reason: "Non-registered email or not a student"
				});
			}
		}

		return results;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to add students by email", 500);
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

		const classInfo = await prisma.class.findUnique({
			where: { classId }
		});
		
		await sendNotificationToUser(null, `You've been removed from the class ${classInfo.classname}`, "", studentId, 'class');
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to remove student from class", 500);
		}
	}
};

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
			data: updateData,
			include: {
				students: true,
				submissions: true // This is to include the students & submissions in the response. Needed for Groups.jsx atm.
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
			}, include: {
				classes: true
			}
		});

		if (!userInfo) {
			throw new apiError("User not found", 404);
		}

		if (group.students && group.students.length >= group.groupSize) {
			throw new apiError("Adding student exceeds group size", 400);
		}

		if (!userInfo.classes.some((c) => c.classId === group.classId)) {
			throw new apiError("Student not enrolled in class", 400);
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

		const classInfo = await prisma.class.findUnique({
			where: {
				classId: group.classId
			}
		});

		await sendNotificationToUser(null, `You've been added to the group ${group.groupName}`, classInfo.classname, userId, 'group');
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to add student to group" + error, 500);
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

		const classInfo = await prisma.class.findUnique({
			where: {
				classId: group.classId
			}
		});

		await sendNotificationToUser(null, `You've been removed from the group ${group.groupName}`, classInfo.classname, userId, 'group');
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

const isUserInGroup = async (classId, userId) => {
	try {
		const classInfo = await prisma.class.findUnique({
			where: {
				classId: classId
			},
			include: {
				groups: {
					include: {
						students: {
							where: {
								userId: userId
							}
						}
					}
				}
			}
		});

		if (!classInfo) {
			throw new apiError("Class not found", 404);
		}

		// Check if student exists in any group of the class
		const groups = classInfo.groups;
		return groups.some((group) => group.students.length > 0);
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError(
				"Failed to check if student exists in any group of the class",
				500
			);
		}
	}
};

const getStudentsNotInAnyGroup = async (classId) => {
	try {
		// Fetch all UserInClass rows for the class
		const usersInClass = await prisma.userInClass.findMany({
			where: {
				classId: classId
			},
			include: {
				user: true
			}
		});

		// Extract all users (students) in the class
		const allStudents = usersInClass.map((userInClass) => userInClass.user);

		// Fetch class info to get groups and their students
		const classInfo = await prisma.class.findUnique({
			where: {
				classId: classId
			},
			include: {
				groups: {
					include: {
						students: true
					}
				}
			}
		});

		if (!classInfo) {
			throw new apiError("Class not found", 404);
		}

		// Extract students who are in groups
		const studentsInGroups = classInfo.groups.reduce((acc, group) => {
			return acc.concat(group.students);
		}, []);

		// Find students not in any group
		const studentsNotInAnyGroup = allStudents.filter((student) => {
			// Check if the student is not in any group
			return !studentsInGroups.some(
				(groupStudent) => groupStudent.userId === student.userId
			);
		});
		console.log("hey", studentsNotInAnyGroup);
		return studentsNotInAnyGroup;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to get students not in any group", 500);
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
	getAllClassesUserIsNotIn,
	getClassById,
	createClass,
	updateClass,
	deleteClass,

	addStudentToClass,
	addStudentsByEmail,
	removeStudentFromClass,

	addGroupToClass,
	removeGroupFromClass,
	updateGroupInClass,
	getGroupInClass,
	getGroupsInClass,
	getGroupMembers,
	addGroupMember,
	removeGroupMember,
	isUserInGroup,
	getStudentsNotInAnyGroup,

	getCategoriesByClassId
};
