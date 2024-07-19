import express from "express";
import {
  addAssignmentToClass,
  removeAssignmentFromClass,
  updateAssignmentInClass,
  getAssignmentInClass,
  getAllAssignmentsByClassId,

} from "../controllers/assignController.js";

import { ensureUser, ensureInstructor, ensureAdmin, ensureInstructorOrAdmin } from "../middleware/ensureUserTypes.js";

const router = express.Router();

//Assignment Routes
router.route("/add-assignment")
  .post( ensureUser, ensureInstructorOrAdmin, addAssignmentToClass);

router.route("/remove-assignment")
  .post(ensureUser, ensureInstructorOrAdmin, removeAssignmentFromClass);

router.route("/update-assignment")
  .post(ensureUser, ensureInstructorOrAdmin, updateAssignmentInClass);

router.route("/get-assignment")
  .post(ensureUser, getAssignmentInClass);

router.route("/get-class-assignments")
  .post(ensureUser, getAllAssignmentsByClassId);


export default router;