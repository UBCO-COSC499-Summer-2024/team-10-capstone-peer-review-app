import express from "express";
import {
  getStudentSubmission,
  getSubmissionsForAssignment,
  createSubmission,
  updateSubmission,
  deleteSubmission
} from "../controllers/submitController.js";

import { ensureInstructorOrAdmin } from "../middleware/ensureUserTypes.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Submit route is working!");
});

router.post("/studentSubmissions", getStudentSubmission);
router.post("/studentSubmissionsForAssignment", getSubmissionsForAssignment);

router.post("/submissionsForAssignment", ensureInstructorOrAdmin, getSubmissionsForAssignment);

router.post("/createSubmission", createSubmission);

router.put("/updateSubmission", updateSubmission);

router.delete("/deleteSubmission", ensureInstructorOrAdmin, deleteSubmission);


export default router;