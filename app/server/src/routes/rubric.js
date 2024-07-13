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
	removeRubricsFromAssignment,
	updateRubricsInAssignment,
	getRubricsInAssignment,
	addCriterionGrade,
	removeCriterionGrade,
	updateCriterionGrade,
	getCriterionGrade,
	addCriterionRating,
	
} from "../controllers/rubricController.js";

import {
	ensureUser,
	ensureInstructor,
	ensureAdmin,
} from "../middleware/ensureUserTypes.js";

const router = express.Router();

// Rubric Routes
console.log("rubric router");

router
	.route("/add-rubrics")
	.post(ensureUser, ensureInstructor, addRubricsToAssignment);

router
	.route("/remove-rubrics")
	.post(ensureUser, ensureInstructor, removeRubricsFromAssignment);

router
	.route("/update-rubrics")
	.post(ensureUser, ensureInstructor, updateRubricsInAssignment);

router
	.route("/get-rubrics")
	.post(ensureUser, getRubricsInAssignment);

router
	.route("/get-all-rubrics")
	.post(ensureUser, ensureInstructor, getAllRubrics);

router
	.route("/get-rubrics-in-class")
	.post(ensureUser, ensureInstructor, getAllRubricsInClass);

router
	.route("/get-rubric-by-id")
	.post(ensureUser, ensureInstructor, getRubricById);

// Criterion Routes
router
	.route("/add-criterion")
	.post(ensureUser, ensureInstructor, addCriterionToRubric);

router
	.route("/remove-criterion")
	.post(ensureUser, ensureInstructor, removeCriterionFromRubric);

router
	.route("/update-criterion")
	.post(ensureUser, ensureInstructor, updateCriterionInRubric);

router
	.route("/get-criterion")
	.post(ensureUser, ensureInstructor, getCriterionInRubric);

router
	.route("/add-criterion-rating")
	.post(ensureUser, ensureInstructor, addCriterionRating);
  
  //add update and delete here for rating

// Criterion Grade Routes
router
	.route("/give-criterion-grade")
	.post(ensureUser, ensureInstructor, addCriterionGrade);

router
	.route("/remove-criterion-grade")
	.post(ensureUser, ensureInstructor, removeCriterionGrade);

router
	.route("/update-criterion-grade")
	.post(ensureUser, ensureInstructor, updateCriterionGrade);

router
	.route("/get-criterion-grade")
	.post(ensureUser, ensureInstructor, getCriterionGrade);


export default router;
