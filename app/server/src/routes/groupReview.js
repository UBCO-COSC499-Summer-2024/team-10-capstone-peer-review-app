import express from "express";
import {  
    getGroupReviews,
    createGroupReviewRubric,
    updateGroupReview,
    deleteGroupReview,
    addGroupReview
} from "../controllers/groupReviewController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Group Review route is working!");
});

// get all group reviews for a submission
router.post("/groupReviews", getGroupReviews);

// set up the group review rubric on an assignment and checks if the user is logged in and then create the rubric
router.post("/createGroupReviewRubric", createGroupReviewRubric);

// enter the group review criteria on an assignment
router.post("/addGroupReview", addGroupReview);

// update a group review on a submission
router.put("/updateGroupReview", updateGroupReview);

// delete a group review on a submission
router.delete("/deleteGroupReview", deleteGroupReview);


export default router;