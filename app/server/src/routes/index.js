/**
 * @module routes/index
 * @file This file defines the routes for the application.
 */
import { Router } from "express";
import passport from "passport";
// Routers
import authRouter from "./auth.js";
import classesRouter from "./classes.js";
import instructorsRouter from "./instructors.js";
import studentsRouter from "./students.js";
import usersRoutes from "./usersRoutes.js";
import notifsRouter from "./notifs.js";
import gradesRouter from "./grade.js";
import reviewRouter from "./review.js";
import submitRouter from "./submit.js";
import assignmentRouter from "./assignment.js";
import rubricRouter from "./rubric.js";
import enrollRequestsRouter from "./enroll-requests.js";
import categoryRouter from "./category.js";


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
router.use("/classes", classesRouter);
router.use("/assignment", assignmentRouter);
router.use("/rubric", rubricRouter);
router.use("/users", ensureUser, usersRoutes);
router.use("/students", ensureUser, studentsRouter);
router.use("/enroll-requests", ensureUser, enrollRequestsRouter);
router.use("/notifs", ensureUser, notifsRouter);
router.use("/category", categoryRouter);
router.use("/submit", ensureUser, submitRouter);
router.use("/review", ensureUser, reviewRouter);
router.use("/grade", ensureUser, gradesRouter);

router.use("/instructors", ensureUser, ensureInstructor, instructorsRouter);

export default router;
