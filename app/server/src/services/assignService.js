import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";
import { sendNotificationToClass } from "./notifsService.js";
import { format } from "date-fns";

const addAssignmentToClass = async (classId, categoryId, assignmentData) => {
    console.log('assignmentFilePath:', assignmentData.assignmentFilePath);
    try {
        const classInfo = await prisma.class.findUnique({
            where: { classId },
            include: { Assignments: true }
        });

        if (!classInfo) {
            throw new apiError("Class not found", 404);
        }

        // Check if the assignment due date is within the class duration
        let dueDate = new Date(assignmentData.dueDate);
        let startDate = new Date(classInfo.startDate);
        let endDate = new Date(classInfo.endDate);

        if (dueDate < startDate || dueDate > endDate) {
            throw new apiError("Assignment due date is outside the class duration", 400);
        }

        // Create the new assignment
		const newAssignment = await prisma.assignment.create({
            data: {
                title: assignmentData.title,
                description: assignmentData.description,
                dueDate: assignmentData.dueDate,
                maxSubmissions: assignmentData.maxSubmissions,
                reviewOption: assignmentData.reviewOption,
                assignmentFilePath: assignmentData.assignmentFilePath,
                classId,
                categoryId,
                rubricId: assignmentData.rubricId, // Add this line
            }
        });

        // Connect rubrics to the new assignment
        if (assignmentData.rubrics && assignmentData.rubrics.length > 0) {
            await prisma.rubricForAssignment.createMany({
                data: assignmentData.rubrics.map(rubric => ({
                    assignmentId: newAssignment.assignmentId,
                    rubricId: rubric.rubricId
                }))
            });
        }

        await sendNotificationToClass(null, `Assignment ${newAssignment.title} was just created.`, `Due on ${format(dueDate, 'MMMM do, yyyy')}`, classId);

		const assignmentWithRubric = await prisma.assignment.findUnique({
            where: { assignmentId: newAssignment.assignmentId },
            include: { rubric: true }
        });
		
        return assignmentWithRubric;

    } catch (error) {
        console.error('Error adding assignment:', error);
        if (error instanceof apiError) {
            throw error;
        } else {
            throw new apiError("Failed to add assignment to class", 500);
        }
    }
};

const removeAssignmentFromClass = async (assignmentId) => {
    try {
        const deletedAssignment = await prisma.$transaction(async (prisma) => {
            // // Delete all related RubricForAssignment records
            // await prisma.rubricForAssignment.deleteMany({
            //     where: {
            //         assignmentId: assignmentId
            //     }
            // });

			// Delete all related Submission records
			await prisma.submission.deleteMany({
				where: {
					assignmentId: assignmentId
				}
			});

			// Delete the assignment
			return prisma.assignment.delete({
				where: {
					assignmentId: assignmentId
				}
			});
		});

		return deletedAssignment;
    } catch (error) {
        console.error("Error in removeAssignmentFromClass:", error);
        if (error instanceof apiError) {
            throw error;
        } else {
            throw new apiError(`Failed to remove assignment from class: ${error.message}`, 500);
        }
    }
};


const updateAssignmentInClass = async (classId, assignmentId, categoryId, updateData) => {
	try {
	  const classInfo = await prisma.class.findUnique({
		where: { classId },
		include: { Assignments: true }
	  });
  
	  if (!classInfo) {
		throw new apiError("Class not found", 404);
	  }
  
	  const assignment = await prisma.assignment.findUnique({
		where: { assignmentId }
	  });
  
	  if (!assignment) {
		throw new apiError("Assignment not found", 404);
	  }
  
	  // Check if the assignment due date is within the class duration
	  let dueDate = new Date(updateData.dueDate);
	  let startDate = new Date(classInfo.startDate);
	  let endDate = new Date(classInfo.endDate);
  
	  if (dueDate < startDate || dueDate > endDate) {
		throw new apiError("Assignment due date is outside the class duration", 400);
	  }
  
	  const updatedAssignment = await prisma.assignment.update({
		where: { assignmentId },
		data: {
			...updateData,
			categoryId,
			rubricId: updateData.rubricId, // Add this line
		}
	});
  
	  // Update the Category table if the category has changed
	  if (assignment.categoryId !== categoryId) {
		await prisma.category.update({
		  where: { categoryId: assignment.categoryId },
		  data: {
			assignments: {
			  disconnect: { assignmentId }
			}
		  }
		});
  
		await prisma.category.update({
		  where: { categoryId },
		  data: {
			assignments: {
			  connect: { assignmentId }
			}
		  }
		});
	  }
  
	  return updatedAssignment;
	} catch (error) {
	  if (error instanceof apiError) {
		throw error;
	  } else {
		throw new apiError("Failed to update assignment in class", 500);
	  }
	}
  };


  const getAssignmentInClass = async (classId, assignmentId, userId = "") => {
	try {
	  // Fetch the class information
	  const classInfo = await prisma.class.findUnique({
		where: {
		  classId: classId
		},
		include: {
		  Assignments: true,
		}
	  });
  
	  if (!classInfo) {
		throw new apiError("Class not found", 404);
	  }
  
	  // Fetch the assignment information
	  const assignment = await prisma.assignment.findUnique({
		where: {
		  assignmentId: assignmentId
		},
		include: {
		  extendedDueDates: true
		}
	  });
  
	  if (!assignment) {
		throw new apiError("Assignment not found", 404);
	  }
  
	  // Fetch user information if userId is provided
	  if (userId) {
		const user = await prisma.user.findUnique({
		  where: { userId },
		  include: { extendedDueDates: true }
		});
  
		if (!user) {
		  throw new apiError("User not found", 404);
		}
  
		// Check if the user is a student and apply extended due date if available
		if (user.role === "STUDENT") {
		  const extendedDueDate = user.extendedDueDates.find(edd => edd.assignmentId === assignmentId);
		  if (extendedDueDate) {
			assignment.dueDate = extendedDueDate.newDueDate;
		  }
		}
	  }
  
	  return assignment;
	} catch (error) {
	  if (error instanceof apiError) {
		throw error;
	  } else {
		throw new apiError("Failed to get assignment in class " + error, 500);
	  }
	}
  };  


const getAllAssignments = async () => {
	try {
	  const assignments = await prisma.assignment.findMany({
		include: {
			classes: true,
			category: true,
			rubric: true,
			submissions: true,
			extendedDueDates: true
		}
	  });
  
	  return assignments;
	} catch (error) {
		if (error instanceof apiError) {
		  	throw error;
		} else {
		  	throw new apiError("Failed to get all assignments", 500);
		}
	}
};

const getAllAssignmentsByClassId = async (classId, userId = "") => {
	try {
	  // Fetch the class and assignments with extended due dates
	  const classInfo = await prisma.class.findUnique({
		where: {
		  classId: classId
		},
		include: {
		  Assignments: {
			include: {
			  extendedDueDates: true
			}
		  }
		}
	  });
  
	  if (!classInfo) {
		throw new apiError("Class not found", 404);
	  }
  
	  let assignments = classInfo.Assignments;
  
	  // If userId is provided, fetch user information
	  if (userId) {
		const user = await prisma.user.findUnique({
		  where: { userId },
		  include: { extendedDueDates: true }
		});
  
		if (!user) {
		  throw new apiError("User not found", 404);
		}
  
		// Check if the user is a student and apply extended due dates
		if (user.role === "STUDENT") {
		  assignments = assignments.map(assignment => {
			const extendedDueDate = user.extendedDueDates.find(edd => edd.assignmentId === assignment.assignmentId);
			if (extendedDueDate) {
			  assignment.dueDate = extendedDueDate.newDueDate;
			}
			return assignment;
		  });
		}
	  }
  
	  return assignments;
	} catch (error) {
	  if (error instanceof apiError) {
		throw error;
	  } else {
		throw new apiError("Failed to get all the assignments for the specific class", 500);
	  }
	}
};  

// Extend the deadline for a student on an assignment
const extendDeadlineForStudent = async (studentId, assignmentId, newDueDate) => {
	try {
		const assignment = await prisma.assignment.findUnique({
			where: { assignmentId }
		});
		const user = await prisma.user.findUnique({
			where: { userId: studentId }
		});

		if (!assignment) {
			throw new apiError("Assignment not found", 404);
		} else if (!user) {
			throw new apiError("User not found", 404);
		} else if (new Date(newDueDate) <= new Date(assignment.dueDate)) {
			// Check if the new due date is after the original due date
			throw new apiError("New due date must be after the original due date", 400);
		}

		const newExtension = await prisma.extendedDueDate.upsert({
			where: {
				UniqueExtendedDueDatePerUserAssignment: {
					userId: studentId,
					assignmentId
				}
			},
			update: {
				newDueDate,
				updatedAt: new Date(),
			},
			create: {
				userId: studentId,
				assignmentId,
				newDueDate,
			}
		});

		return newExtension;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to extend deadline for student", 500);
		}
	}
}

const deleteExtendedDeadlineForStudent = async (studentId, assignmentId) => {
	try {
		// Check if the record exists
		const existingExtension = await prisma.extendedDueDate.findUnique({
			where: {
				UniqueExtendedDueDatePerUserAssignment: {
					userId: studentId,
					assignmentId
				}
			}
		});

		if (!existingExtension) {
			throw new apiError("Record not found", 404);
		}

		// Proceed to delete the record if it exists
		const deletedExtension = await prisma.extendedDueDate.delete({
			where: {
				UniqueExtendedDueDatePerUserAssignment: {
					userId: studentId,
					assignmentId
				}
			}
		});

		return deletedExtension;
	} catch (error) {
		if (error instanceof apiError) {
			console.log(error);
			throw error;
		} else if (error.code === 'P2025') {
			console.log("Record not found");
			throw new apiError("Record not found", 404);
		} else {
			console.log(error);
			throw new apiError("Failed to delete extended due date", 500);
		}
	}
};
  
export default {
	updateAssignmentInClass,
	addAssignmentToClass,
	removeAssignmentFromClass,
	getAssignmentInClass,
	getAllAssignments,
	getAllAssignmentsByClassId,
	extendDeadlineForStudent,
	deleteExtendedDeadlineForStudent
};
