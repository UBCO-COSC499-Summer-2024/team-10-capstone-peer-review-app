import { Router } from "express";
import passport from "passport";
// Routers
import authRouter from "./auth.js";
import instructorsRouter from "./instructors.js";
import studentsRouter from "./students.js";
// Middlewares
import localStrategy from "../middleware/passportStrategies/localStrategy.js";
import {
	ensureUser,
	ensureInstructor,
	ensureAdmin
} from "../middleware/ensureUserTypes.js";

const router = Router();

localStrategy(passport);
// Routes that do not require authentication
router.use("/auth", authRouter);
// Routes that require authentication
router.use("/students", ensureUser, studentsRouter);
router.use("/instructors", ensureUser, ensureInstructor, instructorsRouter);
router.use("/admins", ensureUser, ensureAdmin, instructorsRouter);

export default router;
