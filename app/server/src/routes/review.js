import express from "express";
import {  
    getSubmissionCriteria,
    getReviews,
    getStudentReviews,
    getStudentAverageGrade,
    getGroupReviews,
    createGroupReview,
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
    getClosedReviewsClass
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Review route is working!");
});


// remove rubricForAssignment from the schema

// create docs and tests
//check if the add student/ group / assignment and anything if the instructor is even in the class
// student should be a student of the class to submit a review and before joining a group of class
// get student average grade for all instructor assignments and peer reviews assigned
// restrict criterion grading for student if the assignment is not peer review or group review
// add file type
// create csv upload feature students
// get Review Assignments assigned
// grade peer reviews for students
// get all reviews for a student
// update the peer review
// create a group review to review individual contributions
// submit accoriding to the max Submissions allowed and delete previous attempts

// get a submission criteria
router.post("/submissionCriteria", getSubmissionCriteria);

// get all open reviews for an assignment
router.post("/openReviewsAsg", getOpenReviewsAssignment);

// get all closed reviews for an assignment
router.post("/closedReviewsAsg", getClosedReviewsAssignment);

// get all open reviews for a class
router.post("/openReviewsClass", getOpenReviewsClass);

// get all closed reviews for a class
router.post("/closedReviewsClass", getClosedReviewsClass);

// get all reviews for a student on a submission (peer or instructor check)
router.post("/studentReviews", getStudentReviews);

router.post("/studentAverageGrade", getStudentAverageGrade);

// get all group reviews for a submission
router.post("/groupReviews", getGroupReviews);

// create a group review on a submission
router.post("/createGroupReview", createGroupReview);

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