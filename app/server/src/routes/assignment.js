import express from "express";
import {
  addAssignmentToClass,
  removeAssignmentFromClass,
  updateAssignmentInClass,
  getAssignmentInClass,
  getAllAssignments,
  getAllAssignmentsByClassId,
  addAssignmentWithRubric

} from "../controllers/assignController.js";

import { addComment, getComments } from "../controllers/commentController.js";

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

  router.route("/get-all-assignments")
    .post(ensureUser, ensureAdmin, getAllAssignments);

router.route("/get-class-assignments")
  .post(ensureUser, getAllAssignmentsByClassId);

router.route("/add-assignment-with-rubric")
  .post(ensureUser, ensureInstructorOrAdmin, addAssignmentWithRubric);


router.route("/:assignmentId/comments")
  .get(ensureUser, getComments)
  .post(ensureUser, addComment);

export default router;