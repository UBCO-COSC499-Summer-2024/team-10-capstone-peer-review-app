import express from "express";
import {  
    getSubmissionCriteria,
    getReviews,
    getStudentReviews,
    getStudentGradeAsg,
    getStudentGradeClass,
    getGroupReviews,
    createGroupReviewRubric,
    updateGroupReview,
    deleteGroupReview,
    getInstructorReview,
    createReview,
    updateReview,
    deleteReview,
    getPeerReviews,
    getOpenReviewsAssignment,
    getClosedReviewsAssignment,
    getOpenReviewsClass,
    getClosedReviewsClass,
    addGroupReview
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Review route is working!");
});


// get a submission criteria
router.post("/submissionCriteria", getSubmissionCriteria);

// get all submissions that are open for reviews of an assignment
router.post("/openReviewsAsg", getOpenReviewsAssignment);

// get all submissions whose reviews are done of an assignment
router.post("/closedReviewsAsg", getClosedReviewsAssignment);

// // get all submissions of a class open for reviews
// router.post("/openReviewsClass", getOpenReviewsClass);

// // get all submissions of a class that are closed or done for reviews
// router.post("/closedReviewsClass", getClosedReviewsClass);

// // get all reviews for a student on a submission (peer or instructor check)
// router.post("/studentReviews", getStudentReviews);

// get student grade for an assignment (peer + instructor both)
router.post("/studentGradeAsg", getStudentGradeAsg);

// get student grade for a class (peer + instructor both)
router.post("/studentGradeClass", getStudentGradeClass);

// get all group reviews for a submission
router.post("/groupReviews", getGroupReviews);

// set up the group review rubric on an assignment
router.post("/createGroupReviewRubric", createGroupReviewRubric);

// enter the group review criteria on an assignment
router.post("/addGroupReview", addGroupReview);

// update a group review on a submission
router.put("/updateGroupReview", updateGroupReview);

// delete a group review on a submission
router.delete("/deleteGroupReview", deleteGroupReview);


// get all reviews by students for an assignment
router.post("/studentReview", getPeerReviews);

// get all reviews by an instructor for an assignment
router.post("/instructorReview", getInstructorReview);

// get the review done on an submission
router.post("/review", getReviews);

// create a review on a submission by a student (peer or instructor check)
router.post("/createReview", createReview); 

// update a review on a submission
router.post("/updateReview", updateReview);

// delete a review on a submission
router.delete("/deleteReview", deleteReview);

export default router;