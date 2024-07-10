import express from "express";
import {
  addAssignmentToClass,
  removeAssignmentFromClass,
  updateAssignmentInClass,
  getAssignmentInClass,
  getAllAssignmentsByClassId,

} from "../controllers/assignController.js";

import { ensureUser, ensureInstructor, ensureAdmin } from "../middleware/ensureUserTypes.js";

const router = express.Router();

//Assignment Routes
router.route("/add-assignment")
  .post( ensureUser, ensureInstructor, addAssignmentToClass);

router.route("/remove-assignment")
  .post(ensureUser, ensureInstructor, removeAssignmentFromClass);

router.route("/update-assignment")
  .post(ensureUser, ensureInstructor, updateAssignmentInClass);

router.route("/get-assignment")
  .post(ensureUser, getAssignmentInClass);

router.route("/get-class-assignments")
  .post(ensureUser, getAllAssignmentsByClassId);


export default router;