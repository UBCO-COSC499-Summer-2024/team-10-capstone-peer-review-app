import express from "express";
import {
	addCriterionToRubric,
	removeCriterionFromRubric,
	updateCriterionInRubric,
	getCriterionInRubric,
	addRubricsToAssignment,
	getAllRubrics,
	getAllRubricsInClass,
	getRubricById,
	deleteRubricsFromAssignment,
	updateRubricsForAssignment,
	getRubricsInAssignment,
	addCriterionGrade,
	removeCriterionGrade,
	updateCriterionGrade,
	getCriterionGrade,
	addCriterionRating,
	
} from "../controllers/rubricController.js";

import {
	ensureUser,
	ensureInstructorOrAdmin,
	ensureAdmin,
} from "../middleware/ensureUserTypes.js";

const router = express.Router();

// Rubric Routes
console.log("rubric router");

router
	.route("/add-rubrics")
	.post(ensureUser, ensureInstructorOrAdmin, addRubricsToAssignment);

router
	.route("/remove-rubric")
	.post( deleteRubricsFromAssignment);

router
	.route("/update-rubrics")
	.post(ensureUser, ensureInstructorOrAdmin, updateRubricsForAssignment);

router
	.route("/get-rubrics")
	.post(ensureUser, getRubricsInAssignment);

router
	.route("/get-all-rubrics")
	.post(ensureUser, ensureInstructorOrAdmin, getAllRubrics);

router
	.route("/get-rubrics-in-class")
	.post(ensureUser, ensureInstructorOrAdmin, getAllRubricsInClass);

router
	.route("/get-rubric-by-id")
	.post( getRubricById);

// Criterion Routes
router
	.route("/add-criterion")
	.post(ensureUser, ensureInstructorOrAdmin, addCriterionToRubric);

router
	.route("/remove-criterion")
	.post(ensureUser, ensureInstructorOrAdmin, removeCriterionFromRubric);

router
	.route("/update-criterion")
	.post(ensureUser, ensureInstructorOrAdmin, updateCriterionInRubric);

router
	.route("/get-criterion")
	.post(ensureUser, ensureInstructorOrAdmin, getCriterionInRubric);

router
	.route("/add-criterion-rating")
	.post(ensureUser, ensureInstructorOrAdmin, addCriterionRating);
  
  //add update and delete here for rating

// Criterion Grade Routes
router
	.route("/give-criterion-grade")
	.post(ensureUser, ensureInstructorOrAdmin, addCriterionGrade);

router
	.route("/remove-criterion-grade")
	.post(ensureUser, ensureInstructorOrAdmin, removeCriterionGrade);

router
	.route("/update-criterion-grade")
	.post(ensureUser, ensureInstructorOrAdmin, updateCriterionGrade);

router
	.route("/get-criterion-grade")
	.post(ensureUser, ensureInstructorOrAdmin, getCriterionGrade);


export default router;
