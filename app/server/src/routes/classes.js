import express from "express";
import {
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass
} from "../controllers/classController.js"; 

import { ensureUser, ensureInstructor, ensureAdmin } from "../middleware/ensureUserTypes.js";

const router = express.Router();

router.route("/create")
  .post(ensureUser, ensureInstructor, createClass);

router.route("/:classId")
  .get(ensureUser, getClassById)
  .put(ensureUser, ensureInstructor, updateClass)
  .delete(ensureUser, ensureInstructor, deleteClass);

router.route("/add-student")
  .post(ensureUser, ensureInstructor, addStudentToClass);

router.route("/remove-student")
  .post(ensureUser, ensureInstructor, removeStudentFromClass);

export default router;