import express from "express";
import {
	createEnrollRequest,
	getAllEnrollRequests,
	getEnrollRequestsForClass,
	getEnrollRequestsForUser,
	updateEnrollRequestStatus,
	deleteEnrollRequest
} from "../controllers/enrollRequestController.js";

import { ensureInstructor } from "src/middleware/ensureUserTypes";

const router = express.Router();

router
	.route("/")
	.post(createEnrollRequest)
	.get(ensureInstructor, getAllEnrollRequests);

router
	.route("/class/:classId")
	.get(ensureInstructor, getEnrollRequestsForClass);

router.route("/user").get(getEnrollRequestsForUser);

router
	.route("/:enrollRequestId")
	.put(ensureInstructor, updateEnrollRequestStatus)
	.delete(deleteEnrollRequest);

export default router;
