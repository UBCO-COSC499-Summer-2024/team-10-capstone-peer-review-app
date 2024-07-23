import express from "express";
import {  
    getInstructorReview,
    getAllReviews,
    createReview,
    updateReview,
    deleteReview,
    getPeerReviews,
    getReviewDetails,
    getReviewsAssigned, 
    getReviewsReceived, 
    getReviewById
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Review route is working!");
});

router.post("/studentReview", getPeerReviews);

router.post("/instructorReview", getInstructorReview);

router.get("/received", getReviewsReceived);  

router.get("/assigned", getReviewsAssigned);

router.post("/allReviews", getAllReviews);

router.post("/reviewId", getReviewById);

router.post("/createReview", createReview);

router.get("/reviewDetails/:reviewId", getReviewDetails);

router.put("/updateReview", updateReview);

router.delete("/deleteReview", deleteReview);

export default router;