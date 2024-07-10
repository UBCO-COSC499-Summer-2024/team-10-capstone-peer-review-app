import express from "express";
import {
  getClassesHavingStudent,

  getClassById,

	getAssignment,
  getClassAssignment,

	getStudentAssignment,

  getCriterionInRubric,

  getRubricsInAssignment,

  addCriterionGrade,
  removeCriterionGrade,
  updateCriterionGrade,
  getCriterionGrade,

  updateGroupInClass, 
  getGroupInClass,
  getGroupsInClass,
  getGroupMembers

} from "../controllers/studentController.js";

import { ensureUser, ensureStudent } from "../middleware/ensureUserTypes.js";

const router = express.Router();

// Class Routes


router.route("/my-assignments")
  .get(ensureUser, ensureStudent, getStudentAssignment);

router.route("/my-classes")
  .get(ensureUser, ensureStudent, getClassesHavingStudent);

router.route("/get-assignment")
  .post(ensureUser, ensureStudent, getAssignment);

router.route("/get-class-assignment")
  .post(ensureUser, ensureStudent, getClassAssignment);

// Rubric Routes

router.route("/get-rubrics")
  .post(ensureUser, ensureStudent, getRubricsInAssignment);

// Criterion Routes

router.route("/get-criterion")
  .post(ensureUser, ensureStudent, getCriterionInRubric);

// Criterion Grade Routes
router.route("/give-criterion-grade")
  .post(ensureUser, ensureStudent, addCriterionGrade);

router.route("/remove-criterion-grade")
  .post(ensureUser, ensureStudent, removeCriterionGrade);

router.route("/update-criterion-grade")
  .post(ensureUser, ensureStudent, updateCriterionGrade);

router.route("/get-criterion-grade")
  .post(ensureUser, ensureStudent, getCriterionGrade);

// Group Routes

router.route("/update-group-info")
  .post(ensureUser, ensureStudent, updateGroupInClass);

router.route("/get-group")
  .post(ensureUser, ensureStudent, getGroupInClass);

router.route("/get-groups")
  .post(ensureUser, ensureStudent, getGroupsInClass);

router.route("/get-group-members")
  .post(ensureUser, ensureStudent, getGroupMembers);

router.route("/:classId")
  .get(ensureUser, ensureStudent, getClassById);

export default router;

