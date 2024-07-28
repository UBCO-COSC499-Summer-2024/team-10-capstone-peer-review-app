import express from "express";
import {
	createEnrollRequest,
	getAllEnrollRequests,
	getEnrollRequestsForClass,
	getEnrollRequestsForUser,
	updateEnrollRequestStatus,
	deleteEnrollRequest
} from "../controllers/enrollRequestController.js";

import { ensureInstructorOrAdmin } from "../middleware/ensureUserTypes.js";

const router = express.Router();

router
	.route("/")
	.post(createEnrollRequest)
	.get(ensureInstructorOrAdmin, getAllEnrollRequests);

router
	.route("/class/:classId")
	.get(ensureInstructorOrAdmin, getEnrollRequestsForClass);

router.route("/user").get(getEnrollRequestsForUser);

router
	.route("/:enrollRequestId")
	.put(ensureInstructorOrAdmin, updateEnrollRequestStatus)
	.delete(deleteEnrollRequest);

export default router;
