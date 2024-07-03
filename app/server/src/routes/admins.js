import express from "express";
import {
	getAdminByID,
	getAllUsers,
	getAllClasses,
} from "../controllers/adminController.js";

import {
	ensureUser,
	ensureAdmin,
} from "../middleware/ensureUserTypes.js";

const router = express.Router();

// Class Routes

router.route("/all-users").post(ensureUser, ensureAdmin, getAllUsers);

router.route("/all-classes").post(ensureUser, ensureAdmin, getAllClasses);

router.route("/:adminId").post(ensureUser, ensureAdmin, getAdminByID);

export default router;
