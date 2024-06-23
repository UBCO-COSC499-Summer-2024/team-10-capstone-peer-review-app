import express from "express";
import { getUserClasses, getUserAssignments } from "../controllers/userController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("User route is working!");
});

router.route("/get-classes").post(getUserClasses);
router.route("/get-assignments").post(getUserAssignments);

export default router;
