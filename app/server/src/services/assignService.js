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
			  rubricId: assignmentData.rubricId,
			  allowedFileTypes: assignmentData.allowedFileTypes,  // Ensure this line is present
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
		  title: updateData.title,
		  description: updateData.description,
		  dueDate: updateData.dueDate,
		  maxSubmissions: updateData.maxSubmissions,
		  reviewOption: updateData.reviewOption,
		  assignmentFilePath: updateData.assignmentFilePath,
		  categoryId,
		  rubricId: updateData.rubricId,
		  allowedFileTypes: updateData.allowedFileTypes,  // Ensure this line is present
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
			submissions: true
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

const getAllAssignmentsByClassId = async (classId) => {
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
  
	  return classInfo.Assignments;
	} catch (error) {
	  if (error instanceof apiError) {
		throw error;
	  } else {
		throw new apiError("Failed to get all the assignments for the specific class", 500);
	  }
	}
};

const addAssignmentWithRubric = async (classId, categoryId, assignmentData, rubricData, creatorId) => {
	try {
	  console.log('Received data in service:', { classId, categoryId, assignmentData, rubricData, creatorId });
  
	  // Calculate totalMarks
	  const totalMarks = rubricData.criteria.reduce((total, criterion) => {
		return total + criterion.ratings.reduce((subtotal, rating) => subtotal + parseFloat(rating.points), 0);
	  }, 0);
  
	  // Create the rubric
	  const newRubric = await prisma.rubric.create({
		data: {
		  title: rubricData.title,
		  description: rubricData.description,
		  creatorId: creatorId,
		  totalMarks: totalMarks,
		  classId: classId,
		  criteria: {
			create: rubricData.criteria.map(criterion => ({
			  title: criterion.criteria,
			  maxMark: Math.max(...criterion.ratings.map(r => parseFloat(r.points))),
			  minMark: Math.min(...criterion.ratings.map(r => parseFloat(r.points))),
			  criterionRatings: {
				create: criterion.ratings.map(rating => ({
				  description: rating.text,
				  points: parseInt(rating.points, 10)
				}))
			  }
			}))
		  }
		}
	  });
  
	  console.log('Created rubric:', newRubric);
  
	  // Then create the assignment with the new rubric
	  const newAssignment = await prisma.assignment.create({
		data: {
		  title: assignmentData.title,
		  description: assignmentData.description,
		  dueDate: new Date(assignmentData.dueDate),
		  maxSubmissions: parseInt(assignmentData.maxSubmissions, 10),
		  allowedFileTypes: assignmentData.allowedFileTypes,
		  assignmentFilePath: assignmentData.assignmentFilePath,
		  classId: classId,
		  categoryId: categoryId,
		  rubricId: newRubric.rubricId
		}
	  });
  
	  console.log('Created assignment:', newAssignment);
  
	  return { assignment: newAssignment, rubric: newRubric };
	} catch (error) {
	  console.error('Detailed error in addAssignmentWithRubric:', error);
	  throw new apiError(`Failed to add assignment with rubric: ${error.message}`, 500);
	}
  };
export default {
	updateAssignmentInClass,
	addAssignmentToClass,
	removeAssignmentFromClass,
	getAssignmentInClass,
	getAllAssignments,
	getAllAssignmentsByClassId,
	addAssignmentWithRubric
};
