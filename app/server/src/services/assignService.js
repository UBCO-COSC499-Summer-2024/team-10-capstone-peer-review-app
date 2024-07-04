import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

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
				assignments: true
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
  
export default {
	updateAssignmentInClass,
	addAssignmentToClass,
	removeAssignmentFromClass,
	getAssignmentInClass,
	getAllAssignmentsByClassId,

};
