/**
 * @module gradeService
 * @desc Provides functions for grading operations
 * Currrent, these functions are not used in the PeerGrade application
 * We access grades through the Reviews primarily through the front-end
 * however we are keeping them here for future use
 */

import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

/**
 * @async
 * @function getGrades
 * @desc Retrieves grades for a specific student
 * @param {number} studentId - The ID of the student
 * @returns {Promise<Array>} - An array of grades
 * @throws {apiError} - If failed to retrieve grades
 */
const getGrades = async (studentId) => {
	try {
		const reviews = await prisma.review.findMany({
			where: {
				revieweeId: studentId
			},
			include: {
				criterionGrades: true
			}
		});

		const grades = reviews.flatMap((review) => review.criterionGrades);

		return grades;
	} catch (error) {
		console.log(error);
		throw new apiError("Failed to retrieve grades", 500);
	}
};

/**
 * @async
 * @function getSubmissionGrade
 * @desc Retrieves the grade for a specific submission
 * @param {number} submissionId - The ID of the submission
 * @returns {Promise<number>} - The grade for the submission
 * @throws {apiError} - If failed to retrieve grade
 */
const getSubmissionGrade = async (submissionId) => {
	try {
		const submission = await prisma.review.findMany({
			where: {
				submissionId: submissionId
			},
			include: {
				reviewer: true,
				criterionGrades: true
			}
		});

		let grade = 0;
		if (submission.reviewer.role === "INSTRUCTOR") {
			const criterionGrades = submission.criterionGrades;
			criterionGrades.forEach((criterionGrade) => {
				grade += criterionGrade.grade;
			});
		}

		return grade;
	} catch (error) {
		throw new apiError("Failed to retrieve grade", 500);
	}
};

/**
 * @async
 * @function createGrade
 * @desc Creates a new grade
 * @param {Object} grade - The grade object to be created
 * @returns {Promise<Object>} - The newly created grade object
 * @throws {apiError} - If failed to create grade
 */
const createGrade = async (grade) => {
	try {
		const newGrade = await prisma.criterionGrade.create({
			data: grade
		});

		return newGrade;
	} catch (error) {
		throw new apiError("Failed to create grade", 500);
	}
};

/**
 * @async
 * @function updateGrade
 * @desc Updates an existing grade
 * @param {number} gradeId - The ID of the grade to be updated
 * @param {Object} grade - The updated grade object
 * @returns {Promise<Object>} - The updated grade object
 * @throws {apiError} - If failed to update grade
 */
const updateGrade = async (gradeId, grade) => {
	try {
		const updatedGrade = await prisma.criterionGrade.update({
			where: {
				criterionGradeId: gradeId
			},
			data: grade
		});

		return updatedGrade;
	} catch (error) {
		throw new apiError("Failed to update grade", 500);
	}
};

/**
 * @async
 * @function deleteGrade
 * @desc Deletes a grade
 * @param {number} gradeId - The ID of the grade to be deleted
 * @returns {Promise<Object>} - The deleted grade object
 * @throws {apiError} - If failed to delete grade
 */
const deleteGrade = async (gradeId) => {
	try {
		const deletedGrade = await prisma.criterionGrade.delete({
			where: {
				criterionGradeId: gradeId
			}
		});

		return deletedGrade;
	} catch (error) {
		throw new apiError("Failed to delete grade", 500);
	}
};

export default {
	getGrades,
	getSubmissionGrade,
	createGrade,
	updateGrade,
	deleteGrade
};
