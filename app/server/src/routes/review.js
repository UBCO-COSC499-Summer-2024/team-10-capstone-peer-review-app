import express from "express";
import {  
  getStudentReview,
    getInstructorReview,
    getAllReviews,
    createReview,
    updateReview,
    deleteReview
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Review route is working!");
});

router.post("/studentReview", getStudentReview);

router.post("/instructorReview", getInstructorReview);

router.post("/allReviews", getAllReviews);

router.post("/createReview", createReview);

router.put("/updateReview", updateReview);

router.delete("/deleteReview", deleteReview);

export default router;