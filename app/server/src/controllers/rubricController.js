/**
 * @module rubricController
 * @desc Controller module for handling rubric-related operations
 */

// Import necessary modules and services
import rubricService from "../services/rubricService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

/**
 * @async
 * @function createRubricsForAssignment
 * @desc Adds rubrics to an assignment
 * @param {Object} req - The request object containing the userId, assignmentId, and rubricData
 * @returns {Object} The updated class object
 */
export const addRubricsToAssignment = asyncErrorHandler(async (req, res) => {
	const { userId, assignmentId, rubricData } = req.body;
	const updatedClass = await rubricService.createRubricsForAssignment(
		userId,
		assignmentId,
		rubricData
	);
	return res.status(200).json({
		status: "Success",
		message: "Rubric successfully added to assignment",
		data: updatedClass
	});
});

/**
 * @async
 * @function deleteRubricsFromAssignment
 * @desc Deletes rubrics from an assignment
 * @param {Object} req - The request object containing the rubricId
 * @returns {Object} The updated class object
 */
export const deleteRubricsFromAssignment = asyncErrorHandler(
	async (req, res) => {
		const { rubricId } = req.body;
		const updatedClass =
			await rubricService.deleteRubricsFromAssignment(rubricId);
		return res.status(200).json({
			status: "Success",
			message: "Rubric successfully removed from assignment",
			data: updatedClass
		});
	}
);

/**
 * @async
 * @function updateRubricsForAssignment
 * @desc Updates rubrics for an assignment
 * @param {Object} req - The request object containing the rubricId and updateData
 * @returns {Object} The updated class object
 */
export const updateRubricsForAssignment = asyncErrorHandler(
	async (req, res) => {
		const { rubricId, updateData } = req.body;
		const updatedClass = await rubricService.updateRubricsForAssignment(
			rubricId,
			updateData
		);
		return res.status(200).json({
			status: "Success",
			message: "Rubric successfully updated in assignment",
			data: updatedClass
		});
	}
);

/**
 * @async
 * @function getRubricsInAssignment
 * @desc Gets rubrics in an assignment
 * @param {Object} req - The request object containing the assignmentId
 * @returns {Object} The rubric data
 */
export const getRubricsInAssignment = asyncErrorHandler(async (req, res) => {
	const { assignmentId } = req.body;
	const rubricData = await rubricService.getRubricsForAssignment(assignmentId);
	return res.status(200).json({
		status: "Success",
		data: rubricData
	});
});

/**
 * @async
 * @function getAllRubrics
 * @desc Gets all rubrics
 * @returns {Object} The rubrics data
 */
export const getAllRubrics = asyncErrorHandler(async (req, res) => {
	const rubrics = await rubricService.getAllRubrics();
	return res.status(200).json({
		status: "Success",
		data: rubrics
	});
});

/**
 * @async
 * @function getAllRubricsInClass
 * @desc Gets all rubrics in a class
 * @param {Object} req - The request object containing the classId
 * @returns {Object} The rubrics data
 */
export const getAllRubricsInClass = asyncErrorHandler(async (req, res) => {
	const { classId } = req.body;
	const rubrics = await rubricService.getAllRubricsInClass(classId);
	return res.status(200).json({
		status: "Success",
		data: rubrics
	});
});

/**
 * @async
 * @function getRubricById
 * @desc Gets a rubric by its ID
 * @param {Object} req - The request object containing the rubricId
 * @returns {Object} The rubric data
 */
export const getRubricById = asyncErrorHandler(async (req, res) => {
	const { rubricId } = req.body;
	console.log(rubricId);
	const rubric = await rubricService.getRubricById(rubricId);
	return res.status(200).json({
		status: "Success",
		data: rubric
	});
});

/**
 * @async
 * @function addCriterionToRubric
 * @desc Adds a criterion to a rubric
 * @param {Object} req - The request object containing the rubricId and criterionData
 * @returns {Object} The updated class object
 */
export const addCriterionToRubric = asyncErrorHandler(async (req, res) => {
	const { rubricId, criterionData } = req.body;
	const updatedClass = await rubricService.createCriterionForRubric(
		rubricId,
		criterionData
	);
	return res.status(200).json({
		status: "Success",
		message: "Criterion successfully added to rubric",
		data: updatedClass
	});
});

/**
 * @async
 * @function removeCriterionFromRubric
 * @desc Removes a criterion from a rubric
 * @param {Object} req - The request object containing the criterionId
 * @returns {Object} The updated class object
 */
export const removeCriterionFromRubric = asyncErrorHandler(async (req, res) => {
	const { criterionId } = req.body;
	const updatedClass =
		await rubricService.deleteCriterionForRubric(criterionId);
	return res.status(200).json({
		status: "Success",
		message: "Criterion successfully removed from rubric",
		data: updatedClass
	});
});

/**
 * @async
 * @function updateCriterionInRubric
 * @desc Updates a criterion in a rubric
 * @param {Object} req - The request object containing the criterionId and updateData
 * @returns {Object} The updated class object
 */
export const updateCriterionInRubric = asyncErrorHandler(async (req, res) => {
	const { criterionId, updateData } = req.body;
	const updatedClass = await rubricService.updateCriterionForRubric(
		criterionId,
		updateData
	);
	return res.status(200).json({
		status: "Success",
		message: "Criterion successfully updated in rubric",
		data: updatedClass
	});
});

/**
 * @async
 * @function getCriterionInRubric
 * @desc Gets the criterion in a rubric
 * @param {Object} req - The request object containing the rubricId
 * @returns {Object} The criterion data
 */
export const getCriterionInRubric = asyncErrorHandler(async (req, res) => {
	const { rubricId } = req.body;
	const criterionData = await rubricService.getCriterionForRubric(rubricId);
	return res.status(200).json({
		status: "Success",
		data: criterionData
	});
});

/**
 * @async
 * @function addCriterionRating
 * @desc Adds a rating to a criterion
 * @param {Object} req - The request object containing the criterionId and ratingData
 * @returns {Object} The new rating data
 */
export const addCriterionRating = asyncErrorHandler(async (req, res) => {
	const { criterionId, ratingData } = req.body;
	const newRating = await rubricService.createCriterionRating(
		criterionId,
		ratingData
	);
	return res.status(201).json({
		status: "Success",
		message: "Criterion rating successfully added",
		data: newRating
	});
});

/**
 * @async
 * @function linkRubricToAssignments
 * @desc Links a rubric to multiple assignments and checks if the rubric or assignment exists or is array else converts to array
 * @param {Object} req - The request object containing the rubricId and assignmentIds
 * @returns {Object} The result of the linking operation
 */
export const linkRubricToAssignments = asyncErrorHandler(async (req, res) => {
	const { rubricId, assignmentIds } = req.body;
	if (!rubricId || !assignmentIds) {
		return res.status(400).json({
			status: "Error",
			message: "Invalid input: rubricId and assignmentIds are required"
		});
	}

	const assignmentIdsArray = Array.isArray(assignmentIds)
		? assignmentIds
		: [assignmentIds];

	const result = await rubricService.linkRubricToAssignments(
		rubricId,
		assignmentIdsArray
	);
	return res.status(200).json({
		status: "Success",
		message: "Rubric successfully linked to assignments",
		data: result
	});
});

// Export all controller methods
export default {
	addRubricsToAssignment,
	deleteRubricsFromAssignment,
	updateRubricsForAssignment,
	getRubricsInAssignment,
	getAllRubrics,
	getAllRubricsInClass,
	getRubricById,
	addCriterionToRubric,
	removeCriterionFromRubric,
	updateCriterionInRubric,
	getCriterionInRubric,
	addCriterionRating,
	linkRubricToAssignments
};
