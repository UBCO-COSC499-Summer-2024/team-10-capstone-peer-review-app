import express from "express";
import { getUserClasses, getUserAssignments, getGroups } from "../controllers/userController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("User route is working!");
});

router.route("/get-classes").post(getUserClasses);
router.route("/get-assignments").post(getUserAssignments);
router.route("/get-groups").post(getGroups);

export default router;
