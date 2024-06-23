import express from "express";
import {
  getClassById,
  createClass,
  updateClass,
  deleteClass,

  addStudentToClass,
  removeStudentFromClass,

  addAssignmentToClass,
  removeAssignmentFromClass,
  updateAssignmentInClass,
  getAssignmentInClass,

  addCriterionToRubric,
  removeCriterionFromRubric,
  updateCriterionInRubric,
  getCriterionInRubric,

  addRubricsToAssignment,
  removeRubricsFromAssignment,
  updateRubricsInAssignment,
  getRubricsInAssignment

} from "../controllers/classController.js"; 

import { ensureUser, ensureInstructor, ensureAdmin } from "../middleware/ensureUserTypes.js";

const router = express.Router();

// Class Routes
router.route("/create")
  .post(ensureUser, ensureInstructor, createClass);

router.route("/:classId")
  .get(ensureUser, getClassById)
  .put(ensureUser, ensureInstructor, updateClass)
  .delete(ensureUser, ensureInstructor, deleteClass);

// Student Routes
router.route("/add-student")
  .post(ensureUser, ensureInstructor, addStudentToClass);

router.route("/remove-student")
  .post(ensureUser, ensureInstructor, removeStudentFromClass);


//Assignment Routes
router.route("/add-assignment")
  .post(ensureUser, ensureInstructor, addAssignmentToClass);

router.route("/remove-assignment")
  .post(ensureUser, ensureInstructor, removeAssignmentFromClass);

router.route("/update-assignment")
  .post(ensureUser, ensureInstructor, updateAssignmentInClass);

router.route("/get-assignment")
  .post(ensureUser, ensureInstructor, getAssignmentInClass);


export default router;