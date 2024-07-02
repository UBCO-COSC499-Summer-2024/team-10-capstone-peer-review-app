import express from "express";
import {
  getStudentSubmission,
  getSubmissionsForAssignment,
  createSubmission,
  updateSubmission,
  deleteSubmission
} from "../controllers/submitController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Submit route is working!");
});

router.post("/studentSubmission", getStudentSubmission);

router.post("/submissionsForAssignment", getSubmissionsForAssignment);

router.post("/createSubmission", createSubmission);

router.put("/updateSubmission", updateSubmission);

router.delete("/deleteSubmission", deleteSubmission);


export default router;