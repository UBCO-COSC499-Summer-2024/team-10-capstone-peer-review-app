/**
 * @fileoverview This file contains the functions that handle the submission of assignments by students.
 * @module submitService
 */
import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";
import { sendNotificationToUser } from "./notifsService.js";

// Submit operations
/**
 * @desc Retrieves all submissions for a student.
 * @param {string} studentId - The ID of the student.
 * @returns {Promise} A promise that contains the submissions for the student.
 * @throws {ApiError} If the operation fails, an error is thrown.
 * @async
 * @function getStudentSubmission
 */
const getStudentSubmission = async (studentId) => {
	try {
		const allSubmissions = await prisma.submission.findMany({
			where: {
				submitterId: studentId
			},
			include: {
				assignment: {
					include: {
						classes: {
							include: {
								instructor: {
									select: {
										firstname: true,
										lastname: true
									}
								}
							}
						}
					}
				},
				reviews: {
					select: {
						isPeerReview: true
					}
				}
			}
		});

		return allSubmissions;
	} catch (error) {
		console.error("Error in getStudentSubmission:", error);
		throw new apiError("Failed to retrieve submissions: " + error.message, 500);
	}
};

/**
 * @desc Retrieves all submissions for a student for a specific assignment.
 * @param {string} studentId - The ID of the student.
 * @param {string} assignmentId - The ID of the assignment.
 * @returns {Promise} A promise that contains the submissions for the student for the assignment.
 * @throws {ApiError} If the operation fails, an error is thrown.
 * @async
 * @function getStudentSubmissionForAssignment
 */
const getStudentSubmissionForAssignment = async (studentId, assignmentId) => {
	try {
		const allSubmissions = await prisma.submission.findMany({
			where: {
				submitterId: studentId,
				assignmentId: assignmentId
			},
			include: {
				assignment: {
					include: {
						classes: {
							include: {
								instructor: {
									select: {
										firstname: true,
										lastname: true
									}
								}
							}
						}
					}
				},
				reviews: {
					select: {
						isPeerReview: true
					}
				}
			}
		});

		// Ensure that only submissions for this specific student are returned
		const filteredSubmissions = allSubmissions.filter(
			(submission) => submission.submitterId === studentId
		);

		return filteredSubmissions;
	} catch (error) {
		console.error("Error in getStudentSubmissionForAssignment:", error);
		throw new apiError("Failed to retrieve submissions: " + error.message, 500);
	}
};

/**
 * @desc Retrieves all submissions for an assignment.
 * @param {string} assignmentId - The ID of the assignment.
 * @returns {Promise} A promise that contains the submissions for the assignment.
 * @throws {ApiError} If the operation fails, an error is thrown.
 * @async
 * @function getSubmissionsForAssignment
 */
const getSubmissionsForAssignment = async (assignmentId) => {
	try {
		const assignment = await prisma.submission.findMany({
			where: {
				assignmentId: assignmentId
			}
		});

		return assignment;
	} catch (error) {
		throw new apiError("Failed to retrieve assignment", 500);
	}
};

/**
 * @desc Creates a submission for a student.
 * @param {string} studentId - The ID of the student.
 * @param {string} assignmentId - The ID of the assignment.
 * @param {string} submissionFilePath - The file path of the submission.
 * @returns {Promise} A promise that contains the created submission.
 * @throws {ApiError} If the operation fails, an error is thrown.
 * @throws {ApiError} If the assignment is overdue, an error is thrown.
 * @throws {ApiError} If the student is not in a group, an error is thrown.
 * @throws {ApiError} If the group is not in the class, an error is thrown.
 * @throws {ApiError} If the group has no students, an error is thrown.
 * @throws {ApiError} If the student is not in a class, an error is thrown.
 * @throws {ApiError} If the class is not found, an error is thrown.
 * @throws {ApiError} If the group is not found, an error is thrown.
 * @async
 * @function createSubmission
 */
const createSubmission = async (
	studentId,
	assignmentId,
	submissionFilePath
) => {
	try {
		let submitterGroupId, submitterId;
		const assignment = await prisma.assignment.findFirst({
			where: {
				assignmentId: assignmentId
			}
		});

		const student = await prisma.user.findFirst({
			where: {
				userId: studentId,
				role: "STUDENT"
			},
			include: {
				classes: true,
				groups: true,
				extendedDueDates: true,
				submissions: true
			}
		});
		// Check if the assignment and student exist
		if (!assignment || !student) {
			throw new apiError("Assignment or student not found", 404);
		}

		const extendedDueDate = student.extendedDueDates.find(
			(d) => d.assignmentId === assignmentId
		);
		// Check if the assignment is overdue
		if (
			assignment.dueDate < new Date() &&
			(!extendedDueDate || extendedDueDate.newDueDate < new Date())
		) {
			throw new apiError("Assignment is overdue", 400);
		}
		// Check if the student has reached the max submissions
		if (
			assignment.maxSubmissions <=
			student.submissions?.filter((s) => s.assignmentId === assignmentId).length
		) {
			throw new apiError("Max submissions reached", 400);
		}
		// Check if the assignment is a group assignment
		if (assignment.isGroup) {
			if (student.groups === null || student.groups.length === 0) {
				throw new apiError("Student is not in a group", 400);
			}
			// Find the group the student is in
			let xgroup;
			for (const group of student.groups) {
				if (group.classId === assignment.classId) {
					xgroup = group;
					break;
				}
			}
			// Check if the group is in the class
			if (!xgroup) {
				throw new apiError("Group not in class", 404);
			}

			const group = await prisma.group.findFirst({
				where: {
					groupId: xgroup.groupId
				},
				include: {
					students: true
				}
			});
			// Check if the group has students
			if (!group) {
				throw new apiError("Group not found", 404);
			}
			// Check if the group has students
			if (group.students === null || group.students.length === 0) {
				throw new apiError("Group has no students", 400);
			}

			submitterGroupId = xgroup.groupId;
			submitterId = studentId;
		} else {
			// Check if the student is in a class
			if (student.classes === null || student.classes.length === 0) {
				throw new apiError("Student is not in a class", 400);
			}
			// Find the class the student is in
			let xclass;
			for (const c of student.classes) {
				if (c.classId === assignment.classId) {
					xclass = c;
					break;
				}
			}
			// Check if the student is in the class
			if (!xclass) {
				throw new apiError("Class not found", 404);
			}

			submitterGroupId = null;
			submitterId = studentId;
		}
		const newSubmission = await prisma.submission.create({
			data: {
				submitterId: submitterId,
				submitterGroupId: submitterGroupId,
				assignmentId: assignmentId,
				submissionFilePath: submissionFilePath
			}
		});

		const assignmentClass = await prisma.class.findUnique({
			where: {
				classId: assignment.classId
			},
			include: {
				instructor: true
			}
		});

		await sendNotificationToUser(
			null,
			`You've successfully submitted the '${assignment.title}' assignment`,
			assignmentClass.classname,
			studentId,
			"submit"
		);
		await sendNotificationToUser(
			null,
			`Student ${student.firstname} ${student.lastname} submitted the '${assignment.title}' assignment`,
			assignmentClass.classname,
			assignmentClass.instructor.userId,
			"submit"
		);
		return newSubmission;
	} catch (error) {
		throw new apiError("Failed to create submission" + error, 500);
	}
};

/**
 * @desc Updates a submission.
 * @param {string} submissionId - The ID of the submission.
 * @param {object} submission - The submission object.
 * @returns {Promise} A promise that contains the updated submission.
 * @throws {ApiError} If the operation fails, an error is thrown.
 * @async
 * @function updateSubmission
 */
const updateSubmission = async (submissionId, submission) => {
	try {
		const updatedSubmission = await prisma.submission.update({
			where: {
				submissionId: submissionId
			},
			data: submission
		});

		return updatedSubmission;
	} catch (error) {
		throw new apiError("Failed to update submission " + error, 500);
	}
};

/**
 * @desc Deletes a submission.
 * @param {string} submissionId - The ID of the submission.
 * @returns {Promise} A promise that contains the deleted submission.
 * @throws {ApiError} If the operation fails, an error is thrown.
 * @async
 * @function deleteSubmission
 */
const deleteSubmission = async (submissionId) => {
	try {
		await prisma.submission.delete({
			where: {
				submissionId: submissionId
			}
		});

		return;
	} catch (error) {
		throw new apiError("Failed to delete submission", 500);
	}
};

export default {
	getStudentSubmission,
	getStudentSubmissionForAssignment,
	getSubmissionsForAssignment,
	createSubmission,
	updateSubmission,
	deleteSubmission
};
