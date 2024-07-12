import express from "express";
import {  
  getGrades,
  getSubmissionGrade,
  createGrade,
  updateGrade,
  deleteGrade
} from "../controllers/gradeController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Grade route is working!");
});

router.get("/grades", getGrades);

router.get("/submissionGrade", getSubmissionGrade);

router.post("/createGrade", createGrade);

router.put("/updateGrade", updateGrade);

router.delete("/deleteGrade", deleteGrade);



export default router;