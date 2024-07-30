import express from "express";
import {
	getInstructorReview,
	getAllReviews,
	getReviewsForAssignment,
	createReview,
	assignRandomPeerReviews,
	updateReview,
	deleteReview,
	getPeerReviews,
	getReviewDetails,
	getReviewsAssigned,
	getReviewsReceived,
	getReviewById
} from "../controllers/reviewController.js";

import { ensureInstructor } from "../middleware/ensureUserTypes.js";

const router = express.Router();

router.get("/", (req, res) => {
	res.status(200).send("Review route is working!");
});

router.post("/studentReview", getPeerReviews);

router.post("/instructorReview", getInstructorReview);

router.get("/received", getReviewsReceived);

router.get("/assigned", getReviewsAssigned);

router.get("/assignment/:assignmentId", getReviewsForAssignment);

router.post("/allReviews", getAllReviews);

router.post("/reviewId", getReviewById);

router.post("/createReview", ensureInstructor, createReview);

router.post("/assignPeerReviews", assignRandomPeerReviews);

router.get("/reviewDetails/:reviewId", getReviewDetails);

router.put("/updateReview", updateReview);

router.delete("/deleteReview", ensureInstructor, deleteReview);

export default router;
