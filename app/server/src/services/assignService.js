/**
 * @module assignService
 */

import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";
import { sendNotificationToClass } from "./notifsService.js";
import { format } from "date-fns";

/**
 * @def Add an assignment to a class.
 * @async
 * @param {string} classId - The ID of the class.
 * @param {string} categoryId - The ID of the category.
 * @param {object} assignmentData - The assignment data.
 * @param {string} assignmentData.title - The title of the assignment.
 * @param {string} assignmentData.description - The description of the assignment.
 * @param {string} assignmentData.dueDate - The due date of the assignment.
 * @param {string} assignmentData.maxSubmissions - The maximum number of submissions allowed for the assignment.
 * @param {string} assignmentData.reviewOption - The review option for the assignment.
 * @param {string} assignmentData.assignmentFilePath - The file path of the assignment.
 * @param {string} assignmentData.rubricId - The ID of the rubric.
 * @param {string[]} assignmentData.allowedFileTypes - The allowed file types for the assignment.
 * @throws {apiError} If the class is not found.
 * @throws {apiError} If the assignment due date is outside the class duration.
 * @throws {apiError} If the assignment is not added to the class.
 * @throws {apiError} If the assignment with rubric is not found.
 * @returns {Promise<object>} The created assignment with rubric.
 */
const addAssignmentToClass = async (classId, categoryId, assignmentData) => {
	console.log("assignmentFilePath:", assignmentData.assignmentFilePath);
	console.log("Received assignment data in service:", assignmentData);
	try {
		// get the class with class ID
		const classInfo = await prisma.class.findUnique({
			where: { classId },
			include: { Assignments: true }
		});

		// check if the class exists
		if (!classInfo) {
			throw new apiError("Class not found", 404);
		}

		// Check if the assignment due date is within the class duration
		let dueDate = new Date(assignmentData.dueDate);
		let startDate = new Date(classInfo.startDate);
		let endDate = new Date(classInfo.endDate);

		if (dueDate < startDate || dueDate > endDate) {
			throw new apiError(
				"Assignment due date is outside the class duration",
				400
			);
		}

		const newAssignment = await prisma.assignment.create({
			data: {
				title: assignmentData.title,
				description: assignmentData.description,
				dueDate: assignmentData.dueDate,
				maxSubmissions: parseInt(assignmentData.maxSubmissions, 10), // Convert to integer
				isPeerReviewAnonymous: assignmentData.isPeerReviewAnonymous,
				reviewOption: assignmentData.reviewOption,
				assignmentFilePath: assignmentData.assignmentFilePath,
				classId,
				categoryId,
				rubricId: assignmentData.rubricId,
				allowedFileTypes: assignmentData.allowedFileTypes
			}
		});

		await sendNotificationToClass(
			null,
			`Assignment ${newAssignment.title} was just created.`,
			`Due on ${format(dueDate, "MMMM do, yyyy")}`,
			classId
		);

		// get the assignment with rubric
		const assignmentWithRubric = await prisma.assignment.findUnique({
			where: { assignmentId: newAssignment.assignmentId },
			include: { rubric: true }
		});

		return assignmentWithRubric;
	} catch (error) {
		console.error("Error adding assignment:", error);
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to add assignment to class", 500);
		}
	}
};

/**
 * @desc Remove an assignment from a class.
 * @async
 * @param {string} assignmentId - The ID of the assignment.
 * @throws {apiError} If the assignment is not found.
 * @throws {apiError} If the assignment is not removed from the class.
 * @returns {Promise<object>} The deleted assignment.
 */
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
			throw new apiError(
				`Failed to remove assignment from class: ${error.message}`,
				500
			);
		}
	}
};
/**
 * Update an assignment in a class.
 * @async
 * @param {string} classId - The ID of the class.
 * @param {string} assignmentId - The ID of the assignment.
 * @param {string} categoryId - The ID of the category.
 * @param {object} updateData - The updated assignment data.
 * @param {string} updateData.title - The updated title of the assignment.
 * @param {string} updateData.description - The updated description of the assignment.
 * @param {string} updateData.dueDate - The updated due date of the assignment.
 * @param {string} updateData.maxSubmissions - The updated maximum number of submissions allowed for the assignment.
 * @param {string} updateData.reviewOption - The updated review option for the assignment.
 * @param {string} updateData.assignmentFilePath - The updated file path of the assignment.
 * @param {string} updateData.rubricId - The updated ID of the rubric.
 * @param {string[]} updateData.allowedFileTypes - The updated allowed file types for the assignment.
 * @throws {apiError} If the class is not found.
 * @throws {apiError} If the assignment is not found.
 * @throws {apiError} If the assignment due date is outside the class duration.
 * @throws {apiError} If the assignment is not updated in the class.
 * @returns {Promise<object>} The updated assignment.
 */
const updateAssignmentInClass = async (
	classId,
	assignmentId,
	categoryId,
	updateData
) => {
	try {
		// check for class existence
		const classInfo = await prisma.class.findUnique({
			where: { classId },
			include: { Assignments: true }
		});

	  // check if exists
		if (!classInfo) {
			throw new apiError("Class not found", 404);
		}

	  // Check if the assignment exists
		const assignment = await prisma.assignment.findUnique({
			where: { assignmentId }
		});

		if (!assignment) {
			throw new apiError("Assignment not found", 404);
		}

		// Check if the assignment new due date is within the class duration
		let dueDate = new Date(updateData.dueDate);
		let startDate = new Date(classInfo.startDate);
		let endDate = new Date(classInfo.endDate);

		if (dueDate < startDate || dueDate > endDate) {
			throw new apiError(
				"Assignment due date is outside the class duration",
				400
			);
		}

		const updatedAssignment = await prisma.assignment.update({
			where: { assignmentId },
			data: {
				title: updateData.title,
				description: updateData.description,
				dueDate: updateData.dueDate,
				maxSubmissions: updateData.maxSubmissions,
				isPeerReviewAnonymous: updateData.isPeerReviewAnonymous,
				reviewOption: updateData.reviewOption,
				assignmentFilePath: updateData.assignmentFilePath,
				categoryId,
				rubricId: updateData.rubricId,
				allowedFileTypes: updateData.allowedFileTypes // Ensure this line is present
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

/**
 * @desc Get an assignment in a class.
 * @async
 * @param {string} classId - The ID of the class.
 * @param {string} assignmentId - The ID of the assignment.
 * @param {string} userId - The ID of the user.
 * @throws {apiError} If the class is not found.
 * @throws {apiError} If the assignment is not found.
 * @throws {apiError} If the user is not found.
 * @returns {Promise<object>} The assignment.
 */
const getAssignmentInClass = async (classId, assignmentId, userId = "") => {
	try {
		// Fetch the class information
		const classInfo = await prisma.class.findUnique({
			where: {
				classId: classId
			},
			include: {
				Assignments: true
			}
		});

	  // check if class exists
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

	  // check if assignment exists
		if (!assignment) {
			throw new apiError("Assignment not found", 404);
		}

		// Fetch user information if userId is provided
		if (userId) {
			const user = await prisma.user.findUnique({
				where: { userId },
				include: { extendedDueDates: true }
			});

			// check if the user exists
		if (!user) {
				throw new apiError("User not found", 404);
			}

			// Check if the user is a student and apply extended due date if available
			if (user.role === "STUDENT") {
				const extendedDueDate = user.extendedDueDates.find(
					(edd) => edd.assignmentId === assignmentId
				);
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

/**
 * @desc Get all assignments.
 * @async
 * @throws {apiError} If the assignments are not found.
 * @returns {Promise<object[]>} The list of assignments.
 */
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

/**
 * @desc Get all assignments by class ID.
 * @async
 * @param {string} classId - The ID of the class.
 * @param {string} userId - The ID of the user.
 * @throws {apiError} If the class is not found.
 * @throws {apiError} If the user is not found.
 * @throws {apiError} If the user is not a student.
 * @throws {apiError} If the user is not a teacher.
 * @throws {apiError} If the user is not an admin.
 * @throws {apiError} If the assignments are not found.
 * @returns {Promise<object[]>} The list of assignments.
 */
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

	  // check if class exists
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

			// check if user exists
		if (!user) {
				throw new apiError("User not found", 404);
			}

			// Check if the user is a student and apply extended due dates
			if (user.role === "STUDENT") {
				assignments = assignments.map((assignment) => {
					const extendedDueDate = user.extendedDueDates.find(
						(edd) => edd.assignmentId === assignment.assignmentId
					);
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
			throw new apiError(
				"Failed to get all the assignments for the specific class",
				500
			);
		}
	}
};

/**
 * @desc Extend the deadline for a student on an assignment.
 * @async
 * @param {string} studentId - The ID of the student.
 * @param {string} assignmentId - The ID of the assignment.
 * @param {string} newDueDate - The new due date.
 * @throws {apiError} If the assignment is not found.
 * @throws {apiError} If the user is not found.
 * @throws {apiError} If the new due date is after the original due date.
 * @throws {apiError} If the extension is not created.
 * @returns {Promise<object>} The new extension.
 */
const extendDeadlineForStudent = async (studentId, assignmentId, newDueDate) => {
	try {
		const assignment = await prisma.assignment.findUnique({
			where: { assignmentId }
		});
		const user = await prisma.user.findUnique({
			where: { userId: studentId }
		});

		// check if the assignment or user exists or if the new due date is after the original due date
		if (!assignment) {
			throw new apiError("Assignment not found", 404);
		} else if (!user) {
			throw new apiError("User not found", 404);
		} else if (new Date(newDueDate) <= new Date(assignment.dueDate)) {
			// Check if the new due date is after the original due date
			throw new apiError(
				"New due date must be after the original due date",
				400
			);
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
				updatedAt: new Date()
			},
			create: {
				userId: studentId,
				assignmentId,
				newDueDate
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
};

/** 
 * @desc Delete the extended deadline for a student on an assignment.
 * @async
 * @param {string} studentId - The ID of the student.
 * @param {string} assignmentId - The ID of the assignment.
 * @throws {apiError} If the record is not found.
 * @throws {apiError} If the record is not deleted.
 * @returns {Promise<object>} The deleted extension.
 */
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

		// check if the record exists
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
		} else if (error.code === "P2025") {
			console.log("Record not found");
			throw new apiError("Record not found", 404);
		} else {
			console.log(error);
			throw new apiError("Failed to delete extended due date", 500);
		}
	}
};

/**
 * @desc Add an assignment with a rubric to a class.
 * @async
 * @param {string} classId - The ID of the class.
 * @param {string} categoryId - The ID of the category.
 * @param {object} assignmentData - The assignment data.
 * @param {string} assignmentData.title - The title of the assignment.
 * @param {string} assignmentData.description - The description of the assignment.
 * @param {string} assignmentData.dueDate - The due date of the assignment.
 * @param {string} assignmentData.maxSubmissions - The maximum number of submissions allowed for the assignment.
 * @param {string} assignmentData.assignmentFilePath - The file path of the assignment.
 * @param {object} rubricData - The rubric data.
 * @param {string} rubricData.title - The title of the rubric.
 * @param {string} rubricData.description - The description of the rubric.
 * @param {object[]} rubricData.criteria - The criteria of the rubric.
 * @param {string} rubricData.criteria.criteria - The criterion of the rubric.
 * @param {object[]} rubricData.criteria.ratings - The ratings of the rubric.
 * @param {string} rubricData.criteria.ratings.text - The text of the rating.
 * @param {string} rubricData.criteria.ratings.points - The points of the rating.
 * @param {string} creatorId - The ID of the creator.
 * @throws {apiError} If the class is not found.
 * @throws {apiError} If the assignment due date is outside the class duration.
 * @throws {apiError} If the rubric is not created.
 * @throws {apiError} If the assignment with rubric is not created.
 * @returns {Promise<object>} The created assignment with rubric.
 */
const addAssignmentWithRubric = async (classId, categoryId, assignmentData, rubricData, creatorId) => {
	try {
		console.log("Received data in service:", {
			classId,
			categoryId,
			assignmentData,
			rubricData,
			creatorId
		});

		// Calculate totalMarks
		const totalMarks = rubricData.criteria.reduce((total, criterion) => {
			return (
				total +
				criterion.ratings.reduce(
					(subtotal, rating) => subtotal + parseFloat(rating.points),
					0
				)
			);
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
					create: rubricData.criteria.map((criterion) => ({
						title: criterion.criteria,
						maxMark: Math.max(
							...criterion.ratings.map((r) => parseFloat(r.points))
						),
						minMark: Math.min(
							...criterion.ratings.map((r) => parseFloat(r.points))
						),
						criterionRatings: {
							create: criterion.ratings.map((rating) => ({
								description: rating.text,
								points: parseInt(rating.points, 10)
							}))
						}
					}))
				}
			}
		});

		console.log("Created rubric:", newRubric);

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

		console.log("Created assignment:", newAssignment);

		return { assignment: newAssignment, rubric: newRubric };
	} catch (error) {
		console.error("Detailed error in addAssignmentWithRubric:", error);
		throw new apiError(
			`Failed to add assignment with rubric: ${error.message}`,
			500
		);
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
	deleteExtendedDeadlineForStudent,
	addAssignmentWithRubric
};
