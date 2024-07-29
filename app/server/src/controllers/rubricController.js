// Import necessary modules and services
import rubricService from "../services/rubricService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

export const addRubricsToAssignment = asyncErrorHandler(async (req, res) => {
    const { userId, assignmentId, rubricData } = req.body;
    const updatedClass = await rubricService.createRubricsForAssignment(userId, assignmentId, rubricData);
    return res.status(200).json({
        status: "Success",
        message: "Rubric successfully added to assignment",
        data: updatedClass,
    });
});

export const deleteRubricsFromAssignment = asyncErrorHandler(async (req, res) => {
	const { rubricId } = req.body;
	const updatedClass = await rubricService.deleteRubricsFromAssignment(rubricId);
	return res.status(200).json({
		status: "Success",
		message: "Rubric successfully removed from assignment",
		data: updatedClass,
	});
});

export const updateRubricsForAssignment = asyncErrorHandler(async (req, res) => {
	const { rubricId, updateData } = req.body;
	const updatedClass = await rubricService.updateRubricsForAssignment(rubricId, updateData);
	return res.status(200).json({
		status: "Success",
		message: "Rubric successfully updated in assignment",
		data: updatedClass,
	});
});

export const getRubricsInAssignment = asyncErrorHandler(async (req, res) => {
	const { assignmentId } = req.body;
	const rubricData = await rubricService.getRubricsForAssignment(assignmentId);
	return res.status(200).json({
		status: "Success",
		data: rubricData,
	});
});

export const getAllRubrics = asyncErrorHandler(async (req, res) => {
	const rubrics = await rubricService.getAllRubrics();
	return res.status(200).json({
		status: "Success",
		data: rubrics,
	});
});

export const getAllRubricsInClass = asyncErrorHandler(async (req, res) => {
	const { classId } = req.body;
	const rubrics = await rubricService.getAllRubricsInClass(classId);
	return res.status(200).json({
		status: "Success",
		data: rubrics,
	});
});

export const getRubricById = asyncErrorHandler(async (req, res) => {
	const { rubricId } = req.body;
	console.log(rubricId);
	const rubric = await rubricService.getRubricById(rubricId);
	return res.status(200).json({
		status: "Success",
		data: rubric,
	});
});


// Controller methods for criterion operations
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

export const removeCriterionFromRubric = asyncErrorHandler(async (req, res) => {
	const { criterionId } = req.body;
	const updatedClass = await rubricService.deleteCriterionForRubric(criterionId);
	return res.status(200).json({
		status: "Success",
		message: "Criterion successfully removed from rubric",
		data: updatedClass
	});
});

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

export const getCriterionInRubric = asyncErrorHandler(async (req, res) => {
	const { rubricId } = req.body;
	const criterionData = await rubricService.getCriterionForRubric(rubricId);
	return res.status(200).json({
		status: "Success",
		data: criterionData
	});
});

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

//add update and delete here

// Controller methods for criterion Grade operations
export const addCriterionGrade = asyncErrorHandler(async (req, res) => {
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

export const removeCriterionGrade = asyncErrorHandler(async (req, res) => {
	const { criterionId } = req.body;
	const updatedClass = await rubricService.deleteCriterionForRubric(criterionId);
	return res.status(200).json({
		status: "Success",
		message: "Criterion successfully removed from rubric",
		data: updatedClass
	});
});

export const updateCriterionGrade = asyncErrorHandler(async (req, res) => {
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

export const getCriterionGrade = asyncErrorHandler(async (req, res) => {
	const { rubricId } = req.body;
	const criterionData = await rubricService.getCriterionForRubric(rubricId);
	return res.status(200).json({
		status: "Success",
		data: criterionData
	});
});


export const linkRubricToAssignments = asyncErrorHandler(async (req, res) => {
    const { rubricId, assignmentIds } = req.body;
    if (!rubricId || !assignmentIds) {
        return res.status(400).json({
            status: "Error",
            message: "Invalid input: rubricId and assignmentIds are required"
        });
    }
    
    const assignmentIdsArray = Array.isArray(assignmentIds) ? assignmentIds : [assignmentIds];
    
    const result = await rubricService.linkRubricToAssignments(rubricId, assignmentIdsArray);
    return res.status(200).json({
        status: "Success",
        message: "Rubric successfully linked to assignments",
        data: result,
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

	addCriterionGrade,
	removeCriterionGrade,
	updateCriterionGrade,
	getCriterionGrade,
	addCriterionRating,

	linkRubricToAssignments,
};