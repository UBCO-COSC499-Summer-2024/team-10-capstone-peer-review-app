import express from "express";
import {

  getClassesByInstructor,

  getClassById,
  createClass,
  updateClass,
  deleteClass,

  addStudentToClass,
  removeStudentFromClass,

  addCriterionToRubric,
  removeCriterionFromRubric,
  updateCriterionInRubric,
  getCriterionInRubric,

  addRubricsToAssignment,
  removeRubricsFromAssignment,
  updateRubricsInAssignment,
  getRubricsInAssignment,

  addCriterionGrade,
  removeCriterionGrade,
  updateCriterionGrade,
  getCriterionGrade,

  addGroupToClass,
  removeGroupFromClass, 
  updateGroupInClass, 
  getGroupInClass,
  getGroupsInClass,
  getGroupMembers,
  addGroupMember,
  removeGroupMember,

  getCategoriesByClassId
} from "../controllers/classController.js";

import {
	ensureUser,
	ensureInstructor,
	ensureAdmin,
	ensureInstructorOrAdmin
} from "../middleware/ensureUserTypes.js";

const router = express.Router();

// Class Routes

router
	.route("/my-classes")
	.get(ensureUser, ensureInstructor, getClassesByInstructor);

router.route("/create").post(ensureUser, ensureInstructor, createClass);

router
	.route("/:classId")
	.get(ensureUser, getClassById)
	.put(ensureUser, ensureInstructor, updateClass)
	.delete(ensureUser, ensureInstructor, deleteClass);

router.route("/:classId/students").get(ensureUser, getStudentsByClass);
router.route("/:classId/instructor").get(ensureUser, getInstructorByClass);

// Student Routes
router
	.route("/add-student")
	.post(ensureUser, ensureInstructor, addStudentToClass);

router
	.route("/remove-student")
	.post(ensureUser, ensureInstructor, removeStudentFromClass);

// Rubric Routes

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
	.post(ensureUser, ensureInstructor, getRubricsInAssignment);

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

router.route("/add-group").post(ensureUser, ensureInstructorOrAdmin, addGroupToClass);

router
	.route("/remove-group")
	.post(ensureUser, ensureInstructor, removeGroupFromClass);

router
	.route("/update-group")
	.post(ensureUser, ensureInstructor, updateGroupInClass);

router.route("/get-group").post(ensureUser, ensureInstructor, getGroupInClass);

router
	.route("/get-groups")
	.post(ensureUser, getGroupsInClass);

router
	.route("/get-group-members")
	.post(ensureUser, ensureInstructor, getGroupMembers);

router
	.route("/add-group-member")
	.post(ensureUser, ensureInstructor, addGroupMember);

router
	.route("/remove-group-member")
	.post(ensureUser, ensureInstructor, removeGroupMember);

router.route("/:classId/categories").get(ensureUser, getCategoriesByClassId);

export default router;
